import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { GUIDE_LIST, GUIDES_PAGE } from "@/content/guides";
import { SEO } from "@/content/pages";
import { AppLink } from "@/components/ui/app-link";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/page/page-hero";
import { GUIDE_COVERS } from "@/components/guides/guide-images";
import { describeSection } from "@/components/guides/guide-page";

export const metadata: Metadata = {
  title: SEO.guides.title,
  description: SEO.guides.description,
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <PageHero eyebrow={GUIDES_PAGE.eyebrow} title={GUIDES_PAGE.headline} intro={GUIDES_PAGE.intro} crumbs={[{ label: "Free guides" }]} ctas={false} />

      <Section tone="paper-2" className="pt-16 md:pt-20">
        <Container>
          <ul className="grid gap-4 lg:grid-cols-2">
            {GUIDE_LIST.map((g, i) => {
              const cover = GUIDE_COVERS[g.key];
              return (
                <Reveal as="li" key={g.key} delay={i * 90}>
                  <AppLink href={`/guides/${g.key}`} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[0.05] transition-transform duration-500 ease-fluid hover:-translate-y-1">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={cover.image}
                        alt={cover.alt}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 580px, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-fluid group-hover:scale-[1.04]"
                        style={{ objectPosition: cover.position ?? "50% 50%" }}
                      />
                      <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md">Free PDF · {g.edition.replace("The EAM Global guide · ", "")}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <h2 className="text-[1.9rem] font-medium leading-tight tracking-[-0.035em]">{g.title}</h2>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-3">{g.summary}</p>
                      <ul className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
                        {g.sections.slice(0, 5).map((s) => (
                          <li key={s.title} className="text-[14px] leading-snug">
                            <span className="font-medium text-ink">{s.title}</span> <span className="text-ink-3">· {describeSection(s)}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[14.5px] font-medium">
                        Get the free {g.country} guide
                        <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </AppLink>
                </Reveal>
              );
            })}
          </ul>
          <Reveal>
            <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-ink-3">{GUIDES_PAGE.disclaimer} More country guides, starting with Portugal and the UAE, are on the way.</p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
