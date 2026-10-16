import type { Metadata } from "next";
import { ROADMAP_CONTENTS } from "@/content/home";
import { ROADMAP, SEO } from "@/content/pages";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/page/page-hero";
import { RoadmapDoc } from "@/components/art/documents";
import { RoadmapForm } from "@/components/forms/roadmap-form";

export const metadata: Metadata = {
  title: SEO.roadmap.title,
  description: SEO.roadmap.description,
  alternates: { canonical: "/free-roadmap" },
};

export default function FreeRoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow={ROADMAP.eyebrow}
        title={ROADMAP.headline}
        intro={ROADMAP.intro}
        crumbs={[{ label: "Free Roadmap" }]}
        ctas={false}
        aside={
          <div className="relative mx-auto max-w-[420px]">
            <RoadmapDoc className="rotate-[1.5deg]" />
          </div>
        }
      >
        <p className="load-rise mt-6 max-w-xl text-[15px] text-ink-3" style={{ "--d": 560 } as React.CSSProperties}>
          {ROADMAP.why}
        </p>
      </PageHero>

      <Section tone="paper-2" id="form" className="pt-16 md:pt-20 lg:pt-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="What your roadmap contains" title="Seven sections, *one plan*" />
              <Reveal delay={140}>
                <dl className="mt-8 flex flex-col">
                  {ROADMAP_CONTENTS.map((r, i) => (
                    <div key={r.section} className="border-t border-dashed border-ink/[0.12] py-3.5">
                      <dt className="flex items-baseline gap-2.5 font-medium text-ink">
                        <span className="font-mono text-[10px] text-leaf-deep">{String(i + 1).padStart(2, "0")}</span>
                        {r.section}
                      </dt>
                      <dd className="mt-1 ps-7 text-[14px] leading-snug text-ink-3">{r.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Reveal variant="scale">
              <Bezel tone="white" radius="2.2rem">
                <div className="border-b border-ink/[0.07] px-6 pt-7 sm:px-8 md:px-10 md:pt-9">
                  <h2 className="font-display text-[2rem] leading-tight">Tell us about your move</h2>
                  <p className="mt-2 pb-6 text-[15px] text-ink-3">Takes about two minutes. An advisor confirms the details with you on WhatsApp.</p>
                </div>
                <RoadmapForm variant="full" />
              </Bezel>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
