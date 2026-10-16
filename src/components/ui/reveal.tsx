import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  variant?: "rise" | "scale" | "blur";
  as?: "div" | "section" | "li" | "article" | "span" | "figure" | "header" | "aside" | "p";
  id?: string;
};

/**
 * Scroll-reveal wrapper. A single IntersectionObserver in the boot script adds
 * `data-shown`; the motion lives in CSS. Nothing here ships JavaScript, and without
 * the `.motion` class (slow network, reduced motion, no JS) content is static.
 */
export function Reveal({ children, className, delay = 0, variant = "rise", as: Tag = "div", id }: Props) {
  return (
    <Tag
      id={id}
      className={cn(className)}
      data-reveal={variant === "rise" ? "" : variant}
      style={delay ? ({ "--d": delay } as React.CSSProperties) : undefined}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
