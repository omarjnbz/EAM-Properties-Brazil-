import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { START } from "@/content/home";
import { GUIDE_LIST } from "@/content/guides";
import { AppLink } from "@/components/ui/app-link";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { RoadmapForm } from "@/components/forms/roadmap-form";
import { GUIDE_COVERS } from "@/components/guides/guide-images";
import { AdvisorStatus } from "@/components/home/advisor-status";

/** The two offers side by side (a personal roadmap in 48 hours, or a country guide now), with a live advisor card for anyone who would rather talk. */
export function StartSection() {
  return (
    <Section tone="paper-2" id="roadmap">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={START.eyebrow} title={START.title} intro={START.intro} className="lg:col-span-7" />
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={120}>
            <AdvisorStatus />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-12">
          <Reveal variant="scale" className="lg:col-span-7">
            <div className="h-full rounded-[28px] bg-white shadow-[0_1px_2px_rgba(11,27,47,0.05),0_30px_70px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05]">
              <div className="flex items-center gap-3 border-b border-line px-6 py-5 sm:px-8 md:px-10">
                <span className="grid size-8 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">1</span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">Your free personal roadmap</h3>
                  <p className="text-[13.5px] text-ink-3">Written for your family within 48 hours</p>
                </div>
              </div>
              <RoadmapForm />
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <Reveal className="flex items-center gap-3 px-1 pt-2 lg:pt-0" delay={80}>
              <span className="grid size-8 place-items-center rounded-full bg-leaf text-[13px] font-semibold text-white">2</span>
              <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em]">A free country guide</h3>
                <p className="text-[13.5px] text-ink-3">Download it now, read it tonight</p>
              </div>
            </Reveal>
            {GUIDE_LIST.map((g, i) => {
              const cover = GUIDE_COVERS[g.key];
              return (
                <Reveal key={g.key} delay={140 + i * 80} className="flex-1">
                  <AppLink
                    href={`/guides/${g.key}`}
                    className="group relative isolate flex h-full min-h-[230px] flex-col justify-end overflow-hidden rounded-[24px] bg-ink p-6 text-white"
                  >
                    <Image
                      src={cover.image}
                      alt={cover.alt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 460px, 100vw"
                      className="-z-10 object-cover transition-transform duration-[1.2s] ease-fluid group-hover:scale-[1.04]"
                      style={{ objectPosition: cover.position ?? "50% 50%" }}
                    />
                    <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />
                    <span className="absolute start-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-medium ring-1 ring-white/20 backdrop-blur-md">Free PDF guide</span>
                    <span className="text-[1.6rem] font-medium leading-tight tracking-[-0.035em]">{g.title}</span>
                    <span className="mt-1.5 max-w-sm text-[14px] leading-snug text-white/75">{g.summary}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium">
                      <DownloadSimple weight="bold" className="size-4" aria-hidden /> Download free
                      <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </AppLink>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
