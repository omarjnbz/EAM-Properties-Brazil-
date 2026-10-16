import { cn } from "@/lib/cn";

type Props = {
  /** Unique per page: used for the circular text path. */
  id: string;
  ring?: string;
  center?: string;
  sub?: string;
  className?: string;
  rotate?: number;
  /** "load" stamps on page load; "static" just sits there. */
  animate?: "load" | "static";
  delay?: number;
};

/** A rubber passport stamp, drawn in SVG. Inherits colour from `currentColor`. */
export function Stamp({
  id,
  ring = "APPROVED • EAM GLOBAL • DUBAI HQ • ",
  center = "APPROVED",
  sub = "2026",
  className,
  rotate = -12,
  animate = "static",
  delay = 0,
}: Props) {
  const pathId = `stamp-${id}`;
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={cn(animate === "load" ? "load-stamp" : "stamp-static", className)}
      style={{ "--stamp-rot": `${rotate}deg`, "--d": delay } as React.CSSProperties}
    >
      <defs>
        <path id={pathId} d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" />
      </defs>
      <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="100" cy="100" r="87" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text fill="currentColor" fontFamily="var(--font-mono)" fontSize="12.5" fontWeight="600" letterSpacing="2">
        <textPath href={`#${pathId}`} textLength="455" lengthAdjust="spacing">
          {ring}
        </textPath>
      </text>
      <path d="M78 96 l14 14 l30 -32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="100" y="134" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" letterSpacing="3">
        {center}
      </text>
      <text x="100" y="148" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2.5">
        {sub}
      </text>
    </svg>
  );
}
