/**
 * Website chat assistant ("Daniel"), powered by OpenAI or Groq (both OpenAI-style
 * chat APIs; see src/lib/chat/providers.ts for which one answers and the fallback).
 *
 * The API keys stay on the server (.env.local / the host's env settings). The
 * reply streams back as plain text so the widget can render it word by word.
 * Message content is never logged; only the provider and token counts.
 *
 * Request body: { messages, page?, locale?, cards? }
 *   page    the path the visitor is on, without the language prefix ("/uae-golden-visa")
 *   locale  the site language they are reading: en | ar | pt
 *   cards   true when the widget renders [[program:…]], [[passport:…]], [[handoff]] and [[plan]]
 * Invalid optional fields are ignored, not rejected.
 *
 * Leads: when the visitor's latest message contains a phone number or an email,
 * the chat is turned into a lead (src/lib/chat/lead.ts) and delivered to the team
 * before the reply, so the assistant can truthfully confirm it. The response then
 * carries `X-Lead: sent | failed`.
 */
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import { SYSTEM_PROMPT, CARDS_GUIDE } from "@/lib/chat/knowledge";
import { chatProviders, type ChatProvider } from "@/lib/chat/providers";
import { analyseLead, contactDetails, hasContactDetails } from "@/lib/chat/lead";
import { deliverLead, pagePath } from "@/lib/leads";

const MAX_MESSAGE = 1000; // characters per message
const MAX_HISTORY = 10; // messages sent to the model
const RATE_LIMIT = 12; // messages per visitor per minute

const BUSY = "Our assistant is busy right now. Please message an advisor on WhatsApp; a real person replies within 60 minutes.";
const LANGUAGES = { en: "English", ar: "Arabic", pt: "Portuguese" } as const;

type ChatMessage = { role: "user" | "assistant"; content: string };
type PromptMessage = { role: "system" | "user" | "assistant"; content: string };

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

/** The optional context fields, validated; anything else is dropped. */
function parseContext(body: unknown) {
  const b = (body ?? {}) as { page?: unknown; locale?: unknown; cards?: unknown };
  const page = typeof b.page === "string" && /^\/[a-z0-9/#-]{0,80}$/.test(b.page) ? b.page : null;
  const locale = typeof b.locale === "string" && b.locale in LANGUAGES ? (b.locale as keyof typeof LANGUAGES) : null;
  return { page, locale, cards: b.cards === true };
}

/** Asks one provider; null when it can't answer right now (so the next one can try). */
async function ask(provider: ChatProvider, messages: PromptMessage[], signal: AbortSignal) {
  const response = await fetch(provider.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${provider.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...provider.options, stream: true, messages }),
    signal,
  }).catch(() => null);
  if (response?.ok && response.body) return { response, status: 200 };
  console.warn(`[chat] ${provider.id} error`, response?.status ?? "network");
  await response?.body?.cancel().catch(() => {});
  return { response: null, status: response?.status ?? 0 };
}

/** Saves the conversation as a lead. Returns what to tell the model and the X-Lead header. */
async function captureLead(messages: ChatMessage[], page: string, request: Request) {
  const insight = await analyseLead(messages);
  const visitorText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const found = insight ?? { ...contactDetails(visitorText), summary: "" };
  // The AI decides whether a number is really a contact number; without the AI, trust the pattern.
  if (!found.whatsapp && !found.email) return null;

  const transcript = messages.map((m) => `${m.role === "user" ? "Visitor" : "Daniel (AI)"}: ${m.content}`).join("\n\n");
  const delivery = await deliverLead({
    ...(insight ?? {}),
    whatsapp: found.whatsapp,
    email: found.email,
    // The summary has its own column; without one, the visitor's last message stands in.
    message: found.summary ? "" : messages.at(-1)!.content,
    type: "chat",
    transcript,
    page,
    visitorCountry: request.headers.get("x-vercel-ip-country") ?? "",
  });

  if (delivery === "sent") {
    const headers = request.headers;
    const route = { type: "chat", destination: insight?.destination ?? "", goal: insight?.goal ?? "" };
    after(() => track("Lead", route, { request: { headers } }).catch(() => {}));
  }
  return delivery === "failed"
    ? {
        header: "failed",
        note: "WEBSITE NOTE: The visitor just shared contact details, but they could NOT be passed to the advisors (technical problem). Apologise briefly and ask them to message an advisor on WhatsApp instead.",
      }
    : {
        header: "sent",
        note: "WEBSITE NOTE: The visitor's contact details and this conversation were just passed to EAM Global's advisors. Thank them briefly and say an advisor will contact them within 60 minutes (on WhatsApp, or by email if that is all they gave). You may offer the paid video call with Alaa as well. Do not ask for the same details again.",
      };
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

  const body = await request.json().catch(() => null);
  const messages = parseMessages(body);
  if (!messages) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { page, locale, cards } = parseContext(body);

  // Without the leads webhook in production, contact details can't reach anyone,
  // so the assistant must not collect them (local and preview builds only log leads).
  const leadsOffline = !process.env.LEADS_WEBHOOK_URL && process.env.VERCEL_ENV === "production";

  // The cached system prompt stays first and identical; per-visitor context follows it.
  const context = [
    page && `The visitor is on the page ${page}.`,
    locale && `The site is shown in ${LANGUAGES[locale]}.`,
    cards && CARDS_GUIDE,
    leadsOffline &&
      "WEBSITE NOTE: Advisors cannot receive contact details through this chat right now. Do not ask for a name, phone number or email; point the visitor to WhatsApp, the free roadmap or the video call (/book) instead.",
  ].filter(Boolean);
  const prompt: PromptMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(context.length ? [{ role: "system" as const, content: context.join("\n") }] : []),
    ...messages,
  ];

  const headers: Record<string, string> = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };
  if (hasContactDetails(messages.at(-1)!.content)) {
    const lead = await captureLead(messages, page?.split("#")[0] || pagePath(request.headers.get("referer")), request);
    if (lead) {
      headers["X-Lead"] = lead.header;
      prompt.push({ role: "system", content: lead.note });
    }
  }

  // First choice, then the other provider if it has a key.
  let upstream: Response | null = null;
  let used: ChatProvider | null = null;
  let status = 0;
  for (const provider of providers) {
    const attempt = await ask(provider, prompt, request.signal);
    status = attempt.status;
    if (attempt.response) {
      upstream = attempt.response;
      used = provider;
      break;
    }
    if (request.signal.aborted) break;
  }
  if (!upstream?.body || !used) {
    const lead = headers["X-Lead"] ? { "X-Lead": headers["X-Lead"] } : undefined;
    return Response.json({ error: BUSY }, { status: status === 429 ? 429 : 502, headers: lead });
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

  return new Response(text.pipeThrough(new TextEncoderStream()), { headers });
}
