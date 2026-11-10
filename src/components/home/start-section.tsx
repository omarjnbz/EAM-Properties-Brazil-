import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { VideoCamera } from "@phosphor-icons/react/dist/ssr/VideoCamera";
import { BOOKING } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { AppLink } from "@/components/ui/app-link";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { LocalizedRoadmapForm } from "@/components/forms/localized-roadmap-form";
import { GUIDE_COVERS } from "@/components/guides/guide-images";
import { AdvisorStatus } from "@/components/home/advisor-status";

/** The two free offers side by side (a personal roadmap in 48 hours, or a country guide now), a live advisor card, and a paid video call with the founder below. */
export async function StartSection() {
  const t = await getDictionary();
  const s = t.home.start;
  const b = t.booking;
  return (
    <Section tone="paper-2" id="roadmap">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} className="lg:col-span-7" />
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
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{s.roadmapTitle}</h3>
                  <p className="text-[13.5px] text-ink-3">{s.roadmapSub}</p>
                </div>
              </div>
              <LocalizedRoadmapForm />
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <Reveal className="flex items-center gap-3 px-1 pt-2 lg:pt-0" delay={80}>
              <span className="grid size-8 place-items-center rounded-full bg-leaf text-[13px] font-semibold text-white">2</span>
              <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{s.guideTitle}</h3>
                <p className="text-[13.5px] text-ink-3">{s.guideSub}</p>
              </div>
            </Reveal>
            {s.guides.map((g, i) => {
              const cover = GUIDE_COVERS[g.key];
              return (
                <Reveal key={g.key} delay={140 + i * 80} className="flex-1">
                  <AppLink
                    href={`/guides/${g.key}`}
                    className="group relative isolate flex h-full min-h-[230px] flex-col justify-end overflow-hidden rounded-[24px] bg-ink p-6 text-white"
                  >
                    <Image
                      src={cover.image}
                      alt={g.coverAlt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 460px, 100vw"
                      className="-z-10 object-cover transition-transform duration-[1.2s] ease-fluid group-hover:scale-[1.04]"
                      style={{ objectPosition: cover.position ?? "50% 50%" }}
                    />
                    <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />
                    <span className="absolute start-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-medium ring-1 ring-white/20 backdrop-blur-md">{s.freePdf}</span>
                    <span className="text-[1.6rem] font-medium leading-tight tracking-[-0.035em]">{g.title}</span>
                    <span className="mt-1.5 max-w-sm text-[14px] leading-snug text-white/75">{g.summary}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium">
                      <DownloadSimple weight="bold" className="size-4" aria-hidden /> {s.download}
                      <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                    </span>
                  </AppLink>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={120} className="mt-4">
          <AppLink
            href="/book"
            className="group flex flex-col gap-4 rounded-[24px] bg-white px-6 py-5 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_20px_50px_-36px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05] transition-shadow duration-300 hover:ring-ink/15 sm:flex-row sm:items-center sm:px-8 md:px-10"
          >
            <span className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">3</span>
              <span>
                <span className="block text-[17px] font-semibold tracking-[-0.02em]">{b.startTitle}</span>
                <span className="block text-[13.5px] text-ink-3">
                  {b.startSub} · {BOOKING.price}
                </span>
              </span>
            </span>
            <span className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-[14.5px] font-medium text-white transition-colors duration-300 group-hover:bg-ink-2 sm:ms-auto sm:self-auto">
              <VideoCamera weight="regular" className="size-[18px]" aria-hidden />
              {b.cta}
            </span>
          </AppLink>
        </Reveal>
      </Container>
    </Section>
  );
}
