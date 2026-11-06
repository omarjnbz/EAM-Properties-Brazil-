"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { localizeHref, splitLocale } from "@/i18n/config";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-net"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.getAttribute("data-net") === "lite";
const getServerSnapshot = () => false;

/** True on 2G / 3G / Data Saver (see the boot script). */
export function useLiteNetwork() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The language of the current page, from its URL (/ar/…, /pt/…, else English). */
export function useLocale() {
  return splitLocale(usePathname() ?? "/").locale;
}

type Props = React.ComponentProps<typeof Link> & {
  /** Keep the href exactly as given (the language switcher builds its own). */
  keepLocale?: boolean;
};

/**
 * next/link that stops background prefetching on slow or metered connections,
 * so visitors on 2G/3G only download the pages they actually open. Internal
 * links follow the page's language when that page is translated.
 */
export function AppLink({ prefetch, href, keepLocale, ...props }: Props) {
  const lite = useLiteNetwork();
  const locale = useLocale();
  const target = !keepLocale && typeof href === "string" ? localizeHref(href, locale) : href;
  return <Link prefetch={lite ? false : prefetch} href={target} {...props} />;
}
