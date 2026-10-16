import Image from "next/image";
import night from "@/assets/stock/sao-paulo-night.jpg";
import { DOOR_STAGES, HOME } from "@/content/home";
import { SITE } from "@/content/site";
import { Button, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/** Door-to-door relocation: where other firms stop, this package starts. */
export function DoorSplit() {
  const d = HOME.door;
  return (
    <section className="bg-canvas py-20 md:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal variant="scale" className="lg:col-span-6">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-paper-2">
            <div className="absolute inset-0" data-zoom-in suppressHydrationWarning>
              <Image src={night} alt="São Paulo at night, with light trails on the avenues" fill placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
              {DOOR_STAGES.map((s) => (
                <span key={s.stage} className="rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-medium backdrop-blur-md">
                  {s.stage}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <SectionHeading eyebrow={d.eyebrow} title="The move, not just *the visa*" intro={d.body} />
          <Reveal delay={200} className="mt-8 flex flex-wrap gap-3">
            <Button href="/relocation">{d.button}</Button>
            <Button href={SITE.whatsappHref} variant="ghost" icon="whatsapp">
              Talk to an advisor now
            </Button>
          </Reveal>
          <ul className="mt-10 flex flex-col">
            {DOOR_STAGES.slice(1, 4).map((s, i) => (
              <Reveal as="li" key={s.stage} delay={240 + i * 80} className="flex gap-4 border-t border-line py-4">
                <span className="w-28 shrink-0 text-[14px] font-semibold tracking-[-0.01em]">{s.stage}</span>
                <span className="text-[14px] leading-relaxed text-ink-3">{s.does}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
