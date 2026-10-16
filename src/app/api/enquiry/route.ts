/**
 * Receives roadmap and contact form submissions.
 *
 * Draft behaviour: validates and acknowledges. Before launch this must create the
 * lead in the CRM and send an instant WhatsApp notification to the on-duty
 * advisor (see "Behind the scenes" in the content document). Until then,
 * submissions are not stored anywhere.
 */
const MAX_FIELD = 2000;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, MAX_FIELD) : "");
  const name = field("name");
  const whatsapp = field("whatsapp");

  if (!name || !/^\+?[0-9 ()\-]{8,}$/.test(whatsapp)) {
    return Response.json({ ok: false, error: "Please add your name and a WhatsApp number with country code." }, { status: 422 });
  }

  // Log routing data only; never personal details.
  console.info("[enquiry]", { type: field("type"), destination: field("destination"), goal: field("goal"), language: field("language") });

  return Response.json({ ok: true });
}
