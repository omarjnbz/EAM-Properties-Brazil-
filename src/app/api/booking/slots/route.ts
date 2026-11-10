/**
 * Free times for the video call with the founder (src/lib/booking).
 * GET → { mode, timeZone, slots: ISO start times, soonest first }.
 * The page's booking picker and the chat assistant both read this.
 */
import { BOOKING } from "@/content/site";
import { availableSlots, bookingMode } from "@/lib/booking/calendar";

export async function GET() {
  const mode = bookingMode();
  try {
    const slots = await availableSlots();
    return Response.json(
      { mode, timeZone: BOOKING.schedule.timeZone, minutes: BOOKING.minutes, slots: slots.map((s) => new Date(s).toISOString()) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[booking] slots unavailable", err instanceof Error ? err.message : "error");
    return Response.json({ mode, error: "Times are unavailable right now." }, { status: 503 });
  }
}
