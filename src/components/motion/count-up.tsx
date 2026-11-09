"use client";

import { useEffect, useRef } from "react";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * A number that counts up when it scrolls into view. Server HTML holds the
 * final value, so it reads correctly without JavaScript, on slow networks and
 * for reduced motion. Updates go straight to the DOM (no re-renders).
 *
 * The real number stays on the page until the figure is about to scroll up into
 * view; only then does it drop to 0, out of sight, and count once visible. So a
 * page captured without scrolling to it (full-page screenshots, link previews,
 * print) never shows zeros, and a figure reached from below stays put.
 */
export function CountUp({ value, prefix = "", suffix = "", duration = 1800, className }: { value: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;

    const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = format(value * easeOutExpo(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    let primed = false;
    // Just below the screen: reset to 0 while still out of sight.
    const prime = new IntersectionObserver(
      (entries) => {
        const e = entries.find((x) => x.isIntersecting);
        if (!e) return;
        prime.disconnect();
        if (e.boundingClientRect.top > 0) {
          primed = true;
          el.textContent = format(0);
        }
      },
      { rootMargin: "0px 0px 30% 0px" },
    );
    // On screen: count up, but only if it was reset on the way in.
    const start = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        start.disconnect();
        prime.disconnect();
        if (primed) run();
      },
      { threshold: 0.4 },
    );
    prime.observe(el);
    start.observe(el);
    return () => {
      prime.disconnect();
      start.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {`${prefix}${value.toLocaleString("en-US")}${suffix}`}
    </span>
  );
}
