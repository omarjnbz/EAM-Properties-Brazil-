"use client";

import { useEffect, useRef } from "react";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * A number that counts up when it scrolls into view. Server HTML holds the
 * final value, so it reads correctly without JavaScript, on slow networks and
 * for reduced motion. Updates go straight to the DOM (no re-renders).
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

    el.textContent = format(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {`${prefix}${value.toLocaleString("en-US")}${suffix}`}
    </span>
  );
}
