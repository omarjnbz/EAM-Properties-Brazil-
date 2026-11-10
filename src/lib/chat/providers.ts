/**
 * The AI service behind the website chat (Daniel): OpenAI only. The Groq backup
 * was removed in November 2026; the chat runs on OPENAI_API_KEY alone.
 *
 * Kept as a list of providers so the chat route and the admin panel don't change
 * if a second service is ever added again.
 *
 * Server-only: the key never reaches the browser.
 */
export type ChatProviderId = "openai";

export type ChatProvider = {
  id: ChatProviderId;
  url: string;
  apiKey: string;
  /** Model and settings; the route adds messages and stream. */
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
      // low (default) | medium | high. Tested in EN/AR/PT/ES: low keeps the same
      // accuracy with 60-80% fewer output tokens and answers 2-3x faster.
      reasoning_effort: process.env.OPENAI_REASONING || "low",
      // Sends every chat to the same cache, so the long system prompt is billed at the
      // cached rate after the first message (without it most calls missed the cache).
      prompt_cache_key: "eam-daniel",
      // Reasoning tokens count toward this cap.
      max_completion_tokens: 1600,
      stream_options: { include_usage: true },
    },
  };
}

/** The providers to try, in order: OpenAI, or none when its key is missing. */
export function chatProviders(): ChatProvider[] {
  const provider = openai();
  return provider ? [provider] : [];
}

/** True when the OpenAI key is set; Daniel only shows then. */
export function chatEnabled() {
  return Boolean(process.env.OPENAI_API_KEY);
}
