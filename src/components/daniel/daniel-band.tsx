import { getDictionary } from "@/i18n/server";
import { chatEnabled } from "@/lib/chat/providers";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { BandPreview } from "./band-preview";

/**
 * Homepage, straight after the hero: "Not sure where to start? Ask Daniel."
 * next to a live preview of a chat with him. Its bottom edge is the cue for the
 * launcher (and his greeting) to pop in ([data-daniel-anchor]).
 * Hidden while the chat is off.
 */
export async function DanielBand() {
  if (!chatEnabled()) return null;
  const { chat } = await getDictionary();
  const b = chat.band;
  return (
    <section aria-label={chat.dialogLabel} data-daniel-anchor className="bg-canvas pt-10 md:pt-14">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_24px_60px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05] sm:p-8 lg:p-10">
          <div
            aria-hidden
            data-decor
            className="pointer-events-none absolute -top-24 end-[-10%] size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(127,180,234,0.22),transparent)]"
          />
          <div className="relative grid items-center gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-3 px-2 pt-2 sm:gap-4 sm:px-0 sm:pt-0 lg:col-span-5">
              <p className="text-[12.5px] font-medium uppercase tracking-[0.08em] text-navy">{b.eyebrow}</p>
              <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.7rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
                <Rich text={b.title} emClassName="text-navy" />
              </h2>
              <p className="hidden max-w-md text-[15.5px] leading-relaxed text-ink-3 sm:block">{b.body}</p>
            </div>
            <div className="lg:col-span-7">
              <BandPreview copy={chat} />
              <p className="mt-3 px-2 text-[12px] text-ink-3 sm:px-0">{chat.disclaimer}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
