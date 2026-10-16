import Image from "next/image";
import sugarloaf from "@/assets/stock/rio-sugarloaf-dusk.jpg";
import { SITE } from "@/content/site";
import { Button, Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";
import { Reveal } from "@/components/ui/reveal";
import { LiveDot } from "@/components/ui/live-dot";

/** The two calls to action every page ends with, over a full-bleed photo. */
export function EndCta() {
  return (
    <section aria-label="Start your move" className="bg-canvas px-3 pb-3 pt-6 md:px-4 md:pb-4" data-parallax-root>
      <div className="relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden rounded-[28px] bg-ink px-5 py-24 text-center text-white">
        <div className="absolute inset-x-0 -top-[12%] -z-10 h-[124%]" data-parallax="8" suppressHydrationWarning>
          <Image src={sugarloaf} alt="" fill placeholder="blur" sizes="100vw" className="object-cover object-[50%_62%]" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,27,47,0.35),rgba(11,27,47,0.75))]" />

        <div className="flex max-w-3xl flex-col items-center gap-6">
          <Reveal>
            <Eyebrow tone="glass" icon={<LiveDot className="size-1.5" />}>
              Advisors online 24/7
            </Eyebrow>
          </Reveal>
          <SplitHeading text="From Dubai to your new *front door*." className="text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance" emClassName="text-white/55" />
          <Reveal delay={160}>
            <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-white/75">
              Start with a free written roadmap you can keep, or talk to a real person right now. A real advisor replies within 60 minutes, any hour.
            </p>
          </Reveal>
          <Reveal delay={260} className="flex flex-wrap justify-center gap-3">
            <Button href="/free-roadmap" size="lg">
              {SITE.cta.roadmap}
            </Button>
            <Button href={SITE.whatsappHref} variant="glass" size="lg" icon="whatsapp">
              {SITE.cta.talk} · {SITE.cta.talkSuffix}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
