import type { StaticImageData } from "next/image";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree";
import type { Faq } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { Bezel, Button, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";
import { PageHero } from "./page-hero";
import { CheckList, FaqSection, NumberedSteps } from "./blocks";
import { RoutesTable } from "./tables";
import { TestimonialGrid } from "@/components/testimonials/testimonial-grid";

export type CountryPageData = {
  eyebrow: string;
  headline: string;
  heroLine: string;
  crumbs: { label: string; href?: string }[];
  heroAside?: React.ReactNode;
  heroImage?: StaticImageData;
  heroImageAlt?: string;
  heroImagePosition?: string;
  heroCaption?: string;
  routesTitle?: string;
  routesNote?: string;
  routesIntro?: string;
  routes: readonly { route: string; requirement: string; outcome: string }[];
  gets: readonly string[];
  life: readonly string[];
  lifeAside?: React.ReactNode;
  team: { who: string; does: readonly string[]; city: string; timeZone: string; languages: string };
  process: readonly { title: string; time?: string }[];
  costs: readonly { label: string; value: string }[];
  faqs: readonly Faq[];
  testimonialIds?: string[];
  primaryCta: { label: string; href: string };
  wording?: string;
};

/** The eight-block country template: hero, routes, rights, life, team, process, costs, FAQ. */
export function CountryPage({ data }: { data: CountryPageData }) {
  const videos = TESTIMONIALS.filter((t) => data.testimonialIds?.includes(t.id));
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow={data.eyebrow}
        title={data.headline}
        intro={data.heroLine}
        crumbs={data.crumbs}
        image={data.heroImage}
        imageAlt={data.heroImageAlt}
        imagePosition={data.heroImagePosition}
        imageCaption={data.heroCaption}
        aside={data.heroAside}
        primary={data.primaryCta}
      />

      {/* 2. Routes */}
      <Section tone="paper-2" id="routes">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="Routes" title={data.routesTitle ?? "Qualifying *routes*"} className="lg:col-span-7" />
            {data.routesIntro && (
              <Reveal className="lg:col-span-5 lg:pb-3" delay={120}>
                <p className="text-[16px] leading-relaxed text-ink-3">
                  <Rich text={data.routesIntro} />
                </p>
              </Reveal>
            )}
          </div>
          <Reveal className="mt-12">
            <RoutesTable rows={data.routes} />
          </Reveal>
          {data.routesNote && (
            <Reveal>
              <p className="mt-6 text-[13px] text-ink-3">
                <Rich text={data.routesNote} />
              </p>
            </Reveal>
          )}
          {data.wording && (
            <Reveal className="mt-10">
              <div className="flex flex-col gap-2 rounded-[1.6rem] bg-ink p-6 text-paper md:flex-row md:items-center md:gap-8 md:p-8">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-sun">Important</span>
                <p className="text-[16px] leading-relaxed text-paper/85">
                  <Rich text={data.wording} />
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* 3. What you get + 4. Life there */}
      <Section>
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="What you get" title="Rights, family and the *next step*" />
            <div className="mt-10">
              <CheckList items={data.gets} />
            </div>
            {data.lifeAside && (
              <Reveal className="mt-12 hidden lg:block" variant="scale">
                <div className="rounded-[2.2rem] bg-ink p-8">{data.lifeAside}</div>
              </Reveal>
            )}
          </div>
          <div className="lg:col-span-6">
            <Reveal variant="scale">
              <Bezel tone="ink" radius="2.2rem">
                <div className="p-7 md:p-10">
                  <Eyebrow tone="ink" dot="sun">
                    Life there
                  </Eyebrow>
                  <ul className="mt-8 flex flex-col gap-5">
                    {data.life.map((line, i) => (
                      <li key={i} className="flex gap-4 border-t border-white/10 pt-5 first:border-0 first:pt-0">
                        <span className="font-mono text-[11px] text-sun">{String(i + 1).padStart(2, "0")}</span>
                        <p className="font-display text-[1.3rem] leading-snug text-paper md:text-[1.45rem]">
                          <Rich text={line} />
                        </p>
                      </li>
                    ))}
                  </ul>
                  {data.lifeAside && <div className="mt-8 lg:hidden">{data.lifeAside}</div>}
                </div>
              </Bezel>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 5. Your EAM Global team */}
      <Section tone="paper-2" id="team">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Your EAM Global team" title="Someone who knows the city, *meeting you*" />
            <Reveal delay={120} className="mt-8 flex flex-col gap-4">
              <div className="inline-flex w-max items-center gap-3 rounded-full bg-white/70 px-4 py-2.5 text-[14px] ring-1 ring-ink/[0.07]">
                <LiveDot className="size-2" />
                <span className="text-ink-2">{data.team.city} now</span>
                <LiveClock timeZone={data.team.timeZone} className="font-display text-[1.15rem] text-ink" />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal variant="scale">
              <Bezel tone="white" radius="2.2rem">
                <div className="grid gap-8 p-7 md:grid-cols-[1fr_1fr] md:p-10">
                  <div>
                    <span className="grid size-12 place-items-center rounded-full bg-leaf-soft text-leaf-deep">
                      <UsersThree weight="light" className="size-6" aria-hidden />
                    </span>
                    <p className="mt-5 font-display text-[1.6rem] leading-snug">
                      <Rich text={data.team.who} />
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-[14px] text-ink-3">
                      <Translate weight="light" className="size-4" aria-hidden /> {data.team.languages}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">What they do with you</div>
                    <CheckList items={data.team.does} className="mt-3" />
                  </div>
                </div>
              </Bezel>
            </Reveal>
            {videos.length > 0 && (
              <Reveal className="mt-6">
                <div className="grid items-center gap-6 rounded-[2rem] bg-ink p-5 sm:grid-cols-[200px_1fr] md:p-6">
                  <TestimonialGrid items={videos} variant="compact" />
                  <div className="pe-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">Client videos for this destination</div>
                    <p className="mt-3 font-display text-[1.45rem] leading-snug text-paper">Our founder meets clients in person when their visa or permit arrives.</p>
                    <p className="mt-2 text-[14px] text-paper/60">Every video plays with English and Portuguese captions.</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </Section>

      {/* 6. Process and timeline + 7. Costs */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Process and timeline" title="Realistic steps, *realistic times*" />
          <div className="mt-12">
            <NumberedSteps steps={data.process} />
          </div>

          <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Costs" title="Every cost, shown *separately*" />
            </div>
            <Reveal className="lg:col-span-7" variant="scale">
              <Bezel tone="white" radius="2rem">
                <dl className="p-6 md:p-8">
                  {data.costs.map((c, i) => (
                    <div key={c.label} className={cn("flex flex-col gap-1 border-t border-dashed border-ink/[0.12] py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8", i === 0 && "border-t-0 pt-0")}>
                      <dt className="text-[15px] text-ink-2">{c.label}</dt>
                      <dd className="font-display text-[1.25rem] text-ink sm:text-end">
                        <Rich text={c.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Bezel>
            </Reveal>
          </div>
          <Reveal className="mt-12 flex flex-wrap gap-3">
            <Button href={data.primaryCta.href} size="lg">
              {data.primaryCta.label}
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* 8. FAQ (the CTA band follows on every page) */}
      <FaqSection faqs={data.faqs} tone="paper-2" />
    </>
  );
}
