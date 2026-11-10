/**
 * The founder's bookable slots, from BOOKING.schedule (site.ts): which 30-minute
 * starts exist, as UTC instants, before busy times are taken out.
 *
 * Pure functions, no I/O, so the same rules check a slot on the way in (listing)
 * and on the way out (booking).
 */
import { BOOKING } from "@/content/site";

const S = BOOKING.schedule;
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export type Interval = { start: number; end: number };

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Every scheduled slot start from `now` (plus the notice period) to the booking horizon. */
export function scheduledSlots(now = Date.now()): number[] {
  const earliest = now + S.minNoticeHours * 60 * MINUTE;
  const until = now + S.horizonDays * DAY;
  const offset = S.utcOffsetHours * 60 * MINUTE;
  // Midnight in Dubai of the current Dubai date, as a UTC instant.
  const local = new Date(now + offset);
  let dayStart = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - offset;

  const first = minutesOf(S.firstStart);
  const last = minutesOf(S.lastStart);
  const slots: number[] = [];
  for (; dayStart < until; dayStart += DAY) {
    const weekday = new Date(dayStart + offset).getUTCDay();
    if (!(S.days as readonly number[]).includes(weekday)) continue;
    for (let m = first; m <= last; m += BOOKING.minutes) {
      const start = dayStart + m * MINUTE;
      if (start >= earliest && start < until) slots.push(start);
    }
  }
  return slots;
}

/** The window the slots cover, for the free/busy query. */
export function scheduleWindow(now = Date.now()) {
  return { start: now, end: now + S.horizonDays * DAY + DAY };
}

/** True when a slot is one the schedule offers (guards the booking endpoint). */
export function isScheduledSlot(start: number, now = Date.now()) {
  return scheduledSlots(now).includes(start);
}

export const slotEnd = (start: number) => start + BOOKING.minutes * MINUTE;

/** Slots that don't overlap any busy interval. */
export function freeSlots(slots: number[], busy: Interval[]) {
  return slots.filter((start) => {
    const end = slotEnd(start);
    return !busy.some((b) => start < b.end && end > b.start);
  });
}
