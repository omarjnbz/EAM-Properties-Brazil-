import { notFound } from "next/navigation";
import { getLocale } from "@/i18n/server";

/**
 * Pages not translated yet. They exist in English only, so /ar/… and /pt/…
 * versions of them return 404 (the language switcher and localized links send
 * Arabic and Portuguese visitors to the English URL instead). Once a page is
 * translated, move its folder up to app/[lang] and add it to TRANSLATED_PATHS.
 */
export default async function EnglishOnlyLayout({ children }: LayoutProps<"/[lang]">) {
  if ((await getLocale()) !== "en") notFound();
  return children;
}
