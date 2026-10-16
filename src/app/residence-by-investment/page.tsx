import type { Metadata } from "next";
import { RESIDENCE, SEO } from "@/content/pages";
import { RESIDENCE_REGIONS } from "@/content/programs";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, FaqSection, NumberedSteps } from "@/components/page/blocks";
import { RegionNav, ResidenceDirectory } from "@/components/page/tables";
import { BrazilSpotlight } from "@/components/page/brazil-spotlight";
import lisbon from "@/assets/stock/lisbon-rooftops.jpg";

export const metadata: Metadata = {
  title: SEO.residence.title,
  description: SEO.residence.description,
  alternates: { canonical: "/residence-by-investment" },
};

export default function ResidencePage() {
  const total = RESIDENCE_REGIONS.reduce((n, r) => n + r.programs.length, 0);
  return (
    <>
      <PageHero
        eyebrow={RESIDENCE.eyebrow}
        title={RESIDENCE.headline}
        intro={RESIDENCE.intro}
        crumbs={[{ label: "Residence by Investment" }]}
        image={lisbon}
        imageAlt="Red rooftops of Lisbon, Portugal"
        imageCaption={`${total} programs listed, from AED 400,000 in the UAE to Europe's golden visas`}
      />

      <Section tone="paper-2">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who this is for" title="A Plan B that keeps your *nationality*" intro={RESIDENCE.who} />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">What you gain</div>
            </Reveal>
            <CheckList items={RESIDENCE.gains} className="mt-4" />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <BrazilSpotlight />
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0 lg:pt-0" id="directory">
        <Container>
          <SectionHeading eyebrow="Program directory" title="Every residence program, *side by side*" intro={RESIDENCE.directoryNote} />
          <div className="mt-10">
            <RegionNav items={RESIDENCE_REGIONS.map((r) => ({ id: r.id, label: r.name }))} />
          </div>
          <div className="mt-10">
            <ResidenceDirectory />
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="How EAM Global handles it" title="From the application to *the arrival*" tone="ink" />
          <div className="mt-12">
            <NumberedSteps tone="ink" steps={RESIDENCE.how.map((h) => ({ title: h }))} />
          </div>
        </Container>
      </Section>

      <FaqSection faqs={RESIDENCE.faqs} />
    </>
  );
}
