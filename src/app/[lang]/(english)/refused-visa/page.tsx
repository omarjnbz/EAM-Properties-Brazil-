import type { Metadata } from "next";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import passports from "@/assets/stock/passports-hands.jpg";
import { PROBLEM } from "@/content/home";
import { REFUSED, SEO } from "@/content/pages";
import { SITE } from "@/content/site";
import { TESTIMONIALS } from "@/content/testimonials";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { plain } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { FaqSection, NumberedSteps } from "@/components/page/blocks";
import { TestimonialPlayer } from "@/components/testimonials/testimonial-player";

export const metadata: Metadata = {
  title: SEO.refused.title,
  description: SEO.refused.description,
  alternates: { canonical: "/refused-visa" },
};

export default function RefusedVisaPage() {
  const film = TESTIMONIALS.find((t) => t.video);
  return (
    <>
      <PageHero
        eyebrow={REFUSED.eyebrow}
        title={REFUSED.headline}
        intro={REFUSED.intro}
        crumbs={[{ label: "Visas & Documents", href: "/visit-visas" }, { label: "Refused before?" }]}
        primary={{ label: "Get my refusal reviewed", href: "/free-roadmap?goal=refused" }}
        image={passports}
        imageAlt="Travellers holding passports from different countries"
        imageCaption="Afghanistan · Iran · Yemen · and many more: we already have success stories"
      />

      <Section tone="paper-2" id="reasons">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="Why files get refused" title="Small mistakes, *big consequences.*" className="lg:col-span-7" />
            <Reveal className="lg:col-span-5 lg:pb-2" delay={120}>
              <p className="max-w-md text-[16px] leading-relaxed text-ink-3">
                A refusal sits on your record and makes the next application harder. These are the reasons we see again and again.
              </p>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REFUSED.reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={(i % 3) * 80}>
                <div className="flex h-full flex-col rounded-[22px] bg-white p-6 ring-1 ring-ink/[0.05]">
                  <span className="grid size-10 place-items-center rounded-full bg-[#fbeee8] text-[#a4471f]">
                    <WarningCircle className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-[18px] font-semibold leading-snug tracking-[-0.025em]">{r.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{r.body}</p>
                </div>
              </Reveal>
            ))}
            <Reveal as="li" delay={160}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[22px] bg-leaf p-6 text-white">
                <span className="text-[13px] font-medium text-white/75">The good news</span>
                <p className="text-[19px] font-medium leading-snug tracking-[-0.025em]">Every one of these can be fixed before you apply again.</p>
              </div>
            </Reveal>
          </ul>
        </Container>
      </Section>

      <Section tone="ink" id="how">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="How we turn it around" title="From refusal *to approval.*" tone="ink" className="lg:col-span-7" />
            <Reveal className="lg:col-span-5 lg:pb-2" delay={120}>
              <Button href={SITE.whatsappHref} variant="ghost-light" icon="whatsapp">
                Send us your refusal letter
              </Button>
            </Reveal>
          </div>
          <div className="mt-12">
            <NumberedSteps tone="ink" steps={REFUSED.steps} />
          </div>
        </Container>
      </Section>

      <Section id="any-passport">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Whatever passport you hold" title={PROBLEM.passports.title} intro={PROBLEM.passports.body} />
            <Reveal delay={160} className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {PROBLEM.passports.countries.map((c) => (
                  <li key={c} className="rounded-full bg-white px-4 py-2 text-[14px] font-medium ring-1 ring-ink/[0.07]">
                    {c}
                  </li>
                ))}
                <li className="px-1 py-2 text-[14px] text-ink-3">and many more</li>
              </ul>
              <p className="mt-6 max-w-lg border-t border-line pt-5 text-[14.5px] leading-relaxed text-ink-3">{PROBLEM.passports.note}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/free-roadmap?goal=refused">Get my refusal reviewed</Button>
                <Button href="/testimonials" variant="ghost">
                  Watch client stories
                </Button>
              </div>
            </Reveal>
          </div>
          {film?.video && (
            <Reveal variant="scale" className="mx-auto w-full max-w-[360px] lg:col-span-5">
              <TestimonialPlayer video={film.video} label={`${plain(film.client)}, ${film.program}`} />
              <p className="mt-3 text-center text-[13px] text-ink-3">
                {plain(film.client)} · {film.program} · {film.year}
              </p>
            </Reveal>
          )}
        </Container>
      </Section>

      <FaqSection faqs={REFUSED.faqs} title="Questions after *a refusal*" eyebrow="FAQ" tone="paper-2" />
    </>
  );
}
