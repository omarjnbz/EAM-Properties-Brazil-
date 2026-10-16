import Image from "next/image";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import saoPaulo from "@/assets/stock/sao-paulo-river.jpg";
import { SITE } from "@/content/site";
import { Button, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/motion/count-up";

const STATS = [
  { value: 16, suffix: "+", label: "years in global migration, founder-led" },
  { value: 60, suffix: " min", label: "to a real advisor's reply, any hour" },
  { value: 48, suffix: " h", label: "to your free, written roadmap" },
  { value: 35, suffix: "+", label: "countries with residence routes" },
];

/** Positioning split: photo, promise, two CTAs and four numbers that count up. */
export function HandledSplit() {
  return (
    <section className="bg-canvas pb-24 md:pb-32">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="scale" className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2 sm:aspect-[5/5] lg:aspect-[4/5]">
              <div className="absolute inset-0" data-zoom-in suppressHydrationWarning>
                <Image src={saoPaulo} alt="São Paulo skyline over the Pinheiros river" fill placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 text-[13px] backdrop-blur-md">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin weight="fill" className="size-3.5 text-leaf" aria-hidden /> São Paulo, Brazil
                </span>
                <span className="text-ink-3">Local team · Portuguese &amp; English</span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Why families choose EAM Global"
              title="Your move, handled. *In your language, on the ground, around the clock.*"
              intro="EAM Global is the Dubai-based migration partner that stays with you on the ground, in your new country, speaking the language, from the day you enquire until the day your residence or passport is in your hand."
            />
            <Reveal delay={200} className="mt-8 flex flex-wrap gap-3">
              <Button href="/free-roadmap">Get my free roadmap</Button>
              <Button href={SITE.whatsappHref} variant="ghost" icon="whatsapp">
                Talk to an advisor now
              </Button>
            </Reveal>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 80}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] md:p-6">
                <CountUp value={s.value} suffix={s.suffix} className="text-[clamp(2.2rem,4vw,3.2rem)] font-medium leading-none tracking-[-0.045em]" />
                <span className="text-[14px] leading-snug text-ink-3">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
