"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CalendarCheck } from "@phosphor-icons/react/dist/csr/CalendarCheck";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { VideoCamera } from "@phosphor-icons/react/dist/csr/VideoCamera";
import type { Dictionary } from "@/content/i18n";
import { BOOKING } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/ui/app-link";
import { Field, inputClass } from "@/components/forms/fields";

type Copy = Dictionary["booking"];
type Slots = { status: "loading" } | { status: "error" } | { status: "ready"; slots: string[] };
type Done = { start: string; email: string; meetLink: string | null };

/** Formatting locales: Arabic with Western digits, as the rest of the Arabic site. */
const INTL: Record<Locale, string> = { en: "en-US", ar: "ar-u-nu-latn", pt: "pt-BR" };

/**
 * The site's own booking calendar: days and free times in the visitor's time
 * zone, then name, email and WhatsApp, booked straight into the founder's
 * Google Calendar with a Google Meet link (/api/booking). Times come from
 * /api/booking/slots, which already removes his busy times.
 */
export function BookingPicker({ copy, preview }: { copy: Copy; preview: boolean }) {
  const p = copy.picker;
  const locale = useLocale();
  const tag = INTL[locale];

  const [slots, setSlots] = useState<Slots>({ status: "loading" });
  const [reloads, setReloads] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/booking/slots", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: { slots?: unknown }) => {
        if (!live) return;
        setSlots(Array.isArray(json.slots) ? { status: "ready", slots: json.slots as string[] } : { status: "error" });
      })
      .catch(() => live && setSlots({ status: "error" }));
    return () => {
      live = false;
    };
  }, [reloads]);

  const reload = () => {
    setSlots({ status: "loading" });
    setReloads((n) => n + 1);
  };

  // Everything below runs in the browser only (slots load after mount), so the visitor's own time zone is safe to use.
  const fmt = useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const at = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(tag, { timeZone: tz, ...o });
    const key = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
    const zone = at({ timeZoneName: "long" });
    return {
      // Named from a slot's date, never "now": the page is prerendered, and the name can change with daylight saving.
      zoneName: (iso: string) => zone.formatToParts(new Date(iso)).find((x) => x.type === "timeZoneName")?.value ?? tz,
      dayKey: (iso: string) => key.format(new Date(iso)),
      weekday: at({ weekday: "short" }),
      dayNum: at({ day: "numeric" }),
      month: at({ month: "short" }),
      time: at({ hour: "numeric", minute: "2-digit" }),
      full: at({ weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }),
    };
  }, [tag]);

  const days = useMemo(() => {
    if (slots.status !== "ready") return [];
    const map = new Map<string, string[]>();
    for (const s of slots.slots) {
      const k = fmt.dayKey(s);
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return [...map.entries()].map(([key, times]) => ({ key, times }));
  }, [slots, fmt]);

  const activeDay = days.find((d) => d.key === day) ?? days[0];

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot || sending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, start: slot, locale }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string; error?: string; start?: string; meetLink?: string | null };
      if (json.ok) {
        setDone({ start: json.start ?? slot, email: data.email, meetLink: json.meetLink ?? null });
      } else if (json.reason === "taken") {
        setError(p.taken);
        setSlot(null);
        reload();
      } else {
        setError(json.error || p.timesError);
      }
    } catch {
      setError(p.timesError);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 p-6 sm:p-8 md:p-10" role="status">
        <CheckCircle weight="light" className="size-10 text-leaf-deep" aria-hidden />
        <h3 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em]">{p.doneTitle}</h3>
        <p className="flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[14.5px] text-ink">
          <CalendarCheck weight="light" className="size-[18px] shrink-0" aria-hidden />
          {fmt.full.format(new Date(done.start))}
        </p>
        <p className="text-[16px] leading-relaxed text-ink-3">{p.doneBody.replace("{email}", done.email)}</p>
        {done.meetLink && (
          <a href={done.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy">
            <VideoCamera weight="light" className="size-[18px]" aria-hidden /> {p.joinLink}
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setSlot(null);
            reload();
          }}
          className="mt-2 text-[14px] font-medium text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink"
        >
          {p.another}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 p-6 sm:p-8">
      {preview && <p className="self-start rounded-full bg-sun-soft px-3 py-1.5 text-[12.5px] font-medium text-ink">{p.previewNote}</p>}

      {slots.status === "loading" && <p className="py-16 text-center text-[14px] text-ink-3">{p.loadingTimes}</p>}

      {slots.status === "error" && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-[14.5px] text-ink-3">{p.timesError}</p>
          <button type="button" onClick={reload} className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white hover:bg-ink-2">
            {p.retry}
          </button>
        </div>
      )}

      {slots.status === "ready" && !slot && (
        <>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{p.pickDay}</h3>
              {activeDay && <p className="text-[12.5px] text-ink-3">{p.yourTime.replace("{tz}", fmt.zoneName(activeDay.times[0]))}</p>}
            </div>
            <div className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]" role="radiogroup" aria-label={p.pickDay}>
              {days.map((d) => {
                const date = new Date(d.times[0]);
                const on = d.key === activeDay?.key;
                return (
                  <button
                    key={d.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setDay(d.key)}
                    className={cn(
                      "flex w-[4.25rem] shrink-0 snap-start flex-col items-center rounded-2xl px-2 py-2.5 ring-1 transition-colors duration-200",
                      on ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-ink/10 hover:ring-ink/25",
                    )}
                  >
                    <span className={cn("text-[11.5px] font-medium uppercase tracking-[0.06em]", on ? "text-white/70" : "text-ink-3")}>{fmt.weekday.format(date)}</span>
                    <span className="text-[1.35rem] font-medium leading-tight">{fmt.dayNum.format(date)}</span>
                    <span className={cn("text-[11.5px]", on ? "text-white/70" : "text-ink-3")}>{fmt.month.format(date)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{p.pickTime}</h3>
            {activeDay ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {activeDay.times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSlot(t);
                    }}
                    className="rounded-full bg-white py-2.5 text-[14.5px] font-medium text-ink ring-1 ring-ink/10 transition-[background-color,box-shadow,color] duration-200 hover:bg-leaf hover:text-white hover:ring-leaf"
                  >
                    <bdi dir="ltr">{fmt.time.format(new Date(t))}</bdi>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[14px] text-ink-3">{p.noTimes}</p>
            )}
          </div>
          {error && (
            <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
              {error}
            </p>
          )}
        </>
      )}

      {slots.status === "ready" && slot && (
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
            <span className="flex items-center gap-2 text-[14.5px] text-ink">
              <CalendarCheck weight="light" className="size-[18px] shrink-0" aria-hidden />
              {fmt.full.format(new Date(slot))} · {BOOKING.minutes} min · {BOOKING.price}
            </span>
            <button type="button" onClick={() => setSlot(null)} className="text-[13.5px] font-medium text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink">
              {p.change}
            </button>
          </div>

          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{p.detailsTitle}</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={p.nameLabel} htmlFor="b-name" className="sm:col-span-2">
              <input id="b-name" name="name" required autoComplete="name" className={inputClass} />
            </Field>
            <Field label={p.emailLabel} htmlFor="b-email" hint={p.emailHint} className="sm:col-span-2">
              <input id="b-email" name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} />
            </Field>
            <Field label={p.whatsappLabel} htmlFor="b-whatsapp" hint={p.whatsappHint}>
              <input id="b-whatsapp" name="whatsapp" type="tel" inputMode="tel" required autoComplete="tel" pattern="\+?[0-9 \(\)\-]{8,}" dir="ltr" placeholder="+971 5x xxx xxxx" className={inputClass} />
            </Field>
            <Field label={p.countryLabel} htmlFor="b-country" hint={p.optional}>
              <input id="b-country" name="country" autoComplete="off" className={inputClass} />
            </Field>
            <Field label={p.notesLabel} htmlFor="b-notes" hint={p.optional} className="sm:col-span-2">
              <textarea id="b-notes" name="notes" rows={3} maxLength={1000} className={cn(inputClass, "resize-y")} />
            </Field>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={sending}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-white transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-ink-2 active:scale-[0.97] disabled:opacity-60"
            >
              {sending ? p.booking : p.confirm}
              <ArrowUpRight weight="bold" className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </button>
            <p className="text-[12.5px] text-ink-3">{copy.feeNote}</p>
          </div>
          {error && (
            <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
