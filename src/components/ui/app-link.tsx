"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

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

type Props = React.ComponentProps<typeof Link>;

/**
 * next/link that stops background prefetching on slow or metered connections,
 * so visitors on 2G/3G only download the pages they actually open.
 */
export function AppLink({ prefetch, ...props }: Props) {
  const lite = useLiteNetwork();
  return <Link prefetch={lite ? false : prefetch} {...props} />;
}
