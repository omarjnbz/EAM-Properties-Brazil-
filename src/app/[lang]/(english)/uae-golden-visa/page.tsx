import type { Metadata } from "next";
import { SEO, UAE } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { CheckList, FaqSection, NumberedSteps } from "@/components/page/blocks";
import { DataTable } from "@/components/page/tables";
import dubai from "@/assets/stock/dubai-dusk.jpg";
import { TestimonialGrid } from "@/components/testimonials/testimonial-grid";

export const metadata: Metadata = {
  title: SEO.uae.title,
  description: SEO.uae.description,
  alternates: { canonical: "/uae-golden-visa" },
};

type Route = (typeof UAE.routes)[number];

export default function UaeGoldenVisaPage() {
  return (
    <>
      <PageHero
        eyebrow={UAE.eyebrow}
        title={UAE.headline}
        intro={UAE.intro}
        crumbs={[{ label: "Residence by Investment", href: "/residence-by-investment" }, { label: "UAE Golden Visa" }]}
        primary={{ label: "Get my UAE roadmap", href: "/free-roadmap?destination=uae" }}
        image={dubai}
        imageAlt="Downtown Dubai skyline at dusk"
        imageCaption="Home office · 2, 5 or 10-year residence from AED 400,000"
      />

      <Section tone="paper-2" id="property">
        <Container>
          <SectionHeading eyebrow="Property routes at a glance" title="Five ways in through *property*" />
          <Reveal className="mt-12">
            <DataTable<Route>
              rows={[...UAE.routes]}
              rowKey={(r) => r.route + r.length + r.who}
              columns={[
                { key: "route", label: "Route", render: (r) => <span className="font-display text-[1.2rem] text-ink">{r.route}</span> },
                {
                  key: "value",
                  label: "Minimum property value",
                  wide: true,
                  render: (r) => (
                    <span>
                      <span className="text-ink">{r.value}</span> <span className="text-ink-3">({r.approx})</span>
                    </span>
                  ),
                },
                { key: "who", label: "Who qualifies", render: (r) => r.who },
                { key: "length", label: "Visa length", render: (r) => <span className="font-display text-[1.2rem] text-leaf-deep">{r.length}</span> },
              ]}
            />
          </Reveal>
          <Reveal>
            <p className="mt-6 text-[13px] text-ink-3">{UAE.routesNote}</p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Why the UAE" title="Tax, family and no minimum *stay*" />
          </div>
          <div className="lg:col-span-7">
            <CheckList items={UAE.why} />
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="The process with EAM Global" title="From property selection to *Emirates ID*" tone="ink" />
          <div className="mt-12">
            <NumberedSteps tone="ink" steps={UAE.process} />
          </div>
          <Reveal>
            <p className="mt-8 text-[15px] text-paper/70">
              <Rich text={UAE.timeline} />
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Beyond property" title="Not buying property? There is still a *category*" intro={UAE.beyond} />
          </div>
          <div className="lg:col-span-6">
            <div className="grid items-center gap-6 rounded-[2rem] bg-ink p-5 sm:grid-cols-[200px_1fr] md:p-6">
              <TestimonialGrid items={TESTIMONIALS.filter((t) => t.id === "uae-golden-visa")} variant="compact" />
              <div className="pe-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">Client video · UAE Golden Visa</div>
                <p className="mt-3 font-display text-[1.45rem] leading-snug text-paper">From property selection to Emirates ID, filmed at our Dubai office.</p>
                <p className="mt-2 text-[14px] text-paper/60">Plays with English and Portuguese captions.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <FaqSection faqs={UAE.faqs} tone="paper-2" />
    </>
  );
}
