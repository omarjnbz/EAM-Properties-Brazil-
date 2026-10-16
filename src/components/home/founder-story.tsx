import Image from "next/image";
import { Quotes } from "@phosphor-icons/react/dist/ssr/Quotes";
import founder from "@/assets/images/founder-alaa-marzouk.png";
import { FOUNDER_STORY, HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";

/** Mission and vision, from the founder's story. */
export function MissionVision({ tone = "paper", className }: { tone?: "paper" | "ink"; className?: string }) {
  const dark = tone === "ink";
  const items = [
    { label: "Our mission", text: FOUNDER_STORY.mission },
    { label: "Our vision", text: FOUNDER_STORY.vision },
  ];
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.label} delay={i * 80}>
          <div className={cn("h-full rounded-[22px] p-6 ring-1", dark ? "bg-white/[0.05] ring-white/10" : "bg-white ring-ink/[0.05]")}>
            <div className={cn("text-[12.5px] font-medium", dark ? "text-[#8fc24a]" : "text-leaf-deep")}>{it.label}</div>
            <p className={cn("mt-2 text-[17px] font-medium leading-snug tracking-[-0.02em]", dark && "text-white")}>{it.text}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/** The founder's own move, in four chapters, with a line that fills as you read. */
export function FounderTimeline({ tone = "paper", className }: { tone?: "paper" | "ink"; className?: string }) {
  const dark = tone === "ink";
  return (
    <ol className={cn("relative flex flex-col", className)}>
      <span aria-hidden className={cn("absolute bottom-3 start-[15px] top-3 w-px", dark ? "bg-white/15" : "bg-line")} />
      <span aria-hidden data-scrub-line suppressHydrationWarning className="absolute bottom-3 start-[15px] top-3 w-px origin-top bg-leaf" />
      {FOUNDER_STORY.chapters.map((c, i) => (
        <Reveal as="li" key={c.label} delay={i * 90} className="relative flex gap-5 pb-9 last:pb-0">
          <span className={cn("relative z-[1] mt-0.5 grid size-[31px] shrink-0 place-items-center rounded-full text-[12px] font-semibold ring-4", dark ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-canvas")}>
            {i + 1}
          </span>
          <div>
            <div className={cn("flex flex-wrap items-center gap-2 text-[12.5px] font-medium", dark ? "text-white/55" : "text-ink-3")}>
              <span>{c.label}</span>
              {c.when && (
                <>
                  <span aria-hidden>·</span>
                  <Rich text={c.when} />
                </>
              )}
            </div>
            <h3 className={cn("mt-1.5 text-[20px] font-semibold leading-snug tracking-[-0.025em]", dark && "text-white")}>{c.title}</h3>
            <p className={cn("mt-2 max-w-lg text-[15.5px] leading-relaxed", dark ? "text-white/70" : "text-ink-3")}>
              <Rich text={c.body} />
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/** Homepage founder highlight: the founder's own move, his promise and his record. */
export function FounderStory() {
  const s = FOUNDER_STORY;
  return (
    <Section id="founder">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal variant="scale">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2">
                <Image
                  src={founder}
                  alt="Alaa Marzouk, founder of EAM Global"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover object-[50%_18%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-6 pt-28 text-white">
                  <div className="text-[1.9rem] font-medium leading-none tracking-[-0.035em]">Alaa Marzouk</div>
                  <div className="mt-2 text-[14px] text-white/75">Founder and Senior Immigration Consultant</div>
                </div>
              </div>
            </Reveal>
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {s.credentials.map((c, i) => (
                <Reveal as="li" key={c.label} delay={120 + i * 70}>
                  <div className="h-full rounded-[18px] bg-white p-4 ring-1 ring-ink/[0.05]">
                    <div className="text-[1.6rem] font-medium leading-none tracking-[-0.04em]">{c.value}</div>
                    <div className="mt-2 text-[12px] leading-snug text-ink-3">{c.label}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} />

          <FounderTimeline className="mt-12" />

          <MissionVision className="mt-12" />

          <Reveal className="mt-3">
            <figure className="rounded-[24px] bg-ink p-7 text-white md:p-9">
              <Quotes weight="fill" className="size-8 text-[#8fc24a]" aria-hidden />
              <blockquote className="mt-4 text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.02em]">“{HOME.founder.quote}”</blockquote>
              <figcaption className="mt-6 text-[14px] text-white/60">
                {HOME.founder.name} · {HOME.founder.role}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3" delay={100}>
            <Button href="/free-roadmap">Get my free roadmap</Button>
            <Button href={SITE.whatsappHref} variant="ghost" icon="whatsapp">
              Talk to an advisor now
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
