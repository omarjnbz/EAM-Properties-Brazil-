import { FileX } from "@phosphor-icons/react/dist/ssr/FileX";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { PROBLEM } from "@/content/home";
import { SITE } from "@/content/site";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";

const ICONS = { confusing: Question, language: Translate, documents: FileX } as const;

const CODES: Record<string, string> = { Afghanistan: "AF", Iran: "IR", Yemen: "YE" };

/**
 * Straight after the hero: the nationalities we have won for, one big statement
 * for anyone refused before, then why so many files fail in the first place.
 */
export function ProblemSection() {
  const p = PROBLEM;
  return (
    <Section id="problem" className="pt-12 md:pt-16">
      <Container>
        {/* Nationalities strip, laid out like a "trusted by" logo row. */}
        <div className="grid items-center gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="max-w-[20rem] text-[13px] font-medium uppercase leading-snug tracking-[0.06em] text-ink-3">Success stories with clients from all over the world, including</p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:col-span-8">
            {p.passports.countries.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 70}>
                <div className="flex h-full min-h-[84px] items-center justify-center gap-2.5 rounded-2xl bg-white px-4 py-5 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] md:min-h-[96px]">
                  <span aria-hidden className="grid size-7 place-items-center rounded-full bg-ink text-[10.5px] font-semibold tracking-[0.04em] text-white">
                    {CODES[c] ?? c.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[17px] font-semibold tracking-[-0.025em] md:text-[19px]">{c}</span>
                </div>
              </Reveal>
            ))}
            <Reveal as="li" delay={p.passports.countries.length * 70}>
              <div className="flex h-full min-h-[84px] items-center justify-center rounded-2xl px-4 py-5 border border-dashed border-ink/20 md:min-h-[96px]">
                <span className="text-[15px] font-medium tracking-[-0.02em] text-ink-3">and many more</span>
              </div>
            </Reveal>
          </ul>
        </div>

        {/* The one big statement. */}
        <div className="mx-auto max-w-[1080px] py-24 text-center md:py-36">
          <SplitHeading
            as="p"
            groupSize={4}
            text="*Refused before?* That's where we start. We find out what went wrong, rebuild the file and help you reapply."
            className="text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.04em] text-balance"
            emClassName="text-ink-3/60"
          />
          <Reveal className="mt-10 flex flex-col items-center gap-6" delay={200}>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-ink-3 text-pretty">
              Many of our success stories began with a refusal. {p.passports.note}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/refused-visa" variant="ink">
                {p.refused.cta}
              </Button>
              <Button href={SITE.whatsappHref} variant="ghost" icon="whatsapp">
                Send us your refusal letter
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Why files get refused. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} className="lg:col-span-7" />
          <Reveal className="lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{p.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3">
          {p.pains.map((pain, i) => {
            const Icon = ICONS[pain.key];
            return (
              <Reveal as="li" key={pain.key} delay={i * 90}>
                <div className="flex h-full flex-col rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-[#fbeee8] text-[#a4471f]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-[13px] font-medium text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-8 text-[19px] font-semibold leading-snug tracking-[-0.025em]">{pain.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{pain.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
