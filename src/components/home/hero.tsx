import Image from "next/image";
import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import rio from "@/assets/stock/rio-sunset-water.jpg";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { Button, Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

/** Full-bleed Brazil hero: headline bottom-left, a live "advisor online" card bottom-right. */
export function Hero() {
  const h = HOME.hero;
  return (
    <section data-parallax-root className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10" data-parallax="14" suppressHydrationWarning>
        <div className="load-zoom absolute inset-0">
          <Image src={rio} alt="Sugarloaf Mountain and Guanabara Bay at sunset, Rio de Janeiro" fill preload placeholder="blur" sizes="100vw" className="object-cover object-[50%_45%]" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/80" />
      <div aria-hidden className="absolute inset-y-0 start-0 -z-10 w-2/3 bg-gradient-to-r from-ink/45 to-transparent" />

      <div className="container-site pb-10 pt-36 md:pb-14" data-hero-fade suppressHydrationWarning>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="load-blur" style={d(150)}>
              <Eyebrow tone="glass">{h.eyebrow}</Eyebrow>
            </div>
            <SplitHeading
              as="h1"
              trigger="load"
              delay={260}
              groupSize={3}
              text="We don't just get you the visa. *We get you home.*"
              className="mt-6 max-w-[16ch] text-[clamp(2.75rem,6.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.045em] text-balance"
              emClassName="text-white/60"
            />
            <p className="load-blur mt-6 max-w-[38rem] text-[17px] leading-relaxed text-white/80 text-pretty" style={d(700)}>
              {h.sub}
            </p>
            <div className="load-blur mt-8 flex flex-wrap gap-3" style={d(840)}>
              <Button href="/free-roadmap" size="lg">
                {h.primary}
              </Button>
              <Button href={SITE.whatsappHref} variant="glass" size="lg" icon="whatsapp">
                {h.secondary}
              </Button>
            </div>
          </div>

          <div className="load-blur lg:col-span-4" style={d(1000)}>
            <div className="rounded-[22px] bg-white/12 p-5 ring-1 ring-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[14px] font-medium">
                  <LiveDot className="size-2" /> Advisor online
                </span>
                <span className="text-[12.5px] text-white/65">Replies within 60 min</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { city: "Dubai HQ", tz: "Asia/Dubai" },
                  { city: "São Paulo", tz: "America/Sao_Paulo" },
                ].map((c) => (
                  <div key={c.city} className="rounded-2xl bg-white/10 px-3.5 py-3">
                    <div className="text-[12px] text-white/60">{c.city}</div>
                    <LiveClock timeZone={c.tz} className="mt-0.5 block text-[1.6rem] font-medium tracking-[-0.03em]" />
                  </div>
                ))}
              </div>
              <ul className="mt-4 flex flex-col gap-2 text-[13.5px] text-white/85">
                {h.trust.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="grid size-4 place-items-center rounded-full bg-white/20">
                      <Check weight="bold" className="size-2.5" aria-hidden />
                    </span>
                    <Rich text={t} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="load-fade mt-10 flex items-center justify-between border-t border-white/15 pt-5 text-[12.5px] text-white/60" style={d(1200)}>
          <span className="inline-flex items-center gap-1.5">
            <MapPin weight="fill" className="size-3.5" aria-hidden /> Rio de Janeiro, Brazil
          </span>
          <span className="hidden sm:inline">Dubai HQ · Local teams in Latin America and Europe</span>
          <span className="inline-flex items-center gap-2">
            Scroll
            <span aria-hidden className="relative block h-6 w-px overflow-hidden bg-white/25">
              <span className="absolute inset-x-0 top-0 h-2 animate-[scroll-cue_1.8s_var(--ease-fluid)_infinite] bg-white" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
