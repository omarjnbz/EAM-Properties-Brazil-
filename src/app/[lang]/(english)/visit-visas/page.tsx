import type { Metadata } from "next";
import { SEO, VISIT } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { CheckList } from "@/components/page/blocks";
import stamps from "@/assets/stock/passport-stamps.jpg";
import { TestimonialGrid } from "@/components/testimonials/testimonial-grid";

export const metadata: Metadata = {
  title: SEO.visit.title,
  description: SEO.visit.description,
  alternates: { canonical: "/visit-visas" },
};

export default function VisitVisasPage() {
  return (
    <>
      <PageHero
        eyebrow={VISIT.eyebrow}
        title={VISIT.headline}
        intro={VISIT.intro}
        crumbs={[{ label: "Visas & Documents" }, { label: "Tourist & Visit Visas" }]}
        primary={{ label: "Get your free roadmap", href: "/free-roadmap?destination=visit-usa" }}
        image={stamps}
        imageAlt="An open passport with entry stamps"
        imageCaption="USA · UK · Schengen · Canada · Australia · UAE"
      />

      <Section tone="paper-2">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Destinations we handle" title="The visas families ask for *most*" />
            <Reveal delay={120} className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {VISIT.destinations.map((d) => (
                  <li key={d} className="rounded-full bg-white/80 px-4 py-2 text-[14px] text-ink-2 ring-1 ring-ink/[0.08]">
                    <Rich text={d} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">What is included</div>
            </Reveal>
            <CheckList items={VISIT.included} className="mt-4" />
            <Reveal className="mt-8">
              <Bezel tone="white" radius="1.6rem">
                <p className="p-5 text-[15px] text-ink-2">
                  <Rich text={VISIT.turnaround} />
                </p>
              </Bezel>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Proof" title="A family, a visa, *on camera*" tone="ink" intro={VISIT.proof} />
          </div>
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-[280px]">
              <TestimonialGrid items={TESTIMONIALS.filter((t) => t.id === "shamout-usa-visit")} variant="library" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
