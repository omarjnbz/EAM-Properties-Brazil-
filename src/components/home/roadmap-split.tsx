import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { HOME, ROADMAP_CONTENTS } from "@/content/home";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { RoadmapForm } from "@/components/forms/roadmap-form";

/** The main lead capture: what the roadmap contains, and the form. */
export function RoadmapSplit() {
  const f = HOME.form;
  return (
    <Section tone="paper-2" id="roadmap">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={f.eyebrow} title="Get your free step-by-step *roadmap*" intro={f.line} />
          <Reveal delay={200} className="mt-10">
            <div className="text-[13px] font-medium text-ink-3">What your roadmap contains</div>
            <ul className="mt-3 flex flex-col">
              {ROADMAP_CONTENTS.map((r) => (
                <li key={r.section} className="flex items-start gap-3 border-t border-line py-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-white">
                    <Check weight="bold" className="size-3" aria-hidden />
                  </span>
                  <span className="text-[14.5px] leading-snug">
                    <span className="font-medium text-ink">{r.section}</span>
                    <span className="text-ink-3"> · {r.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal variant="scale" className="lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-white shadow-[0_1px_2px_rgba(11,27,47,0.05),0_30px_70px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05]">
              <RoadmapForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
