import { cn } from "@/lib/cn";
import { parseRich } from "./rich";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Styling for *emphasised* words (two-tone headings). */
  emClassName?: string;
  /** "load" animates on page load with CSS only (above the fold); "scroll" reveals in view. */
  trigger?: "load" | "scroll";
  /** Base delay in ms. */
  delay?: number;
  /** Words per reveal group: groups blur in one after another, like lines. */
  groupSize?: number;
  id?: string;
};

/**
 * Display heading that blurs into focus group by group, approximating a
 * line-by-line reveal without measuring layout. Fully readable without motion.
 */
export function SplitHeading({ text, as: Tag = "h2", className, emClassName, trigger = "scroll", delay = 0, groupSize = 3, id }: Props) {
  let i = 0;
  const parts = parseRich(text);

  return (
    <Tag
      id={id}
      className={cn(trigger === "load" && "load-blur-words", className)}
      data-split={trigger === "scroll" ? "" : undefined}
      style={{ "--d": delay } as React.CSSProperties}
      suppressHydrationWarning
    >
      {parts.map((part, pi) =>
        part.value.split(/(\s+)/).map((w, wi) => {
          if (!w) return null;
          if (/^\s+$/.test(w)) return " ";
          const group = Math.floor(i++ / groupSize);
          return (
            <span
              key={`${pi}-${wi}`}
              className={cn("split-line inline-block", part.kind === "em" && cn("not-italic", emClassName), part.kind === "ph" && "ph")}
              style={{ "--i": group } as React.CSSProperties}
            >
              {w}
            </span>
          );
        }),
      )}
    </Tag>
  );
}
