/**
 * The AI side of lead handling (in place of a CRM):
 *   - spots contact details a visitor types into the chat;
 *   - turns a chat, or a form submission, into a lead record for the advisors:
 *     the fields the forms collect, a hot / warm / cold score and a two-line summary.
 *
 * One short, non-streamed call to the same provider as the chat (cheapest
 * settings). If the AI is slow or down, the lead still goes out without the
 * extras: a lead must never be lost because the summary failed.
 *
 * Server-only.
 */
import { chatProviders } from "./providers";

type Message = { role: "user" | "assistant"; content: string };

export type LeadInsight = {
  name: string;
  whatsapp: string;
  email: string;
  nationality: string;
  currentCountry: string;
  destination: string;
  goal: string;
  budget: string;
  familySize: string;
  language: string;
  score: string;
  summary: string;
};

const KEYS: (keyof LeadInsight)[] = ["name", "whatsapp", "email", "nationality", "currentCountry", "destination", "goal", "budget", "familySize", "language", "score", "summary"];

const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i;
// A phone number: 9 to 15 digits, optionally starting with + or 00, with single spaces,
// dots, dashes or brackets between them. Years ("2026 2027") and amounts stay below 9 digits.
const PHONE = /(?:\+|\b)\d(?:[\s().-]?\d){8,14}\b/;

/** True when a message contains a phone number or an email address. */
export function hasContactDetails(text: string) {
  return EMAIL.test(text) || PHONE.test(text);
}

/** The contact details themselves, without AI (the fallback when the AI call fails). */
export function contactDetails(text: string) {
  return { whatsapp: text.match(PHONE)?.[0].trim() ?? "", email: text.match(EMAIL)?.[0] ?? "" };
}

const INSTRUCTIONS = `You turn a visitor's conversation with EAM Global's website (a migration firm in Dubai) into a lead record for its human advisors.
Reply with ONE JSON object and nothing else. Keys (all strings, "" when unknown): ${KEYS.join(", ")}.
- Use only what the VISITOR said or entered. Never invent or guess.
- whatsapp: the visitor's phone number as given, with the country code if they gave one.
- language: the language the visitor writes in, in English (e.g. "Arabic").
- destination: the country or countries they are interested in.
- goal: one of "Live abroad", "Second passport", "Visit or travel", "Business", "Reapply after a refusal", "Other".
- familySize: number of people moving, if stated.
- score: "hot" (wants to start or talk now, or has a clear plan with budget or timeline), "warm" (real interest in their own case, details missing), "cold" (general questions only).
- summary: at most two short sentences in English for the advisor: who they are, what they want, anything urgent.`;

/**
 * Reads a chat (or a form, passed as one visitor message) and returns the lead
 * fields, score and summary; null if no AI answered in time.
 */
export async function analyseLead(messages: Message[], timeoutMs = 8000): Promise<LeadInsight | null> {
  const transcript = messages.map((m) => `${m.role === "user" ? "VISITOR" : "WEBSITE ASSISTANT"}: ${m.content}`).join("\n\n");
  const signal = AbortSignal.timeout(timeoutMs);
  for (const provider of chatProviders()) {
    // The chat's model, with settings for a quick, small, structured answer.
    const { model } = provider.options;
    const options =
      provider.id === "openai"
        ? { model, reasoning_effort: "low", max_completion_tokens: 900 }
        : { model, reasoning_effort: "low", include_reasoning: false, temperature: 0, max_completion_tokens: 700 };
    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${provider.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...options,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: INSTRUCTIONS },
            { role: "user", content: transcript.slice(-12_000) },
          ],
        }),
        signal,
      });
      if (!res.ok) {
        console.warn(`[lead] ${provider.id} analysis error`, res.status);
        continue;
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "") as Record<string, unknown>;
      const insight = Object.fromEntries(KEYS.map((k) => [k, typeof parsed[k] === "string" ? (parsed[k] as string).trim().slice(0, 600) : ""])) as LeadInsight;
      insight.score = ["hot", "warm", "cold"].includes(insight.score.toLowerCase()) ? insight.score.toLowerCase() : "";
      return insight;
    } catch (err) {
      if (signal.aborted) break;
      console.warn(`[lead] ${provider.id} analysis failed`, err instanceof Error ? err.name : "error");
    }
  }
  return null;
}
