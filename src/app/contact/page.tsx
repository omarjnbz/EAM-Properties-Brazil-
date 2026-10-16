import type { Metadata } from "next";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { MapPinLine } from "@phosphor-icons/react/dist/ssr/MapPinLine";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { CONTACT, SEO } from "@/content/pages";
import { PRESENCE, SITE } from "@/content/site";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";
import { PageHero } from "@/components/page/page-hero";
import { WorldRoutes } from "@/components/art/maps";
import { ContactForm } from "@/components/forms/contact-form";
import rio from "@/assets/stock/rio-sunset.jpg";

export const metadata: Metadata = {
  title: SEO.contact.title,
  description: SEO.contact.description,
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { Icon: WhatsappLogo, channel: "WhatsApp", detail: `${SITE.whatsappDisplay} (fastest)`, href: SITE.whatsappHref },
  { Icon: Phone, channel: "Phone", detail: SITE.phoneDisplay, href: SITE.phoneHref },
  { Icon: EnvelopeSimple, channel: "Email", detail: SITE.email, href: SITE.emailHref },
  { Icon: MapPinLine, channel: "Head office", detail: SITE.address },
  { Icon: Clock, channel: "Office hours", detail: SITE.walkIn },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={CONTACT.eyebrow}
        title={CONTACT.headline}
        intro={CONTACT.line}
        crumbs={[{ label: "Contact" }]}
        ctas={false}
        image={rio}
        imageAlt="Copacabana and the hills of Rio de Janeiro at sunset"
        imageCaption="Advisors online 24/7 · replies within 60 minutes"
      />

      <Section tone="paper-2" className="pt-16 md:pt-20 lg:pt-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <ul className="flex flex-col">
                {CHANNELS.map(({ Icon, channel, detail, href }) => {
                  const body = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-ink/[0.07]">
                        <Icon weight={channel === "WhatsApp" ? "regular" : "light"} className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">{channel}</span>
                        <span className="mt-1 block text-[16px] text-ink">
                          <Rich text={detail} />
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={channel} className="border-t border-dashed border-ink/[0.12] first:border-0">
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-4 py-4 transition-colors hover:text-leaf-deep">
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 py-4">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal variant="scale">
              <Bezel tone="white" radius="2.2rem">
                <ContactForm />
              </Bezel>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Dubai head office and local teams" title="Somebody is always *awake*" />
          <Reveal variant="scale" className="mt-12">
            <Bezel tone="white" radius="2.2rem">
              <div className="relative p-6 md:p-10">
                <WorldRoutes />
                <p className="mt-4 text-[13px] text-ink-3">
                  Map embed of the Dubai office will be added once the address is confirmed: <Rich text={SITE.address} />
                </p>
              </div>
            </Bezel>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PRESENCE.map((p, i) => (
              <Reveal as="li" key={p.key} delay={i * 70}>
                <div className="h-full rounded-[1.6rem] bg-[#fbf9f4] p-5 ring-1 ring-ink/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                      <LiveDot className="size-1.5" color={p.key === "dubai" ? "bg-sun" : "bg-leaf"} /> {p.type.includes("{{") ? "Local team" : p.type}
                    </span>
                    <LiveClock timeZone={p.timeZone} className="font-display text-[1.25rem] text-ink" />
                  </div>
                  <div className="mt-4 font-display text-[1.5rem] leading-tight">
                    <Rich text={p.city} />
                  </div>
                  <div className="mt-1 text-[13.5px] text-ink-3">{p.country}</div>
                  <div className="mt-3 text-[13px] text-ink-2">
                    <Rich text={p.languages} />
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
