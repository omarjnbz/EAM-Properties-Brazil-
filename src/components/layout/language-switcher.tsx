"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { Globe } from "@phosphor-icons/react/dist/csr/Globe";
import { LOCALES, LOCALE_META, type Locale, switchLocaleHref } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * Plain links, not client navigation: a language change swaps the page
 * direction, font and every string, so a fresh page load is the honest version.
 */
function useTargets() {
  const pathname = usePathname() ?? "/";
  return LOCALES.map((l) => ({ locale: l, href: switchLocaleHref(pathname, l), ...LOCALE_META[l] }));
}

/** Compact language picker for the navigation bar: a globe with the current code, opening a small list. */
export function LanguageMenu({ locale, label, note, onImage, className }: { locale: Locale; label: string; note: string; onImage: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const targets = useTargets();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${LOCALE_META[locale].label}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold tracking-[0.02em] transition-colors duration-300",
          onImage ? "text-white/90 hover:bg-white/10" : "text-ink-2 hover:bg-ink/[0.05]",
          open && (onImage ? "bg-white/15" : "bg-ink/[0.05]"),
        )}
      >
        <Globe weight="regular" className="size-[18px]" aria-hidden />
        <span className="hidden sm:inline">{LOCALE_META[locale].short}</span>
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute end-0 top-full z-[3] mt-2 w-60 rounded-[20px] bg-white p-2 text-ink shadow-[0_1px_2px_rgba(11,27,47,0.06),0_24px_60px_-24px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06]"
      >
        <p className="px-3 pb-1 pt-2 text-[12px] font-medium text-ink-3">{label}</p>
        <ul>
          {targets.map((t) => (
            <li key={t.locale}>
              <a
                href={t.href}
                hrefLang={t.htmlLang}
                lang={t.htmlLang}
                aria-current={t.locale === locale ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors duration-200 hover:bg-canvas",
                  t.locale === locale ? "font-semibold text-ink" : "text-ink-2",
                )}
              >
                <span>{t.label}</span>
                {t.locale === locale ? <Check weight="bold" className="size-4 text-leaf" aria-hidden /> : <span className="text-[11px] font-medium text-ink-3">{t.short}</span>}
              </a>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-3 pb-1.5 pt-2.5 text-[12px] leading-snug text-ink-3">{note}</p>
      </div>
    </div>
  );
}

/** The three languages as a row of links (mobile menu and footer). */
export function LanguageLinks({ locale, label, tone = "light", className }: { locale: Locale; label: string; tone?: "light" | "dark"; className?: string }) {
  const targets = useTargets();
  const dark = tone === "dark";
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {targets.map((t) => (
          <li key={t.locale}>
            <a
              href={t.href}
              hrefLang={t.htmlLang}
              lang={t.htmlLang}
              aria-current={t.locale === locale ? "true" : undefined}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium transition-colors duration-200",
                t.locale === locale
                  ? dark
                    ? "bg-white/15 text-white"
                    : "bg-ink text-white"
                  : dark
                    ? "text-white/60 hover:text-white"
                    : "text-ink-3 hover:text-ink",
              )}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
