import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { ClosedCaptioning } from "@phosphor-icons/react/dist/ssr/ClosedCaptioning";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { FILMS, TESTIMONIALS } from "@/content/testimonials";
import { getDictionary } from "@/i18n/server";
import { Button, Container, Section, SectionHeading, TextLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich, plain } from "@/components/ui/rich";
import { TestimonialPlayer } from "@/components/testimonials/testimonial-player";
import { SocialLinks } from "@/components/ui/social-links";
import { VideoJsonLd } from "@/components/seo/json-ld";

/**
 * Real client films: the founder hands over the approved document on camera.
 * The first film is featured; any other published films (FILMS) follow in a
 * strip below. Placeholder films never show.
 */
export async function VideoShowcase() {
  const dict = await getDictionary();
  const t = dict.home.videos;
  // Film data (video files, ids) from testimonials.ts; every word from the page's language.
  const words = (id: string) => {
    const base = TESTIMONIALS.find((x) => x.id === id)!;
    const w = t.films.find((f) => f.key === id);
    return {
      client: w?.client ?? base.client,
      program: w?.program ?? base.program,
      year: w?.year ?? base.year,
      place: w?.place ?? base.place,
      subtitles: w?.subtitles ?? base.video?.subtitles ?? "",
      quote: w?.quote ?? base.quote,
      service: w?.service ?? base.service ?? [],
    };
  };
  const featuredFilm = TESTIMONIALS.find((x) => x.video) ?? TESTIMONIALS[0];
  const featured = { ...featuredFilm, ...words(featuredFilm.id) };
  const others = FILMS.filter((x) => x.id !== featured.id).map((x) => ({ id: x.id, ...words(x.id) }));

  return (
    <Section tone="paper-2" id="client-videos">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="scale" className="mx-auto w-full max-w-[400px] lg:col-span-5 lg:mx-0 lg:max-w-none">
            {featured.video && <TestimonialPlayer video={featured.video} label={`${plain(featured.client)}, ${featured.program}`} />}
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

            <Reveal delay={160} className="mt-8">
              <div className="rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[20px] font-semibold tracking-[-0.025em]">
                      <Rich text={featured.client} />
                    </div>
                    <div className="mt-1 text-[14px] text-ink-3">
                      {featured.program} · <Rich text={featured.year} />
                    </div>
                  </div>
                  <span className="rounded-full bg-leaf-soft px-3 py-1.5 text-[12.5px] font-medium text-leaf-deep">{t.approved}</span>
                </div>
                <ul className="mt-5 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-2">
                  <li className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-ink-3" aria-hidden /> {t.filmedAt}
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <ClosedCaptioning className="size-4 text-ink-3" aria-hidden /> {featured.subtitles}
                  </li>
                </ul>
                <p className="mt-5 border-t border-line pt-5 text-[15px] italic leading-relaxed text-ink-3">
                  “<Rich text={featured.quote} />”
                </p>
                {featured.service.length > 0 && (
                  <div className="mt-5">
                    <div className="text-[12.5px] font-medium text-ink-3">{t.serviceTitle}</div>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {featured.service.map((s) => (
                        <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-[12.5px] text-ink-2">
                          <Check weight="bold" className="size-3 text-leaf" aria-hidden /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/free-roadmap">{dict.common.getMyRoadmap}</Button>
              <TextLink href="/testimonials">{t.seeAll}</TextLink>
            </Reveal>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-16 md:mt-20">
            <Reveal className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[14px] font-medium text-ink-2">{t.more}</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[13px] text-ink-3">{t.followOn}</span>
                <SocialLinks />
              </div>
            </Reveal>
            <ul className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
              {others.map((u, i) => (
                <Reveal as="li" key={u.id} delay={i * 60} className="w-[46vw] shrink-0 md:w-auto">
                  <div className="flex aspect-[4/5] flex-col justify-between rounded-[20px] bg-white p-4 ring-1 ring-ink/[0.05]">
                    <span className="w-max rounded-full bg-leaf-soft px-2.5 py-1 text-[11.5px] font-medium text-leaf-deep">{t.approved}</span>
                    <div>
                      <div className="text-[15px] font-semibold leading-snug tracking-[-0.02em]">{u.program}</div>
                      <div className="mt-1 text-[12.5px] text-ink-3">
                        <Rich text={u.client} /> · {u.place}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </Container>
      <VideoJsonLd />
    </Section>
  );
}
