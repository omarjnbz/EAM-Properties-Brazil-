"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Web Analytics (visits) and Speed Insights (real-visitor speed), plus
 * conversion events for the contact links, tracked with one click listener so
 * no link needs its own code:
 *
 *   WhatsApp click · Call click · Email click · Guide PDF click
 *
 * Each event carries the page and where the link sat (nav, footer, floating
 * button or page content). Form leads are tracked on the server as "Lead"
 * (src/app/api/enquiry/route.ts) only once they are delivered.
 * Custom events need Vercel's Pro plan; on Hobby they are ignored.
 */
export function SiteAnalytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const event = eventFor(link.href);
      if (!event) return;
      track(event, { page: window.location.pathname, where: placeOf(link) });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function eventFor(href: string) {
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//.test(href)) return "WhatsApp click";
  if (href.startsWith("tel:")) return "Call click";
  if (href.startsWith("mailto:")) return "Email click";
  if (/\/guides\/[^/]+\.pdf($|\?)/.test(href)) return "Guide PDF click";
  return null;
}

function placeOf(link: Element) {
  if (link.closest("footer")) return "footer";
  if (link.closest("header, nav")) return "nav";
  if (link.closest("main")) return "content";
  return "floating";
}
