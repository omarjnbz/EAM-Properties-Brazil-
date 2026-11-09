/**
 * Website chat assistant, powered by OpenAI or Groq (both OpenAI-style chat
 * APIs; see src/lib/chat/providers.ts for which one answers and the fallback).
 *
 * The API keys stay on the server (.env.local / the host's env settings). The
 * reply streams back as plain text so the widget can render it word by word.
 * Message content is never logged; only the provider and token counts.
 */
import { SYSTEM_PROMPT } from "@/lib/chat/knowledge";
import { chatProviders, type ChatProvider } from "@/lib/chat/providers";

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

/** Asks one provider; null when it can't answer right now (so the next one can try). */
async function ask(provider: ChatProvider, messages: ChatMessage[], signal: AbortSignal) {
  const response = await fetch(provider.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${provider.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      ...provider.options,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
    signal,
  }).catch(() => null);
  if (response?.ok && response.body) return { response, status: 200 };
  console.warn(`[chat] ${provider.id} error`, response?.status ?? "network");
  await response?.body?.cancel().catch(() => {});
  return { response: null, status: response?.status ?? 0 };
}

export async function POST(request: Request) {
  const providers = chatProviders();
  if (providers.length === 0) {
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

  // First choice, then the other provider if it has a key.
  let upstream: Response | null = null;
  let used: ChatProvider | null = null;
  let status = 0;
  for (const provider of providers) {
    const attempt = await ask(provider, messages, request.signal);
    status = attempt.status;
    if (attempt.response) {
      upstream = attempt.response;
      used = provider;
      break;
    }
    if (request.signal.aborted) break;
  }
  if (!upstream?.body || !used) {
    return Response.json({ error: BUSY }, { status: status === 429 ? 429 : 502 });
  }

  // Both providers stream server-sent events; forward only the text deltas.
  const provider = used.id;
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
            // OpenAI sends usage in a final chunk; Groq under x_groq.
            const usage = event.usage ?? event.x_groq?.usage;
            if (usage) {
              const cached = usage.prompt_tokens_details?.cached_tokens ?? 0;
              console.info(`[chat] ${provider} tokens: prompt ${usage.prompt_tokens} (cached ${cached}), completion ${usage.completion_tokens}`);
            }
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
