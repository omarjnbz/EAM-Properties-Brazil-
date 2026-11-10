/**
 * Languages of the site. English is the master and keeps its unprefixed URLs
 * (/contact); Arabic and Portuguese live under /ar and /pt. next.config.ts maps
 * the unprefixed English URLs onto app/[lang] with lang = "en" (src/proxy.ts does
 * the homepage).
 *
 * Safe to import from client components (no server-only APIs here).
 */
export const LOCALES = ["en", "ar", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

export const LOCALE_META: Record<Locale, { label: string; short: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", short: "EN", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "العربية", short: "AR", dir: "rtl", htmlLang: "ar", ogLocale: "ar_AE" },
  pt: { label: "Português", short: "PT", dir: "ltr", htmlLang: "pt-BR", ogLocale: "pt_BR" },
};

/**
 * Pages that exist in every language. Translation is phased: every other page
 * is English-only for now, so links to it from the Arabic or Portuguese site
 * open the English page. Add a path here (and move its folder out of
 * app/[lang]/(english)) once its copy is translated.
 */
export const TRANSLATED_PATHS: ReadonlySet<string> = new Set(["/", "/contact", "/book"]);

const PREFIX = /^\/(ar|pt|en)(?=\/|$)/;

/** "/ar/contact" → { locale: "ar", path: "/contact" }; "/contact" → English. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const m = pathname.match(PREFIX);
  if (!m) return { locale: DEFAULT_LOCALE, path: pathname || "/" };
  return { locale: m[1] as Locale, path: pathname.slice(m[0].length) || "/" };
}

/** The page path without its language prefix. Matches on the server and in the browser. */
export const pathWithoutLocale = (pathname: string) => splitLocale(pathname).path;

function prefixed(path: string, locale: Locale) {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Points an internal link at the visitor's language when that page is
 * translated; otherwise leaves the English URL. External links, anchors and
 * mailto/tel links pass through untouched.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  if (!TRANSLATED_PATHS.has(path)) return href;
  return prefixed(path, locale) + rest;
}

/** Where the language switcher sends you: the same page in that language, or its homepage. */
export function switchLocaleHref(pathname: string, target: Locale): string {
  const path = pathWithoutLocale(pathname);
  if (target === DEFAULT_LOCALE) return path;
  return prefixed(TRANSLATED_PATHS.has(path) ? path : "/", target);
}

/** hreflang alternates for a translated page (canonical stays on its own language). */
export function languageAlternates(path: string, locale: Locale) {
  const languages: Record<string, string> = { "x-default": path };
  for (const l of LOCALES) languages[LOCALE_META[l].htmlLang] = prefixed(path, l);
  return { canonical: prefixed(path, locale), languages };
}
