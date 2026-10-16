/**
 * Website chat assistant, powered by Groq (OpenAI-compatible API).
 *
 * The API key stays on the server (GROQ_API_KEY in .env.local / the host's env
 * settings). The reply streams back as plain text so the widget can render it
 * word by word. Message content is never logged; only token counts.
 */
import { SYSTEM_PROMPT } from "@/lib/chat/knowledge";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
// "medium" keeps lists and figures accurate; "low" answers faster but skips details.
const REASONING = process.env.GROQ_REASONING || "medium";

const MAX_MESSAGE = 1000; // characters per message
const MAX_HISTORY = 10; // messages sent to the model
const RATE_LIMIT = 12; // messages per visitor per minute

const BUSY = "Our assistant is busy right now. Please message an advisor on WhatsApp; a real person replies within 60 minutes.";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Best-effort, per server instance. Put a shared store (e.g. Upstash) in front before heavy traffic.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw
    .filter(
      (m): m is ChatMessage =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE) }));
  return messages.at(-1)?.role === "user" ? messages : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The assistant is not configured yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ error: "You're sending messages quickly. Please wait a moment and try again." }, { status: 429 });
  }

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      temperature: 0.3,
      max_completion_tokens: 1200,
      reasoning_effort: REASONING,
      include_reasoning: false,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
    signal: request.signal,
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    console.warn("[chat] upstream error", upstream?.status ?? "network");
    return Response.json({ error: BUSY }, { status: upstream?.status === 429 ? 429 : 502 });
  }

  // Groq streams server-sent events; forward only the text deltas.
  let buffer = "";
  const text = upstream.body.pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream<string, string>({
      transform(chunk, controller) {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          try {
            const event = JSON.parse(line.slice(6));
            const delta = event.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(delta);
            const usage = event.x_groq?.usage;
            if (usage) console.info(`[chat] tokens: prompt ${usage.prompt_tokens}, completion ${usage.completion_tokens}`);
          } catch {
            // Ignore keep-alive or partial lines.
          }
        }
      },
    }),
  );

  return new Response(text.pipeThrough(new TextEncoderStream()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
