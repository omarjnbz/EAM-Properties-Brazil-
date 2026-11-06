import type { Metadata } from "next";
import { languageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { Button, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/home/hero";
import { ProblemSection } from "@/components/home/problem-section";
import { GoalsAccordion } from "@/components/home/goals-accordion";
import { PillarsGrid } from "@/components/home/pillars-grid";
import { VideoShowcase } from "@/components/home/video-showcase";
import { DestinationsStack } from "@/components/home/destinations-stack";
import { FounderStory } from "@/components/home/founder-story";
import { StartSection } from "@/components/home/start-section";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: languageAlternates("/", locale),
  };
}

/**
 * Homepage, built to sell on its own: the problem, the shortcut to every
 * service, the proof, the destinations, the founder, then two ways to start.
 * How It Works, Door-to-Door and the FAQ live on their own pages.
 */
export default async function HomePage() {
  const { t } = await getI18n();
  const g = t.home.goals;
  return (
    <>
      <Hero />
      <ProblemSection />

      <section className="bg-canvas pb-20 md:pb-28" id="goals">
        <Container>
          <div className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow={g.eyebrow} title={g.title} className="lg:col-span-7" />
            <Reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2" delay={120}>
              <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{g.intro}</p>
              <Button href="/free-roadmap" variant="ink">
                {g.button}
              </Button>
            </Reveal>
          </div>
          <GoalsAccordion items={g.items} />
        </Container>
      </section>

      <PillarsGrid />
      <VideoShowcase />
      <DestinationsStack />
      <FounderStory />
      <StartSection />
    </>
  );
}
