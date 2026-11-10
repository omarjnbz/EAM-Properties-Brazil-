import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Money } from "@phosphor-icons/react/dist/ssr/Money";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { VideoCamera } from "@phosphor-icons/react/dist/ssr/VideoCamera";
import { BOOKING } from "@/content/site";
import type { Dictionary } from "@/content/i18n";
import { cn } from "@/lib/cn";
import { Bezel, Container, Section, SectionHeading, TextLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { bookingMode } from "@/lib/booking/calendar";
import { BookingCalendar } from "./booking-calendar";
import { BookingPicker } from "./booking-picker";

/**
 * "Book a call": the paid 30-minute video call with the founder, with its facts
 * beside Google's booking calendar. Used on /book (as the page's h1), the contact
 * page and anywhere else that links to /book or #book.
 */
export function BookCall({ copy, as = "h2", id = "book", className }: { copy: Dictionary["booking"]; as?: "h1" | "h2"; id?: string; className?: string }) {
  const mode = bookingMode();
  const facts = [
    { Icon: Clock, label: copy.lengthLabel, value: copy.lengthValue },
    { Icon: VideoCamera, label: copy.viaLabel, value: copy.viaValue },
    { Icon: Money, label: copy.feeLabel, value: BOOKING.price, note: copy.feeNote },
    { Icon: Translate, label: copy.languagesLabel, value: copy.languagesValue },
  ];

  return (
    <Section tone="paper-2" id={id} className={cn("scroll-mt-20", className)}>
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <SectionHeading as={as} eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
          <Reveal delay={160}>
            <dl className="mt-10 flex flex-col">
              {facts.map(({ Icon, label, value, note }) => (
                <div key={label} className="flex items-start gap-4 border-t border-dashed border-ink/[0.12] py-4 first:border-0">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-ink/[0.07]">
                    <Icon weight="light" className="size-5" aria-hidden />
                  </span>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">{label}</dt>
                    <dd className="mt-1 text-[16px] text-ink">{value}</dd>
                    {note && <dd className="mt-0.5 text-[13px] text-ink-3">{note}</dd>}
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-6 text-[14.5px] text-ink-3">
              {copy.free} <TextLink href="/free-roadmap">{copy.freeLink}</TextLink>
            </p>
          </Reveal>
        </div>

        {/* min-w-0: the picker's day strip scrolls inside the card instead of widening the page. */}
        <Reveal variant="scale" className="min-w-0 lg:col-span-7">
          <Bezel tone="white">
            {/* The site's own calendar once Google is connected (or as a preview off production); Google's page until then. */}
            {mode === "off" ? <BookingCalendar copy={copy} /> : <BookingPicker copy={copy} preview={mode === "preview"} />}
          </Bezel>
        </Reveal>
      </Container>
    </Section>
  );
}
