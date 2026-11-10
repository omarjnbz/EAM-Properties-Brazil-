/**
 * Receives roadmap, contact and guide-download (newsletter) submissions, plus
 * the chat's "Plan my move" answers (type "chat"), and delivers each one to
 * LEADS_WEBHOOK_URL (src/lib/leads.ts).
 *
 * Before delivery the AI adds a hot / warm / cold score and a two-line summary
 * for the advisors (src/lib/chat/lead.ts); if it is slow or down, the lead goes
 * out without them.
 *
 * A visitor only sees "success" once the lead has been delivered. If delivery
 * fails, or the webhook is missing in production, they are sent to WhatsApp
 * instead, so no lead is silently lost.
 */
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import { SITE } from "@/content/site";
import { analyseLead } from "@/lib/chat/lead";
import { LEAD_FIELDS, MAX_FIELD, deliverLead, pagePath, type LeadType } from "@/lib/leads";

const GUIDES = new Set(["brazil", "argentina"]);
const TYPES: LeadType[] = ["roadmap", "contact", "guide", "chat"];
const FORM_NAMES: Record<LeadType, string> = { roadmap: "Free roadmap form", contact: "Contact form", guide: "Guide download form", chat: "Chat assistant's Plan my move questions" };
/** Fields a visitor can submit; score, summary and transcript only ever come from the server. */
const SUBMITTED = LEAD_FIELDS.filter((k) => k !== "score" && k !== "summary" && k !== "transcript");

const FAILED = `We couldn't send your details just now. Please message us on WhatsApp (${SITE.whatsappDisplay}); a real advisor replies within 60 minutes.`;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, MAX_FIELD) : "");
  const type = field("type") as LeadType;
  const name = field("name");
  const whatsapp = field("whatsapp");

  if (!TYPES.includes(type)) {
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

  const submitted = Object.fromEntries(SUBMITTED.map((k) => [k, field(k)]));
  // The AI reads the submission as if the visitor had typed it, and only adds the score and summary.
  const formText = [FORM_NAMES[type], ...SUBMITTED.filter((k) => submitted[k]).map((k) => `${k}: ${submitted[k]}`)].join("\n");
  const insight = await analyseLead([{ role: "user", content: formText }], 6000);

  const delivery = await deliverLead({
    ...submitted,
    score: insight?.score ?? "",
    summary: insight?.summary ?? "",
    type,
    page: pagePath(request.headers.get("referer")),
    visitorCountry: request.headers.get("x-vercel-ip-country") ?? "",
  });
  if (delivery === "failed") {
    return Response.json({ ok: false, error: FAILED }, { status: 502 });
  }

  // Conversion event for Vercel Web Analytics (custom events need the Pro plan).
  // Sent after the response so the visitor never waits for it.
  if (delivery === "sent") {
    const route = { type, guide: field("guide"), destination: field("destination"), goal: field("goal") };
    const headers = request.headers;
    after(() => track("Lead", route, { request: { headers } }).catch(() => {}));
  }
  return Response.json({ ok: true });
}
