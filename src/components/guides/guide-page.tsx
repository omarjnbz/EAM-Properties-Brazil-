import { GUIDES_PAGE, type Guide, type GuideSection } from "@/content/guides";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { plain } from "@/components/ui/rich";
import { PageHero } from "@/components/page/page-hero";
import { GuideForm } from "./guide-form";
import { GUIDE_COVERS } from "./guide-images";

/** One short line per chapter for the "What's inside" list. */
export function describeSection(s: GuideSection) {
  switch (s.kind) {
    case "text":
      return plain(s.paragraphs[0]).split(/(?<=\.)\s/)[0];
    case "routes":
      return `${s.rows.length} routes: ${s.rows.map((r) => r.route).join(", ")}.`;
    case "steps":
      return s.intro ?? `${s.steps.length} steps.`;
    case "checklist":
      return `${s.items.length}-point checklist${s.intro ? `: ${s.intro.replace(/:$/, "").toLowerCase()}` : ""}.`;
    case "cities":
      return s.cities.map((c) => c.name).join(", ") + ".";
    case "costs":
      return s.intro ?? "Every cost, shown separately.";
  }
}

/** Landing page for one guide: what's inside, and the form that unlocks the PDF. */
export function GuidePage({ guide }: { guide: Guide }) {
  const cover = GUIDE_COVERS[guide.key];
  return (
    <>
      <PageHero
        eyebrow={`Free guide · ${guide.country}`}
        title={`${guide.title}, *step by step.*`}
        intro={guide.summary}
        crumbs={[{ label: "Free guides", href: "/guides" }, { label: guide.country }]}
        primary={{ label: `Get the free ${guide.country} guide`, href: "#download" }}
        image={cover.image}
        imageAlt={cover.alt}
        imagePosition={cover.position}
        imageCaption={`${guide.edition} · free PDF`}
      />

      <Section tone="paper-2" id="download">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="What's inside" title={`${guide.sections.length} chapters, *one clear plan.*`} />
            <ol className="mt-10 flex flex-col">
              {guide.sections.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 50} className="flex gap-4 border-t border-line py-4">
                  <span className="w-6 shrink-0 text-[13px] font-semibold text-leaf-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[16px] font-semibold tracking-[-0.02em]">{s.title}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-ink-3">{describeSection(s)}</span>
                  </span>
                </Reveal>
              ))}
              <Reveal as="li" className="flex gap-4 border-t border-line py-4">
                <span className="w-6 shrink-0 text-[13px] font-semibold text-leaf-deep">{String(guide.sections.length + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[16px] font-semibold tracking-[-0.02em]">How EAM Global helps</span>
                  <span className="mt-1 block text-[14px] leading-snug text-ink-3">{guide.team}, from day one until you are settled.</span>
                </span>
              </Reveal>
            </ol>
          </div>

          <div className="lg:col-span-7">
            <Reveal variant="scale" className="lg:sticky lg:top-28">
              <div className="rounded-[28px] bg-white shadow-[0_1px_2px_rgba(11,27,47,0.05),0_30px_70px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05]">
                <div className="border-b border-line px-6 pb-5 pt-7 sm:px-8 md:px-9">
                  <h2 className="text-[1.6rem] font-medium leading-tight tracking-[-0.03em]">Get your free {guide.country} guide</h2>
                  <p className="mt-1.5 text-[14.5px] text-ink-3">Leave your details and the PDF downloads straight away.</p>
                </div>
                <GuideForm guide={guide} />
              </div>
              <p className="mt-4 px-2 text-[12.5px] leading-relaxed text-ink-3">{GUIDES_PAGE.disclaimer}</p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
