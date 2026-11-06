import type { Metadata } from "next";
import { HOW, SEO } from "@/content/pages";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/page/page-hero";
import { DataTable } from "@/components/page/tables";

export const metadata: Metadata = {
  title: SEO.how.title,
  description: SEO.how.description,
  alternates: { canonical: "/how-it-works" },
};

type Step = (typeof HOW.steps)[number];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow={HOW.eyebrow} title={HOW.headline} crumbs={[{ label: "How It Works" }]} />

      <Section tone="paper-2" className="pt-16 md:pt-20 lg:pt-24">
        <Container>
          <ol className="grid gap-4 lg:grid-cols-5">
            {HOW.steps.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 90}>
                <div className="relative flex h-full flex-col rounded-[1.8rem] bg-[#fbf9f4] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_24px_48px_-38px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06]">
                  <span className="font-display text-[3.4rem] leading-none text-leaf-deep">{i + 1}</span>
                  <h2 className="mt-6 font-display text-[1.5rem] leading-tight">{s.step}</h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-3">{s.what}</p>
                  <div className="mt-auto flex flex-col gap-1.5 pt-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Who · {s.who}</span>
                    <span className="w-max rounded-full bg-leaf-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-leaf-deep">{s.time}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-10 max-w-3xl text-[17px] leading-relaxed text-ink-2">{HOW.after}</p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <h2 className="mb-8 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">The same five steps, at a glance</h2>
            <DataTable<Step>
              rows={[...HOW.steps]}
              rowKey={(s) => s.step}
              columns={[
                { key: "step", label: "Step", render: (s) => <span className="font-display text-[1.2rem] text-ink">{HOW.steps.indexOf(s) + 1}. {s.step}</span> },
                { key: "what", label: "What happens", wide: true, render: (s) => s.what },
                { key: "who", label: "Who", render: (s) => s.who },
                { key: "time", label: "Time", render: (s) => <span className="text-leaf-deep">{s.time}</span> },
              ]}
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
