import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import logo from "@/assets/brand/eam-global-logo.png";
import { FOOTER } from "@/content/nav";
import { SITE } from "@/content/site";
import { AppLink } from "@/components/ui/app-link";
import { Rich } from "@/components/ui/rich";
import { LiveDot } from "@/components/ui/live-dot";

export function SiteFooter() {
  return (
    <footer className="bg-canvas px-3 pb-3 md:px-4 md:pb-4">
      <div className="rounded-[28px] bg-ink text-white">
        <div className="container-site pb-8 pt-16 md:pt-20">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Image src={logo} alt="EAM Global" width={120} height={47} className="h-11 w-auto brightness-0 invert" />
              <p className="mt-6 max-w-sm text-[22px] font-medium leading-snug tracking-[-0.025em]">We don&apos;t just get you the visa. We get you home.</p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
                <Rich text={FOOTER.facts} />
              </p>
              <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.08em] text-white/35">{SITE.descriptor}</p>

              <ul className="mt-8 flex flex-col gap-3 text-[14.5px]">
                <li>
                  <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                    <WhatsappLogo className="size-4 text-[#7fbf3a]" aria-hidden /> WhatsApp {SITE.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                    <Phone className="size-4" aria-hidden /> {SITE.phoneDisplay}
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

          <div className="mt-14 flex flex-wrap items-center gap-2.5">
            {["24/7 response", "No Win, No Fee", "{{Licensing authority logo}}", "English · Português · العربية"].map((b, i) => (
              <span key={b} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-[12.5px] text-white/80 ring-1 ring-white/10">
                {i === 0 && <LiveDot className="size-1.5" />}
                <Rich text={b} />
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-[12.5px] text-white/45 md:flex-row md:items-center md:justify-between">
            <p>© 2026 EAM Global. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER.legal.map((l) => (
                <li key={l.label}>
                  <AppLink href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </AppLink>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-3">
              <span className="text-white">English</span>
              <span title="Coming soon">Português</span>
              <span title="Coming soon" lang="ar">
                العربية
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
