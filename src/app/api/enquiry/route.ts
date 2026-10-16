/**
 * Receives roadmap, contact and guide-download (newsletter) submissions.
 *
 * Draft behaviour: validates and acknowledges. Before launch this must create the
 * lead in the CRM and send an instant WhatsApp notification to the on-duty
 * advisor (see "Behind the scenes" in the content document). Until then,
 * submissions are not stored anywhere.
 */
const MAX_FIELD = 2000;
const GUIDES = new Set(["brazil", "argentina"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, MAX_FIELD) : "");
  const type = field("type");
  const name = field("name");
  const whatsapp = field("whatsapp");

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

  // Log routing data only; never personal details.
  console.info("[enquiry]", { type, guide: field("guide"), destination: field("destination"), goal: field("goal"), language: field("language") });

  return Response.json({ ok: true });
}
