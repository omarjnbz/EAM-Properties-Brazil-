/**
 * Receives roadmap, contact and guide-download (newsletter) submissions and
 * delivers each one to LEADS_WEBHOOK_URL as JSON.
 *
 * The webhook is any URL that accepts a JSON POST: today a Google Apps Script
 * that appends a row to the leads Sheet and emails the team
 * (scripts/leads-webhook.gs); later a CRM or Zapier/Make hook, with no code change.
 *
 * A visitor only sees "success" once the lead has been delivered. If delivery
 * fails, or the webhook is missing in production, they are sent to WhatsApp
 * instead, so no lead is silently lost.
 */
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import { SITE } from "@/content/site";

const MAX_FIELD = 2000;
const GUIDES = new Set(["brazil", "argentina"]);

/** Every field the site's forms send, in the order the Sheet shows them. */
const FIELDS = [
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
] as const;

const FAILED = `We couldn't send your details just now. Please message us on WhatsApp (${SITE.whatsappDisplay}); a real advisor replies within 60 minutes.`;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, MAX_FIELD) : "");
  const type = field("type");
  const name = field("name");
  const whatsapp = field("whatsapp");

  if (!["roadmap", "contact", "guide"].includes(type)) {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!name || !/^\+?[0-9 ()\-]{8,}$/.test(whatsapp)) {
    return Response.json({ ok: false, error: "Please add your name and a contact number with country code." }, { status: 422 });
  }

  if (type === "guide") {
    if (!GUIDES.has(field("guide"))) {
      return Response.json({ ok: false, error: "Please choose a guide." }, { status: 422 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email")) || !field("job")) {
      return Response.json({ ok: false, error: "Please add your email and your job." }, { status: 422 });
    }
    if (field("consent") !== "yes") {
      return Response.json({ ok: false, error: "Please tick the box so we can send you the guide." }, { status: 422 });
    }
  }

  const lead = {
    submittedAt: new Date().toISOString(),
    type,
    ...Object.fromEntries(FIELDS.map((k) => [k, field(k)])),
    page: pagePath(request.headers.get("referer")),
    visitorCountry: request.headers.get("x-vercel-ip-country") ?? "",
  };

  // Routing data only in the logs; never personal details.
  const route = { type, guide: field("guide"), destination: field("destination"), goal: field("goal") };

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.VERCEL_ENV === "production") {
      console.error("[enquiry] LEADS_WEBHOOK_URL is not set: lead NOT delivered", route);
      return Response.json({ ok: false, error: FAILED }, { status: 503 });
    }
    // Local and preview builds: accept so the forms can be tested without a Sheet.
    console.info("[enquiry] no LEADS_WEBHOOK_URL (test mode), not delivered", route);
    return Response.json({ ok: true });
  }

  const delivered = await deliver(webhook, { ...lead, secret: process.env.LEADS_WEBHOOK_SECRET ?? "" });
  if (!delivered) {
    console.error("[enquiry] webhook delivery failed", route);
    return Response.json({ ok: false, error: FAILED }, { status: 502 });
  }

  console.info("[enquiry] delivered", route);
  // Conversion event for Vercel Web Analytics (custom events need the Pro plan).
  // Sent after the response so the visitor never waits for it.
  const headers = request.headers;
  after(() => track("Lead", route, { request: { headers } }).catch(() => {}));
  return Response.json({ ok: true });
}

/**
 * Posts the lead and treats any 2xx reply as delivered, unless the reply is JSON
 * with `ok: false` (how the Apps Script reports a wrong secret or a Sheet error).
 * Google Apps Script answers through a redirect, which fetch follows.
 */
async function deliver(url: string, payload: object) {
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

/** The page the form was sent from, without the domain or query string. */
function pagePath(referer: string | null) {
  if (!referer) return "";
  try {
    return new URL(referer).pathname;
  } catch {
    return "";
  }
}
