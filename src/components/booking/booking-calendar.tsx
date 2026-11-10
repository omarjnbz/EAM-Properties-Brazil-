"use client";

import { useState } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { CalendarBlank } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { BOOKING } from "@/content/site";
import type { Dictionary } from "@/content/i18n";

/**
 * Google's booking calendar, loaded only when the visitor asks for it: the embed
 * pulls in Google's scripts (about 1 MB), which visitors on 2G/3G should never
 * pay for just by scrolling past. The plain booking page link always works too.
 */
export function BookingCalendar({ copy }: { copy: Dictionary["booking"] }) {
  const [shown, setShown] = useState(false);
  // Google's page is partly transparent, so the loading line must go once it arrives.
  const [loaded, setLoaded] = useState(false);

  if (!shown) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 px-6 py-12 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/[0.07]">
          <CalendarBlank weight="light" className="size-7" aria-hidden />
        </span>
        <button
          type="button"
          onClick={() => setShown(true)}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] font-medium text-white transition-[transform,background-color] duration-300 ease-fluid hover:bg-ink-2 active:scale-[0.97]"
        >
          {copy.show}
        </button>
        <p className="text-[13px] text-ink-3">{copy.timezone}</p>
        <OpenLink copy={copy} />
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[760px] md:h-[640px]">
        {!loaded && (
          <p className="absolute inset-0 grid place-items-center text-[14px] text-ink-3" aria-hidden>
            {copy.loading}
          </p>
        )}
        <iframe src={BOOKING.embedHref} title={copy.calendarTitle} onLoad={() => setLoaded(true)} className="relative size-full border-0" />
      </div>
      <div className="border-t border-line px-6 py-4 text-center">
        <OpenLink copy={copy} />
      </div>
    </div>
  );
}

function OpenLink({ copy }: { copy: Dictionary["booking"] }) {
  return (
    <a
      href={BOOKING.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-2 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
    >
      {copy.open}
      <ArrowSquareOut className="size-3.5" aria-hidden />
    </a>
  );
}
