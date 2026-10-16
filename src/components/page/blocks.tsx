import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import type { Faq } from "@/content/pages";
import { cn } from "@/lib/cn";
import { Bezel, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich, plain } from "@/components/ui/rich";
import { SplitHeading } from "@/components/ui/split-heading";
import { Disclosure } from "@/components/ui/disclosure";

/* ------------------------------------------------------------------ Check list */
export function CheckList({ items, tone = "paper", columns = 1, className }: { items: readonly string[]; tone?: "paper" | "ink"; columns?: 1 | 2; className?: string }) {
  return (
    <ul className={cn("grid gap-x-8", columns === 2 && "md:grid-cols-2", className)}>
      {items.map((item, i) => (
        <Reveal as="li" key={item} delay={(i % 6) * 50} className={cn("flex items-start gap-3 border-t border-dashed py-3.5", tone === "ink" ? "border-white/15" : "border-ink/[0.12]")}>
          <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", tone === "ink" ? "bg-sun text-ink" : "bg-leaf text-white")}>
            <Check weight="bold" className="size-3" aria-hidden />
          </span>
          <span className={cn("text-[15.5px] leading-relaxed", tone === "ink" ? "text-paper/80" : "text-ink-2")}>
            <Rich text={item} />
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ Numbered steps */
export function NumberedSteps({ steps, tone = "paper" }: { steps: readonly { title: string; body?: string; time?: string }[]; tone?: "paper" | "ink" }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title + i} delay={(i % 4) * 70}>
          <div
            className={cn(
              "flex h-full gap-5 rounded-[1.6rem] p-6 ring-1 md:p-7",
              tone === "ink" ? "bg-white/[0.04] ring-white/10" : "bg-[#fbf9f4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_24px_48px_-38px_rgba(11,27,47,0.35)] ring-ink/[0.06]",
            )}
          >
            <span className={cn("font-display text-[2.4rem] leading-none", tone === "ink" ? "text-sun" : "text-leaf-deep")}>{String(i + 1).padStart(2, "0")}</span>
            <div className="flex flex-col gap-2 pt-1">
              <h3 className={cn("font-display text-[1.35rem] leading-snug", tone === "ink" ? "text-paper" : "text-ink")}>
                <Rich text={s.title} />
              </h3>
              {s.body && (
                <p className={cn("text-[15px] leading-relaxed", tone === "ink" ? "text-paper/65" : "text-ink-3")}>
                  <Rich text={s.body} />
                </p>
              )}
              {s.time && (
                <span className={cn("mt-1 w-max rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]", tone === "ink" ? "bg-white/10 text-paper/80" : "bg-leaf-soft text-leaf-deep")}>
                  <Rich text={s.time} />
                </span>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ FAQ */
export function FaqList({ faqs, className }: { faqs: readonly Faq[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {faqs.map((f, i) => (
        <Reveal key={f.q} delay={(i % 5) * 50}>
          <Disclosure title={f.q} defaultOpen={i === 0}>
            <Rich text={f.a} />
          </Disclosure>
        </Reveal>
      ))}
    </div>
  );
}

/** FAQ section with structured data for search engines. */
export function FaqSection({ faqs, title = "Frequently asked *questions*", eyebrow = "FAQ", tone = "paper" }: { faqs: readonly Faq[]; title?: string; eyebrow?: string; tone?: "paper" | "paper-2" }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
  };
  return (
    <Section tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={eyebrow} title={title} />
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqList faqs={faqs} />
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Section>
  );
}

/* ------------------------------------------------------------------ Split block: label column + content */
export function SplitBlock({
  eyebrow,
  title,
  children,
  id,
  tone = "paper",
  aside,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
  tone?: "paper" | "paper-2" | "ink";
  aside?: React.ReactNode;
}) {
  const dark = tone === "ink";
  return (
    <Section tone={tone} id={id}>
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            {eyebrow && (
              <Reveal>
                <Eyebrow tone={dark ? "ink" : "paper"}>{eyebrow}</Eyebrow>
              </Reveal>
            )}
            <SplitHeading
              text={title}
              className={cn("mt-6 font-display text-[clamp(2.2rem,4.2vw,3.7rem)] leading-[1] tracking-[-0.025em] text-balance", dark && "text-paper")}
              emClassName={dark ? "text-white/50" : "text-ink-3/60"}
            />
            {aside && <div className="mt-8">{aside}</div>}
          </div>
        </div>
        <div className="lg:col-span-7">{children}</div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------ Paragraphs */
export function Prose({ paragraphs, tone = "paper", className }: { paragraphs: readonly string[]; tone?: "paper" | "ink"; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {paragraphs.map((p, i) => (
        <Reveal key={i} delay={i * 80}>
          <p className={cn("text-[17px] leading-relaxed text-pretty", tone === "ink" ? "text-paper/75" : "text-ink-2")}>
            <Rich text={p} />
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Fact card (hero aside) */
export function FactCard({ rows, footnote, title }: { rows: { label: string; value: string }[]; footnote?: string; title?: string }) {
  return (
    <Bezel tone="white" radius="2rem">
      <div className="p-6 md:p-8">
        {title && <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{title}</div>}
        <dl className={cn("flex flex-col", title && "mt-4")}>
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-6 border-t border-dashed border-ink/[0.12] py-3.5 first:border-t-0 first:pt-0">
              <dt className="text-[13.5px] text-ink-3">{r.label}</dt>
              <dd className="text-end font-display text-[1.2rem] leading-tight text-ink">
                <Rich text={r.value} />
              </dd>
            </div>
          ))}
        </dl>
        {footnote && (
          <p className="mt-4 border-t border-ink/[0.08] pt-4 text-[12.5px] leading-snug text-ink-3">
            <Rich text={footnote} />
          </p>
        )}
      </div>
    </Bezel>
  );
}
