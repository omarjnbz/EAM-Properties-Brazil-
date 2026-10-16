import type { Metadata } from "next";
import { SEO } from "@/content/pages";
import { Container, SectionHeading, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/home/hero";
import { TeamsStrip } from "@/components/home/teams-strip";
import { Statement } from "@/components/home/statement";
import { HandledSplit } from "@/components/home/handled-split";
import { PillarsGrid } from "@/components/home/pillars-grid";
import { DestinationsStack } from "@/components/home/destinations-stack";
import { GoalsAccordion } from "@/components/home/goals-accordion";
import { HowSteps } from "@/components/home/how-steps";
import { FounderStory } from "@/components/home/founder-story";
import { VideoShowcase } from "@/components/home/video-showcase";
import { DoorSplit } from "@/components/home/door-split";
import { RoadmapSplit } from "@/components/home/roadmap-split";
import { FaqGrid } from "@/components/home/faq-grid";

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  alternates: { canonical: "/" },
};

/**
 * Homepage: the visitor's situation first, then proof, then programs.
 * The founder appears once, in the founder story.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TeamsStrip />
      <Statement />
      <HandledSplit />
      <PillarsGrid />
      <DestinationsStack />

      <section className="bg-canvas pb-20 md:pb-28" id="goals">
        <Container>
          <div className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="Start with your goal" title="What are you *planning?*" className="lg:col-span-7" />
            <Reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2" delay={120}>
              <p className="max-w-md text-[16px] leading-relaxed text-ink-3">Pick the closest match. Each path leads to the programs, and to the people who will handle them with you.</p>
              <Button href="/free-roadmap" variant="ink">
                Get my free roadmap
              </Button>
            </Reveal>
          </div>
          <GoalsAccordion />
        </Container>
      </section>

      <HowSteps />
      <FounderStory />
      <VideoShowcase />
      <DoorSplit />
      <RoadmapSplit />
      <FaqGrid />
    </>
  );
}
