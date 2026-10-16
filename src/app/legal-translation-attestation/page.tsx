import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Certificate } from "@phosphor-icons/react/dist/ssr/Certificate";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { Stamp as StampIcon } from "@phosphor-icons/react/dist/ssr/Stamp";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { LEGAL, SEO } from "@/content/pages";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import planning from "@/assets/stock/travel-planning.jpg";

export const metadata: Metadata = {
  title: SEO.legal.title,
  description: SEO.legal.description,
  alternates: { canonical: "/legal-translation-attestation" },
};

const ICONS = [Translate, StampIcon, Certificate, Scales, Buildings];

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow={LEGAL.eyebrow}
        title={LEGAL.headline}
        intro={LEGAL.intro}
        crumbs={[{ label: "Visas & Documents" }, { label: "Legal Translation & Attestation" }]}
        image={planning}
        imageAlt="A passport, map and camera laid out on a desk"
        imageCaption="Ministry of Justice-approved legal translators"
      />

      <Section tone="paper-2">
        <Container>
          <SectionHeading eyebrow="Services" title="Every stamp your file *needs*" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LEGAL.services.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal as="li" key={s.title} delay={(i % 3) * 80}>
                  <Bezel tone="white" radius="1.8rem" className="h-full">
                    <div className="flex h-full flex-col gap-4 p-7">
                      <span className="grid size-12 place-items-center rounded-full bg-paper-2 text-ink">
                        <Icon weight="light" className="size-6" aria-hidden />
                      </span>
                      <h3 className="font-display text-[1.5rem] leading-tight">{s.title}</h3>
                      <p className="text-[15px] leading-relaxed text-ink-3">
                        <Rich text={s.body} />
                      </p>
                    </div>
                  </Bezel>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section id="attestation">
        <Container>
          <SectionHeading eyebrow="Attestation & document clearing" title="The full chain, *handled by us*" intro="Every document travels the whole attestation chain before it reaches a government desk. We carry it through each office so you do not have to." />
          <Reveal className="mt-12">
            <ol className="flex flex-col gap-3 md:flex-row md:items-stretch">
              {LEGAL.chain.map((c, i) => (
                <li key={c} className="flex flex-1 items-center gap-3">
                  <div className="flex-1 rounded-[1.6rem] bg-[#fbf9f4] p-6 ring-1 ring-ink/[0.06]">
                    <div className="font-mono text-[11px] text-leaf-deep">{String(i + 1).padStart(2, "0")}</div>
                    <div className="mt-3 font-display text-[1.45rem] leading-tight">{c}</div>
                  </div>
                  {i < LEGAL.chain.length - 1 && <ArrowRight weight="light" className="hidden size-5 shrink-0 text-ink-3 md:block rtl:rotate-180" aria-hidden />}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal>
            <p className="mt-8 text-[15px] text-ink-2">
              <Rich text={LEGAL.turnaround} />
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
