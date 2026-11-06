import type { Metadata } from "next";
import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import { Storefront } from "@phosphor-icons/react/dist/ssr/Storefront";
import { COMPANY, SEO } from "@/content/pages";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { CheckList } from "@/components/page/blocks";
import dubaiNight from "@/assets/stock/dubai-night.jpg";

export const metadata: Metadata = {
  title: SEO.company.title,
  description: SEO.company.description,
  alternates: { canonical: "/company-formation" },
};

const ICONS = [Storefront, Buildings, Globe];

export default function CompanyFormationPage() {
  return (
    <>
      <PageHero
        eyebrow={COMPANY.eyebrow}
        title={COMPANY.headline}
        intro={COMPANY.intro}
        crumbs={[{ label: "Business" }, { label: "Company Formation" }]}
        image={dubaiNight}
        imageAlt="Downtown Dubai at night"
        imageCaption="UAE mainland · free zone · offshore, and companies abroad"
      />

      <Section tone="paper-2" id="uae">
        <Container>
          <SectionHeading eyebrow="UAE options" title="Mainland, free zone or *offshore*" />
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {COMPANY.options.map((o, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal as="li" key={o.option} delay={i * 90}>
                  <Bezel tone={i === 1 ? "ink" : "white"} radius="2rem" className="h-full">
                    <div className="flex h-full flex-col p-7 md:p-8">
                      <span className={i === 1 ? "grid size-12 place-items-center rounded-full bg-white/10 text-sun" : "grid size-12 place-items-center rounded-full bg-paper-2 text-ink"}>
                        <Icon weight="light" className="size-6" aria-hidden />
                      </span>
                      <h3 className={i === 1 ? "mt-6 font-display text-[1.8rem] leading-tight text-paper" : "mt-6 font-display text-[1.8rem] leading-tight"}>{o.option}</h3>
                      <div className={i === 1 ? "mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50" : "mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3"}>Best for</div>
                      <p className={i === 1 ? "mt-1.5 text-[15px] leading-relaxed text-paper/80" : "mt-1.5 text-[15px] leading-relaxed text-ink-2"}>{o.bestFor}</p>
                      <div className={i === 1 ? "mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50" : "mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3"}>Includes</div>
                      <p className={i === 1 ? "mt-1.5 text-[15px] leading-relaxed text-paper/80" : "mt-1.5 text-[15px] leading-relaxed text-ink-2"}>{o.includes}</p>
                    </div>
                  </Bezel>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section id="abroad">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Abroad" title="Companies that open *residence*" />
            <Reveal delay={120}>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-2">
                <Rich text={COMPANY.abroad} />
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7" id="banking">
            <Reveal>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">Also included</div>
            </Reveal>
            <CheckList items={COMPANY.also} className="mt-4" />
          </div>
        </Container>
      </Section>
    </>
  );
}
