import type { Metadata } from "next";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { HouseLine } from "@phosphor-icons/react/dist/ssr/HouseLine";
import { DOOR_STAGES } from "@/content/home";
import { RELOCATION, SEO } from "@/content/pages";
import { cn } from "@/lib/cn";
import { Bezel, Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { CheckList } from "@/components/page/blocks";
import home from "@/assets/stock/brazil-house-carport.jpg";

export const metadata: Metadata = {
  title: SEO.relocation.title,
  description: SEO.relocation.description,
  alternates: { canonical: "/relocation" },
};

export default function RelocationPage() {
  return (
    <>
      <PageHero
        eyebrow={RELOCATION.eyebrow}
        title={RELOCATION.headline}
        intro={RELOCATION.intro}
        crumbs={[{ label: "Relocation" }]}
        image={home}
        imageAlt="A modern house with large windows in Bahia, Brazil"
        imageCaption="From the airport to your first month: one team, one plan"
      />

      <Section tone="paper-2" id="included">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Door-to-Door Package" title="One fee, one plan, one point of *contact*" intro="From your first message to your first month living abroad." />
          </div>
          <div className="lg:col-span-7">
            <CheckList items={RELOCATION.includes} />
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="Stage by stage" title="What we do, and *when*" tone="ink" />
          <ol className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {DOOR_STAGES.map((s, i) => (
              <Reveal as="li" key={s.stage} delay={i * 80}>
                <div className="h-full rounded-[1.6rem] bg-white/[0.04] p-6 ring-1 ring-white/10">
                  <div className="font-mono text-[11px] text-sun">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-paper">{s.stage}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-paper/65">{s.does}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="Pricing" title="Three tiers, a fixed price per *family*" className="lg:col-span-7" />
            <Reveal className="lg:col-span-5 lg:pb-3">
              <p className="text-[16px] text-ink-3">{RELOCATION.pricing}</p>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {RELOCATION.tiers.map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 90}>
                <Bezel tone={i === 2 ? "ink" : "white"} radius="2rem" className="h-full">
                  <div className="flex h-full flex-col p-7 md:p-8">
                    <span className={cn("font-mono text-[10.5px] uppercase tracking-[0.2em]", i === 2 ? "text-sun" : "text-leaf-deep")}>Tier {i + 1}</span>
                    <h3 className={cn("mt-4 font-display text-[2.4rem] leading-none", i === 2 && "text-paper")}>{t.name}</h3>
                    <p className={cn("mt-3 text-[15px]", i === 2 ? "text-paper/70" : "text-ink-3")}>{t.scope}</p>
                    <div className={cn("mt-10 font-display text-[1.6rem]", i === 2 ? "text-paper" : "text-ink")}>
                      <Rich text={t.price} />
                    </div>
                    <div className="mt-6">
                      <Button href="/free-roadmap" variant={i === 2 ? "paper" : "ink"}>
                        Include in my roadmap
                      </Button>
                    </div>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper-2" id="travel">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Travel & Tours" title="Visit first, *then* decide" />
          </div>
          <Reveal className="lg:col-span-7" delay={120}>
            <p className="text-[18px] leading-relaxed text-ink-2">
              <span className="font-medium text-ink">Travel-only services: </span>
              {RELOCATION.travel}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-4 md:grid-cols-2">
          {[
            { id: "schools", eyebrow: "Education & Schools", Icon: GraduationCap, items: RELOCATION.schools },
            { id: "property", eyebrow: "Property", Icon: HouseLine, items: RELOCATION.property },
          ].map(({ id, eyebrow, Icon, items }) => (
            <Reveal key={id} id={id} className="scroll-mt-40">
              <Bezel tone="white" radius="2rem" className="h-full">
                <div className="p-7 md:p-9">
                  <span className="grid size-12 place-items-center rounded-full bg-paper-2 text-ink">
                    <Icon weight="light" className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-6 font-display text-[2rem] leading-tight">{eyebrow}</h2>
                  <CheckList items={items} className="mt-5" />
                </div>
              </Bezel>
            </Reveal>
          ))}
        </Container>
      </Section>
    </>
  );
}
