import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { cn } from "@/lib/cn";
import { AppLink } from "./app-link";
import { Rich } from "./rich";
import { SplitHeading } from "./split-heading";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------ Container */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("container-site", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ Eyebrow pill */
export function Eyebrow({
  children,
  tone = "paper",
  dot = "leaf",
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: "paper" | "ink" | "glass";
  dot?: "leaf" | "sun" | "navy" | "none";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-medium leading-none tracking-[-0.005em]",
        tone === "paper" && "bg-white text-ink-2 shadow-[0_1px_2px_rgba(11,27,47,0.06)] ring-1 ring-ink/[0.06]",
        tone === "ink" && "bg-white/[0.08] text-white/85 ring-1 ring-white/15",
        tone === "glass" && "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md",
        className,
      )}
    >
      {icon ??
        (dot !== "none" && (
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full", dot === "leaf" && "bg-leaf", dot === "sun" && "bg-sun", dot === "navy" && "bg-navy")}
          />
        ))}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Badge */
export function Badge({ children, tone = "leaf", className }: { children: React.ReactNode; tone?: "leaf" | "sun" | "navy" | "ink" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none",
        tone === "leaf" && "bg-leaf-soft text-leaf-deep",
        tone === "sun" && "bg-sun-soft text-[#7a5a0c]",
        tone === "navy" && "bg-navy/10 text-navy-deep",
        tone === "ink" && "bg-ink text-white",
        tone === "light" && "bg-white/15 text-white ring-1 ring-white/20",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Button */
type ButtonVariant = "leaf" | "ink" | "paper" | "ghost" | "ghost-light" | "glass";

const VARIANTS: Record<ButtonVariant, string> = {
  leaf: "bg-leaf text-white hover:bg-leaf-deep shadow-[0_8px_20px_-10px_rgba(62,105,11,0.7)]",
  ink: "bg-ink text-white hover:bg-ink-2",
  paper: "bg-white text-ink hover:bg-white/85 shadow-[0_1px_2px_rgba(11,27,47,0.08)]",
  ghost: "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/25",
  "ghost-light": "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20",
  glass: "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md hover:bg-white/25",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: "arrow" | "whatsapp" | "none";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
};

export function Button({ href, children, variant = "leaf", icon = "none", size = "md", className, external }: ButtonProps) {
  const Icon = icon === "whatsapp" ? WhatsappLogo : icon === "arrow" ? ArrowRight : null;
  const cls = cn(
    "group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color,box-shadow,color] duration-300 ease-fluid active:scale-[0.97]",
    size === "lg" ? "h-12 px-6 text-[15px]" : "h-11 px-5 text-[14.5px]",
    VARIANTS[variant],
    className,
  );
  const inner = (
    <>
      {Icon && icon === "whatsapp" && <Icon weight="regular" className="size-[18px]" aria-hidden />}
      <span>{children}</span>
      {Icon && icon === "arrow" && <Icon weight="bold" className="size-3.5 transition-transform duration-300 ease-fluid group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden />}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  return (
    <AppLink href={href} className={cls}>
      {inner}
    </AppLink>
  );
}

/** Quiet inline link with an arrow. */
export function TextLink({ href, children, className, tone = "ink" }: { href: string; children: React.ReactNode; className?: string; tone?: "ink" | "light" }) {
  return (
    <AppLink href={href} className={cn("group inline-flex items-center gap-1.5 text-[14.5px] font-medium", tone === "ink" ? "text-ink" : "text-white", className)}>
      <span className="underline decoration-current/25 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover:decoration-current">{children}</span>
      <ArrowUpRight weight="bold" aria-hidden className="size-3.5 transition-transform duration-300 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </AppLink>
  );
}

/* ------------------------------------------------------------------ Card (kept as "Bezel" for existing pages) */
export function Bezel({
  children,
  className,
  innerClassName,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: "paper" | "white" | "ink" | "ink-soft" | "leaf";
  radius?: string;
}) {
  const dark = tone === "ink" || tone === "ink-soft" || tone === "leaf";
  return (
    <div className={cn("rounded-[24px]", className)}>
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-[24px]",
          !dark && "bg-white shadow-[0_1px_2px_rgba(11,27,47,0.04),0_16px_40px_-24px_rgba(11,27,47,0.18)]",
          tone === "ink" && "bg-ink text-white",
          tone === "ink-soft" && "bg-white/[0.05] text-white ring-1 ring-white/10",
          tone === "leaf" && "bg-leaf-deep text-white",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Section */
export function Section({
  children,
  className,
  tone = "paper",
  id,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "paper-2" | "ink" | "navy";
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative py-20 md:py-28",
        tone === "paper" && "bg-canvas text-ink",
        tone === "paper-2" && "bg-paper-2 text-ink",
        tone === "ink" && "bg-ink text-white",
        tone === "navy" && "bg-[#0a223d] text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ Section heading */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "paper",
  align = "start",
  className,
  titleClassName,
  as = "h2",
  eyebrowIcon,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "paper" | "ink";
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2";
  eyebrowIcon?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone === "ink" ? "ink" : "paper"} icon={eyebrowIcon}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <SplitHeading
        as={as}
        text={title}
        className={cn("font-display text-[clamp(2rem,4.2vw,3.25rem)] font-medium leading-[1.05] text-balance", tone === "ink" && "text-white", titleClassName)}
        emClassName={tone === "ink" ? "text-white/45" : "text-ink-3/70"}
      />
      {intro && (
        <Reveal delay={120}>
          <p className={cn("max-w-xl text-[16px] leading-relaxed text-pretty", tone === "ink" ? "text-white/65" : "text-ink-3", align === "center" && "mx-auto")}>
            <Rich text={intro} />
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Small label */
export function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("text-[12px] font-medium uppercase tracking-[0.08em]", className)}>{children}</span>;
}
