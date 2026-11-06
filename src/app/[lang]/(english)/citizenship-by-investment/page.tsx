import type { Metadata } from "next";
import { CITIZENSHIP, SEO } from "@/content/pages";
import { CITIZENSHIP_EXPECTED, CITIZENSHIP_PROGRAMS, CITIZENSHIP_REGIONS, slugify } from "@/content/programs";
import { Badge, Bezel, Button, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, FaqSection, NumberedSteps } from "@/components/page/blocks";
import { CitizenshipDirectory, RegionNav } from "@/components/page/tables";
import Image from "next/image";
import passports from "@/assets/stock/passports-hands.jpg";
import buenosAires from "@/assets/stock/buenos-aires-obelisco.jpg";

export const metadata: Metadata = {
  title: SEO.citizenship.title,
  description: SEO.citizenship.description,
  alternates: { canonical: "/citizenship-by-investment" },
};

export default function CitizenshipPage() {
  const a = CITIZENSHIP.argentina;
  return (
    <>
      <PageHero
        eyebrow={CITIZENSHIP.eyebrow}
        title={CITIZENSHIP.headline}
        intro={CITIZENSHIP.intro}
        crumbs={[{ label: "Citizenship by Investment" }]}
        image={passports}
        imageAlt="Travellers holding passports from different countries"
        imageCaption={`${CITIZENSHIP_PROGRAMS.length} programs listed · second passports from USD 95,000, family included`}
      />

      <Section tone="paper-2">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who this is for" title="Travel freedom, and a future *secured*" intro={CITIZENSHIP.who} />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">What you gain</div>
            </Reveal>
            <CheckList items={CITIZENSHIP.gains} className="mt-4" />
          </div>
        </Container>
      </Section>

      {/* Argentina spotlight */}
      <Section>
        <Container>
          <Reveal variant="scale">
            <Bezel tone="ink" radius="2.5rem">
              <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <Eyebrow tone="ink" dot="sun">
                      {a.eyebrow}
                    </Eyebrow>
                    <Badge tone="sun">Opens Q4 2026</Badge>
                  </div>
                  <SplitHeading text={a.title} className="mt-6 font-display text-[clamp(2.3rem,4.6vw,4.1rem)] leading-[1] tracking-[-0.03em] text-paper" emClassName="text-white/50" />
                  <p className="mt-6 text-[16px] leading-relaxed text-paper/70">{a.body}</p>
                  <p className="mt-4 text-[16px] leading-relaxed text-paper/85">{a.why}</p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href="/free-roadmap?destination=argentina" variant="paper" size="lg">
                      {a.button}
                    </Button>
                    <Button href="/citizenship-by-investment/argentina" variant="ghost-light" size="lg">
                      Argentina in detail
                    </Button>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                    <Image src={buenosAires} alt="The Obelisco in Buenos Aires" fill placeholder="blur" sizes="(min-width: 1024px) 420px, 100vw" className="object-cover object-[50%_30%]" />
                  </div>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0 lg:pt-0" id="directory">
        <Container>
          <SectionHeading eyebrow="Program directory" title="Second passports, *compared honestly*" intro={CITIZENSHIP.directoryNote} />
          <div className="mt-10">
            <RegionNav items={CITIZENSHIP_REGIONS.map((r) => ({ id: slugify(r), label: r }))} />
          </div>
          <div className="mt-10">
            <CitizenshipDirectory />
          </div>
          <Reveal>
            <p className="mt-10 rounded-2xl bg-paper-2 p-5 text-[14px] text-ink-2 ring-1 ring-ink/[0.06]">{CITIZENSHIP_EXPECTED}</p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="How EAM Global handles it" title="Pre-screened, filed, *accompanied*" tone="ink" />
          <div className="mt-12">
            <NumberedSteps tone="ink" steps={CITIZENSHIP.how.map((h) => ({ title: h }))} />
          </div>
        </Container>
      </Section>

      <FaqSection faqs={CITIZENSHIP.faqs} />
    </>
  );
}
