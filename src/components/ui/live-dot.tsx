import { cn } from "@/lib/cn";

/** A status dot with a soft ping ring (transform + opacity only). */
export function LiveDot({ className, color = "bg-leaf", ring }: { className?: string; color?: string; ring?: string }) {
  return (
    <span className={cn("relative inline-flex shrink-0 rounded-full", className)} aria-hidden>
      <span className={cn("absolute inset-0 rounded-full animate-ping-soft", color)} />
      <span className={cn("relative inline-flex size-full rounded-full", color, ring)} />
    </span>
  );
}
