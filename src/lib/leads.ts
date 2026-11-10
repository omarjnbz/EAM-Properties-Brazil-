/**
 * Delivers a website lead (a form, or contact details shared in the AI chat)
 * to LEADS_WEBHOOK_URL as JSON.
 *
 * The webhook is any URL that accepts a JSON POST: today a Google Apps Script
 * that appends a row to the leads Sheet and emails the team
 * (scripts/leads-webhook.gs); later a CRM or Zapier/Make hook, with no code change.
 *
 * Server-only.
 */

export const MAX_FIELD = 2000;

/** Every field a lead can carry, in the order the Sheet shows them (see COLUMNS in the Apps Script). */
export const LEAD_FIELDS = [
  "name",
  "whatsapp",
  "email",
  "nationality",
  "currentCountry",
  "destination",
  "goal",
  "budget",
  "familySize",
  "language",
  "message",
  "job",
  "guide",
  "consent",
  // Added by the AI (src/lib/chat/lead.ts): hot / warm / cold, and two lines for the advisor.
  "score",
  "summary",
  // AI chat leads only: the conversation the details came from.
  "transcript",
] as const;

export type LeadField = (typeof LEAD_FIELDS)[number];
export type LeadType = "roadmap" | "contact" | "guide" | "chat" | "booking";
export type Lead = { type: LeadType; page: string; visitorCountry: string } & Partial<Record<LeadField, string>>;

/**
 * "sent": the webhook accepted it. "test": no webhook outside production, so it
 * was only logged (forms and chat can be tried without a Sheet). "failed": not
 * delivered; the visitor must be pointed to WhatsApp instead.
 */
export type Delivery = "sent" | "test" | "failed";

export async function deliverLead(lead: Lead): Promise<Delivery> {
  // Routing data only in the logs; never personal details.
  const route = { type: lead.type, destination: lead.destination ?? "", goal: lead.goal ?? "", score: lead.score ?? "" };
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.VERCEL_ENV === "production") {
      console.error("[lead] LEADS_WEBHOOK_URL is not set: lead NOT delivered", route);
      return "failed";
    }
    console.info("[lead] no LEADS_WEBHOOK_URL (test mode), not delivered", route);
    return "test";
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    ...Object.fromEntries(LEAD_FIELDS.map((k) => [k, (lead[k] ?? "").slice(0, k === "transcript" ? 6000 : MAX_FIELD)])),
    type: lead.type,
    page: lead.page,
    visitorCountry: lead.visitorCountry,
    secret: process.env.LEADS_WEBHOOK_SECRET ?? "",
  };
  const ok = await post(webhook, payload);
  if (ok) console.info("[lead] delivered", route);
  else console.error("[lead] webhook delivery failed", route);
  return ok ? "sent" : "failed";
}

/**
 * Posts the lead and treats any 2xx reply as delivered, unless the reply is JSON
 * with `ok: false` (how the Apps Script reports a wrong secret or a Sheet error).
 * Google Apps Script answers through a redirect, which fetch follows.
 */
async function post(url: string, payload: object) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const text = await res.text();
    try {
      return (JSON.parse(text) as { ok?: unknown }).ok !== false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
}

/** The page a request came from, without the domain or query string. */
export function pagePath(referer: string | null) {
  if (!referer) return "";
  try {
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}
