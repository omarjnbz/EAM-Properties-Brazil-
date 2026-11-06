import type { Metadata } from "next";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { MapPinLine } from "@phosphor-icons/react/dist/ssr/MapPinLine";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { PRESENCE, SITE } from "@/content/site";
import { languageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { Bezel, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";
import { PageHero } from "@/components/page/page-hero";
import { WorldRoutes } from "@/components/art/maps";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialLinks } from "@/components/ui/social-links";
import rio from "@/assets/stock/rio-sunset.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    title: t.meta.contact.title,
    description: t.meta.contact.description,
    alternates: languageAlternates("/contact", locale),
  };
}

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const c = t.contact;
  const CHANNELS = [
    { key: "whatsapp", Icon: WhatsappLogo, channel: c.channels.whatsapp, detail: SITE.whatsappDisplay, suffix: c.channels.fastest, ltr: true, href: SITE.whatsappHref },
    { key: "call", Icon: Phone, channel: c.channels.call, detail: SITE.phoneDisplay, ltr: true, href: SITE.phoneHref },
    { key: "email", Icon: EnvelopeSimple, channel: c.channels.email, detail: SITE.email, ltr: true, href: SITE.emailHref },
    { key: "office", Icon: MapPinLine, channel: c.channels.office, detail: c.address },
    { key: "hours", Icon: Clock, channel: c.channels.hours, detail: c.walkIn },
  ];
  // Offices: time zones from site.ts, words from the page's language.
  const presence = PRESENCE.map((p) => ({ ...p, ...c.presence.find((x) => x.key === p.key) }));

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.headline}
        intro={c.line}
        crumbs={[{ label: c.crumb }]}
        ctas={false}
        image={rio}
        imageAlt={c.imageAlt}
        imageCaption={c.imageCaption}
      />

      <Section tone="paper-2" className="pt-16 md:pt-20 lg:pt-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <ul className="flex flex-col">
                {CHANNELS.map(({ key, Icon, channel, detail, suffix, ltr, href }) => {
                  const body = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-ink/[0.07]">
                        <Icon weight={key === "whatsapp" ? "regular" : "light"} className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">{channel}</span>
                        <span className="mt-1 block text-[16px] text-ink">
                          {ltr ? <bdi dir="ltr">{detail}</bdi> : <Rich text={detail} />}
                          {suffix && <> {suffix}</>}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={key} className="border-t border-dashed border-ink/[0.12] first:border-0">
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
            <Reveal delay={120} className="mt-6 border-t border-line pt-6">
              <div className="text-[13px] font-medium text-ink-3">{t.common.followStories}</div>
              <SocialLinks className="mt-3" />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal variant="scale">
              <Bezel tone="white" radius="2.2rem">
                <ContactForm copy={t.forms.contact} locale={locale} />
              </Bezel>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow={c.presenceEyebrow} title={c.presenceTitle} />
          <Reveal variant="scale" className="mt-12">
            <Bezel tone="white" radius="2.2rem">
              <div className="relative p-6 md:p-10">
                <WorldRoutes />
                <p className="mt-4 text-[13px] text-ink-3">
                  {c.mapNote} <Rich text={c.address} />
                </p>
              </div>
            </Bezel>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {presence.map((p, i) => (
              <Reveal as="li" key={p.key} delay={i * 70}>
                <div className="h-full rounded-[1.6rem] bg-[#fbf9f4] p-5 ring-1 ring-ink/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                      <LiveDot className="size-1.5" color={p.key === "dubai" ? "bg-sun" : "bg-leaf"} /> {p.type.includes("{{") ? c.localTeam : p.type}
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
