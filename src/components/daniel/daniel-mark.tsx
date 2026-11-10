import { cn } from "@/lib/cn";

export type DanielState = "idle" | "listening" | "thinking" | "speaking";

/**
 * Daniel's face: a navy "D" inside a brand ring. No image, no video; the motion
 * lives in globals.css (.daniel-mark) and only runs under `.motion`.
 * `live` marks move (the launcher, the chat header, the greeting); every other
 * mark stays still, so pages full of "Ask Daniel" buttons stay cheap to render.
 * Decorative: whatever sits next to it carries the name for screen readers.
 */
export function DanielMark({ size = 36, state = "idle", live, className }: { size?: number; state?: DanielState; live?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-state={state}
      data-live={live ? "" : undefined}
      className={cn("daniel-mark", className)}
      style={{ "--size": `${size}px` } as React.CSSProperties}
    >
      <span className="daniel-mark__glow" />
      <span className="daniel-mark__ring" />
      <span className="daniel-mark__core">D</span>
    </span>
  );
}

/** The small "AI" chip that sits next to Daniel's name everywhere, so nobody mistakes him for a person. */
export function AiChip({ label, tone = "light", className }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-[3px] text-[10px] font-semibold uppercase leading-none tracking-[0.06em]",
        tone === "light" ? "bg-navy/10 text-navy-deep" : "bg-white/15 text-white ring-1 ring-white/20",
        className,
      )}
    >
      {label}
    </span>
  );
}
