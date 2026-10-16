import type { Metadata } from "next";
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { SEO } from "@/content/pages";
import { PODCAST } from "@/content/podcast";
import { SOCIAL } from "@/content/site";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { SocialLinks } from "@/components/ui/social-links";
import { PageHero } from "@/components/page/page-hero";
import { EpisodeCard } from "@/components/podcast/episode-card";

export const metadata: Metadata = {
  title: SEO.podcast.title,
  description: SEO.podcast.description,
  alternates: { canonical: "/podcast" },
};

export default function PodcastPage() {
  const youtube = SOCIAL.find((s) => s.key === "youtube")?.url ?? null;
  const hasEpisodes = PODCAST.episodes.length > 0;
  return (
    <>
      <PageHero
        eyebrow={PODCAST.eyebrow}
        title={PODCAST.headline}
        intro={PODCAST.intro}
        crumbs={[{ label: "Podcast" }]}
        ctas={false}
        aside={
          <div className="rounded-[28px] bg-ink p-7 text-white md:p-9">
            <span className="grid size-14 place-items-center rounded-full bg-white/10 text-[#8fc24a]">
              <Microphone weight="fill" className="size-7" aria-hidden />
            </span>
            <div className="mt-8 text-[13px] font-medium text-white/60">The EAM Global podcast</div>
            <div className="mt-1 text-[1.9rem] font-medium leading-tight tracking-[-0.035em]">
              <Rich text={PODCAST.name} />
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">New episodes on YouTube. {hasEpisodes ? "Watch below or subscribe." : "First episodes coming soon."}</p>
            <div className="mt-6">
              {youtube ? (
                <Button href={youtube} variant="paper">
                  <span className="inline-flex items-center gap-2">
                    <YoutubeLogo weight="fill" className="size-[18px] text-[#e62117]" aria-hidden /> Subscribe on YouTube
                  </span>
                </Button>
              ) : (
                <SocialLinks tone="dark" />
              )}
            </div>
          </div>
        }
      />

      <Section tone="paper-2">
        <Container>
          {hasEpisodes ? (
            <>
              <SectionHeading eyebrow="Episodes" title="Latest *episodes*" />
              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PODCAST.episodes.map((ep, i) => (
                  <Reveal as="li" key={ep.youtubeId} delay={(i % 3) * 80}>
                    <EpisodeCard episode={ep} />
                  </Reveal>
                ))}
              </ul>
            </>
          ) : (
            <>
              <SectionHeading eyebrow="Coming soon" title="The first episodes *we're recording*" intro="Planned topics. Tell us on WhatsApp what you'd like us to cover next." />
              <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PODCAST.topics.map((t, i) => (
                  <Reveal as="li" key={t.title} delay={i * 80}>
                    <div className="flex h-full flex-col rounded-[22px] bg-white p-6 ring-1 ring-ink/[0.05]">
                      <span className="w-max rounded-full bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-ink-3">Planned · Episode {i + 1}</span>
                      <h3 className="mt-6 text-[18px] font-semibold leading-snug tracking-[-0.025em]">{t.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{t.line}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
