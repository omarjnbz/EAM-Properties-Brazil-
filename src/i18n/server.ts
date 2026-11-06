import { lang } from "next/root-params";
import { DICTIONARIES, type Dictionary } from "@/content/i18n";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/** The language of the page being rendered (the [lang] root segment). Server Components only. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

/** The copy for the page being rendered. */
export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

/** Both at once, for components that also localize data (country names, links). */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: DICTIONARIES[locale] };
}
