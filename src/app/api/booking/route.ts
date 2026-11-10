/**
 * Books the video call with the founder (src/lib/booking).
 * POST { start (ISO), name, email, whatsapp, country?, notes?, locale? }
 *   → { ok: true, start, meetLink }  booked; Google emails the visitor the invitation
 *   → { ok: false, reason: "taken" } someone took the slot meanwhile: pick another
 *   → { ok: false, error }           invalid details, or the calendar is unavailable
 * After a booking, the lead (with the AI score and summary) goes to the team like
 * every other lead, without making the visitor wait.
 */
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import { SITE } from "@/content/site";
import { bookSlot } from "@/lib/booking/calendar";
import { isScheduledSlot } from "@/lib/booking/schedule";
import { analyseLead } from "@/lib/chat/lead";
import { MAX_FIELD, deliverLead, pagePath } from "@/lib/leads";

const LANGUAGES: Record<string, string> = { en: "English", ar: "Arabic", pt: "Portuguese" };
const FAILED = `We couldn't book that time just now. Please try again, or message us on WhatsApp (${SITE.whatsappDisplay}).`;

// Best-effort, per server instance: a handful of bookings a minute per visitor.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, error: "Please wait a moment and try again." }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const field = (key: string) => (typeof body?.[key] === "string" ? (body[key] as string).trim().slice(0, MAX_FIELD) : "");
  const start = Date.parse(field("start"));
  const who = {
    name: field("name"),
    email: field("email"),
    whatsapp: field("whatsapp"),
    country: field("country"),
    notes: field("notes"),
    language: LANGUAGES[field("locale")] ?? "",
  };

  if (!who.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(who.email) || !/^\+?[0-9 ()\-]{8,}$/.test(who.whatsapp)) {
    return Response.json({ ok: false, error: "Please add your name, email and WhatsApp number with country code." }, { status: 422 });
  }
  if (!Number.isFinite(start) || !isScheduledSlot(start)) {
    return Response.json({ ok: false, reason: "taken", error: "That time is no longer available." }, { status: 409 });
  }

  const result = await bookSlot(start, who);
  if (!result.ok) {
    return result.reason === "taken"
      ? Response.json({ ok: false, reason: "taken", error: "That time was just taken. Please pick another." }, { status: 409 })
      : Response.json({ ok: false, error: FAILED }, { status: 502 });
  }

  // The booking is made; the lead and the analytics event follow in the background.
  const page = pagePath(request.headers.get("referer"));
  const visitorCountry = request.headers.get("x-vercel-ip-country") ?? "";
  const headers = request.headers;
  after(async () => {
    const when = new Date(start).toISOString();
    const message = [`Booked the ${when} video call with the founder.`, who.notes].filter(Boolean).join(" ");
    const insight = await analyseLead([{ role: "user", content: `Video call booking\nname: ${who.name}\ncountry of interest: ${who.country}\nlanguage: ${who.language}\nnotes: ${who.notes}` }], 6000);
    const delivery = await deliverLead({
      type: "booking",
      name: who.name,
      whatsapp: who.whatsapp,
      email: who.email,
      destination: who.country,
      language: who.language,
      message,
      score: insight?.score || "hot",
      summary: insight?.summary ?? "",
      page,
      visitorCountry,
    });
    if (delivery === "sent") await track("Lead", { type: "booking", destination: who.country }, { request: { headers } }).catch(() => {});
  });

  return Response.json({ ok: true, start: new Date(start).toISOString(), meetLink: result.meetLink });
}
