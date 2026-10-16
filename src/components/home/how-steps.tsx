import { HOME } from "@/content/home";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/** Five steps from first message to keys in hand. */
export function HowSteps() {
  const h = HOME.how;
  return (
    <Section tone="paper-2">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={h.eyebrow} title="From first message to *keys in hand*" className="lg:col-span-7" />
          <Reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">One advisor, one written plan and fixed fees before you pay. Then a local team waiting when you land.</p>
            <Button href="/how-it-works" variant="ink">
              See the full process
            </Button>
          </Reveal>
        </div>

        <ol className="relative mt-12 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-5">
          {h.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90}>
              <div className="flex h-full flex-col rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-[44px] font-medium leading-none tracking-[-0.05em] text-ink/15">{i + 1}</span>
                  <span className="rounded-full bg-leaf-soft px-2.5 py-1 text-[11.5px] font-medium text-leaf-deep">{s.time}</span>
                </div>
                <h3 className="mt-10 text-[17px] font-semibold leading-snug tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
