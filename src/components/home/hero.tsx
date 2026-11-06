import Image from "next/image";
import rio from "@/assets/stock/rio-sunset-water.jpg";
import { SITE } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { Button, Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";
import { Rich } from "@/components/ui/rich";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

/** Full-bleed Brazil hero, kept clean: one centered headline, two actions, a quiet trust line. */
export async function Hero() {
  const h = (await getDictionary()).home.hero;
  return (
    <section data-parallax-root className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10" data-parallax="14" suppressHydrationWarning>
        <div className="load-zoom absolute inset-0">
          <Image src={rio} alt={h.imageAlt} fill preload placeholder="blur" sizes="100vw" className="object-cover object-[50%_45%]" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/85" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_60%_55%_at_50%_75%,rgba(11,27,47,0.45),transparent)]" />

      <div className="container-site flex flex-col items-center pb-10 pt-36 text-center md:pb-12" data-hero-fade suppressHydrationWarning>
        <div className="load-blur" style={d(60)}>
          <Eyebrow tone="glass">{h.eyebrow}</Eyebrow>
        </div>
        <SplitHeading
          as="h1"
          trigger="load"
          delay={140}
          groupSize={3}
          text={h.title}
          className="mt-6 max-w-[18ch] text-[clamp(2.75rem,6.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.045em] text-balance"
          emClassName="text-white/60"
        />
        <p className="load-blur mt-6 max-w-[38rem] text-[17px] leading-relaxed text-white/80 text-pretty" style={d(340)}>
          {h.sub}
        </p>
        <div className="load-blur mt-8 flex flex-wrap justify-center gap-3" style={d(440)}>
          <Button href="/free-roadmap" size="lg">
            {h.primary}
          </Button>
          <Button href={SITE.whatsappHref} variant="glass" size="lg" icon="whatsapp">
            {h.secondary}
          </Button>
        </div>
        <ul className="load-fade mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-white/65" style={d(560)}>
          {h.trust.map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-1 rounded-full bg-white/35" />}
              <Rich text={t} />
            </li>
          ))}
        </ul>

        <span className="load-fade mt-12 hidden flex-col sm:inline-flex items-center gap-2 text-[12px] text-white/55" style={d(1200)}>
          {h.scroll}
          <span aria-hidden className="relative block h-7 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-2 animate-[scroll-cue_1.8s_var(--ease-fluid)_infinite] bg-white" />
          </span>
        </span>
      </div>
    </section>
  );
}
