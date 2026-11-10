/**
 * The site's own booking calendar, backed by the founder's Google Calendar.
 *
 * Mode, from the environment:
 *   "google"   GOOGLE_CALENDAR_CLIENT_ID, _CLIENT_SECRET and _REFRESH_TOKEN are set:
 *              free slots come from his calendar's free/busy, and a booking creates
 *              an event with a Google Meet link and emails the visitor an invitation.
 *   "preview"  no keys, outside production (your computer, preview links): sample
 *              busy times, and bookings are only logged, so the design can be tried.
 *   "off"      no keys in production: the page keeps Google's own booking page.
 *
 * Connecting it (once): a Google Cloud project with the Google Calendar API on, an
 * OAuth client (type "Web application"), and a refresh token from the founder's
 * Google account for the scopes calendar.events and calendar.freebusy. Publish the
 * OAuth app ("In production") or the refresh token expires after 7 days.
 * GOOGLE_CALENDAR_ID picks a calendar other than his main one.
 *
 * Server-only.
 */
import { BOOKING } from "@/content/site";
import { freeSlots, scheduleWindow, scheduledSlots, slotEnd, type Interval } from "./schedule";

export type BookingMode = "google" | "preview" | "off";

export function bookingMode(): BookingMode {
  const { GOOGLE_CALENDAR_CLIENT_ID: id, GOOGLE_CALENDAR_CLIENT_SECRET: secret, GOOGLE_CALENDAR_REFRESH_TOKEN: token } = process.env;
  if (id && secret && token) return "google";
  return process.env.VERCEL_ENV === "production" ? "off" : "preview";
}

const calendarId = () => process.env.GOOGLE_CALENDAR_ID || "primary";
const API = "https://www.googleapis.com/calendar/v3";

/* ------------------------------------------------------------------ Google access */

let cachedToken: { value: string; expires: number } | null = null;

/** A short-lived access token from the stored refresh token (reused until a minute before it expires). */
async function accessToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CALENDAR_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return cachedToken.value;
}

async function google<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`calendar ${res.status}`);
  return (await res.json()) as T;
}

/** Busy times in the founder's calendar (Google appointment bookings included). */
async function googleBusy(window: Interval): Promise<Interval[]> {
  const id = calendarId();
  const json = await google<{ calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }> }>("/freeBusy", {
    timeMin: new Date(window.start).toISOString(),
    timeMax: new Date(window.end).toISOString(),
    items: [{ id }],
  });
  const cal = json.calendars[id] ?? Object.values(json.calendars)[0];
  if (!cal || cal.errors?.length) throw new Error("calendar free/busy unavailable");
  return (cal.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

/* ------------------------------------------------------------------ Preview */

/** Sample busy times for the preview: about one slot in four, the same every time. */
function previewBusy(slots: number[]): Interval[] {
  const busy = (s: number) => {
    const n = Math.round(s / 1_800_000); // the slot's number since 1970, in half hours
    return n % 7 === 3 || n % 11 === 5;
  };
  return slots.filter(busy).map((s) => ({ start: s, end: slotEnd(s) }));
}

/* ------------------------------------------------------------------ Public API */

/** Free slot starts (UTC milliseconds), soonest first. Empty when the mode is "off". */
export async function availableSlots(now = Date.now()): Promise<number[]> {
  const mode = bookingMode();
  if (mode === "off") return [];
  const slots = scheduledSlots(now);
  const busy = mode === "google" ? await googleBusy(scheduleWindow(now)) : previewBusy(slots);
  return freeSlots(slots, busy);
}

export type Booker = { name: string; email: string; whatsapp: string; country: string; notes: string; language: string };

export type BookingResult = { ok: true; meetLink: string | null } | { ok: false; reason: "taken" | "error" };

/** Books a slot (already checked against the schedule). Re-checks it is still free first. */
export async function bookSlot(start: number, who: Booker): Promise<BookingResult> {
  const mode = bookingMode();
  if (mode === "off") return { ok: false, reason: "error" };
  try {
    const free = await availableSlots();
    if (!free.includes(start)) return { ok: false, reason: "taken" };
    if (mode === "preview") {
      console.info("[booking] preview mode: not added to any calendar", { start: new Date(start).toISOString() });
      return { ok: true, meetLink: null };
    }

    const event = await google<{ hangoutLink?: string }>(`/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1&sendUpdates=all`, {
      summary: `EAM Global consultation: ${who.name}`,
      description: [
        `${BOOKING.minutes}-minute video call booked on the EAM Global website.`,
        `Fee: ${BOOKING.price} (send payment details on WhatsApp).`,
        "",
        `Name: ${who.name}`,
        `WhatsApp: ${who.whatsapp}`,
        `Email: ${who.email}`,
        who.country ? `Country of interest: ${who.country}` : null,
        who.language ? `Language: ${who.language}` : null,
        who.notes ? `Notes: ${who.notes}` : null,
      ]
        .filter((l) => l !== null)
        .join("\n"),
      start: { dateTime: new Date(start).toISOString(), timeZone: BOOKING.schedule.timeZone },
      end: { dateTime: new Date(slotEnd(start)).toISOString(), timeZone: BOOKING.schedule.timeZone },
      attendees: [{ email: who.email, displayName: who.name }],
      conferenceData: { createRequest: { requestId: `eam-${start}-${Math.random().toString(36).slice(2, 10)}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      reminders: { useDefault: true },
    });
    return { ok: true, meetLink: event.hangoutLink ?? null };
  } catch (err) {
    console.error("[booking] failed", err instanceof Error ? err.message : "error");
    return { ok: false, reason: "error" };
  }
}
