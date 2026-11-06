import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import logo from "@/assets/brand/eam-global-logo.png";
import { buildFooter } from "@/content/nav";
import { SITE } from "@/content/site";
import { getI18n } from "@/i18n/server";
import { LanguageLinks } from "@/components/layout/language-switcher";
import { AppLink } from "@/components/ui/app-link";
import { Rich } from "@/components/ui/rich";
import { LiveDot } from "@/components/ui/live-dot";
import { Button } from "@/components/ui/primitives";
import { SocialLinks } from "@/components/ui/social-links";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";

export async function SiteFooter() {
  const { locale, t } = await getI18n();
  const f = t.footer;
  const FOOTER = buildFooter(f.text);
  return (
    <footer className="bg-canvas px-3 pb-3 md:px-4 md:pb-4">
      <div className="rounded-[28px] bg-ink text-white">
        <div className="container-site pb-8 pt-16 md:pt-20">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Image src={logo} alt="EAM Global" width={120} height={47} className="h-11 w-auto brightness-0 invert" />
              <p className="mt-6 max-w-sm text-[22px] font-medium leading-snug tracking-[-0.025em]">{f.blurb}</p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
                <Rich text={f.facts} />
              </p>
              <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.08em] text-white/35">{f.descriptor}</p>

              <ul className="mt-8 flex flex-col gap-3 text-[14.5px]">
                <li>
                  <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                    <WhatsappLogo className="size-4 text-[#7fbf3a]" aria-hidden /> {t.common.whatsapp}: <bdi dir="ltr">{SITE.whatsappDisplay}</bdi>
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                    <Phone className="size-4" aria-hidden /> {t.common.call}: <bdi dir="ltr">{SITE.phoneDisplay}</bdi>
                  </a>
                </li>
                <li>
                  <a href={SITE.emailHref} className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                    <EnvelopeSimple className="size-4" aria-hidden /> {SITE.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:ps-10">
              {FOOTER.columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <h2 className="text-[13px] font-medium text-white/45">{col.title}</h2>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <AppLink href={l.href} className="text-[14.5px] text-white/75 transition-colors duration-300 hover:text-white">
                          {l.label}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-8 rounded-[22px] bg-white/[0.04] p-6 ring-1 ring-white/10 md:grid-cols-2 md:items-center md:p-8">
            <div>
              <div className="text-[13px] font-medium text-white/50">{f.newsletterEyebrow}</div>
              <p className="mt-1.5 max-w-md text-[18px] font-medium leading-snug tracking-[-0.02em]">{f.newsletterTitle}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button href="/guides/brazil" variant="paper">
                  {f.brazilGuide}
                </Button>
                <Button href="/guides/argentina" variant="ghost-light">
                  {f.argentinaGuide}
                </Button>
              </div>
            </div>
            <div className="md:justify-self-end">
              <div className="text-[13px] font-medium text-white/50">{t.common.followStories}</div>
              <SocialLinks tone="dark" className="mt-3" />
              <AppLink href="/podcast" className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/85 hover:text-white">
                {f.podcast}
                <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
              </AppLink>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {f.badges.map((b, i) => (
              <span key={b} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-[12.5px] text-white/80 ring-1 ring-white/10">
                {i === 0 && <LiveDot className="size-1.5" />}
                <Rich text={b} />
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-[12.5px] text-white/45 md:flex-row md:items-center md:justify-between">
            <p>{f.rights}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER.legal.map((l) => (
                <li key={l.label}>
                  <AppLink href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </AppLink>
                </li>
              ))}
            </ul>
            <LanguageLinks locale={locale} label={t.language.label} tone="dark" className="-mx-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}
