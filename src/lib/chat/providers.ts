/**
 * The AI services the website chat can use. Both speak the same OpenAI-style
 * chat API, so only the address, key, model and a few settings differ.
 *
 * Which one answers:
 *   CHAT_PROVIDER=openai | groq  picks it explicitly;
 *   otherwise OpenAI when OPENAI_API_KEY is set, else Groq.
 * If the first choice fails (busy, down, out of credit) and the other one has a
 * key, the chat quietly retries there, so visitors still get an answer.
 *
 * Server-only: the keys never reach the browser.
 */
export type ChatProviderId = "openai" | "groq";

export type ChatProvider = {
  id: ChatProviderId;
  url: string;
  apiKey: string;
  /** Model and settings for this provider; the route adds messages and stream. */
  options: Record<string, unknown>;
};

function openai(): ChatProvider | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return {
    id: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    apiKey,
    options: {
      // The cheapest current OpenAI model; repeated input (the site facts) is billed at the cached rate.
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      // low | medium (default) | high. Medium keeps program lists and figures complete.
      reasoning_effort: process.env.OPENAI_REASONING || "medium",
      // Reasoning tokens count toward this cap, so it sits above Groq's.
      max_completion_tokens: 1600,
      stream_options: { include_usage: true },
    },
  };
}

function groq(): ChatProvider | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return {
    id: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey,
    options: {
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      // "medium" keeps lists and figures accurate; "low" answers faster but skips details.
      reasoning_effort: process.env.GROQ_REASONING || "medium",
      include_reasoning: false,
      temperature: 0.3,
      max_completion_tokens: 1200,
    },
  };
}

/** The providers to try, in order. Empty when no key is set. */
export function chatProviders(): ChatProvider[] {
  const available = { openai: openai(), groq: groq() };
  const wanted = process.env.CHAT_PROVIDER?.trim().toLowerCase();
  const first: ChatProviderId = wanted === "groq" || wanted === "openai" ? wanted : available.openai ? "openai" : "groq";
  const second: ChatProviderId = first === "openai" ? "groq" : "openai";
  return [available[first], available[second]].filter((p): p is ChatProvider => p !== null);
}

/** True when at least one AI key is set; the "Ask AI" button only shows then. */
export function chatEnabled() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY);
}
