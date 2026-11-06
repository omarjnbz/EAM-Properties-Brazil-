import Image from "next/image";
import sugarloaf from "@/assets/stock/rio-sugarloaf-dusk.jpg";
import { SITE } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { Button, Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";
import { Reveal } from "@/components/ui/reveal";
import { LiveDot } from "@/components/ui/live-dot";

/** The two calls to action every page ends with, over a full-bleed photo. */
export async function EndCta() {
  const t = await getDictionary();
  const e = t.endCta;
  return (
    <section aria-label={e.aria} className="bg-canvas px-3 pb-3 pt-6 md:px-4 md:pb-4" data-parallax-root>
      <div className="relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden rounded-[28px] bg-ink px-5 py-24 text-center text-white">
        <div className="absolute inset-x-0 -top-[12%] -z-10 h-[124%]" data-parallax="8" suppressHydrationWarning>
          <Image src={sugarloaf} alt="" fill placeholder="blur" sizes="100vw" className="object-cover object-[50%_62%]" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,27,47,0.35),rgba(11,27,47,0.75))]" />

        <div className="flex max-w-3xl flex-col items-center gap-6">
          <Reveal>
            <Eyebrow tone="glass" icon={<LiveDot className="size-1.5" />}>
              {e.eyebrow}
            </Eyebrow>
          </Reveal>
          <SplitHeading text={e.title} className="text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-balance" emClassName="text-white/55" />
          <Reveal delay={160}>
            <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-white/75">
              {e.body}
            </p>
          </Reveal>
          <Reveal delay={260} className="flex flex-wrap justify-center gap-3">
            <Button href="/free-roadmap" size="lg">
              {t.common.getRoadmap}
            </Button>
            <Button href={SITE.whatsappHref} variant="glass" size="lg" icon="whatsapp">
              {t.common.talk247}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
