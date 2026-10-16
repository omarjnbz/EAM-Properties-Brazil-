"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/* One shared minute ticker for every clock on the page. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 15_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

const formatters = new Map<string, Intl.DateTimeFormat>();
function format(minute: number, timeZone: string) {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    formatters.set(timeZone, f);
  }
  return f.format(new Date(minute * 60_000));
}

/** Local time in a city, updated every minute. Renders "--:--" until hydrated. */
export function LiveClock({ timeZone, className }: { timeZone: string; className?: string }) {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <time className={cn("tabular-nums", className)} suppressHydrationWarning>
      {minute === null ? "--:--" : format(minute, timeZone)}
    </time>
  );
}
