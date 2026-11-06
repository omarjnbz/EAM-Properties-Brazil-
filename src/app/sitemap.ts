import type { MetadataRoute } from "next";
import { PODCAST_LIVE } from "@/content/podcast";
import { SITE } from "@/content/site";
import { LOCALES, TRANSLATED_PATHS, languageAlternates } from "@/i18n/config";

/** Every public page, for search engines. Placeholder legal pages, and the podcast until its first episode, are left out. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/residence-by-investment/brazil", priority: 0.9, changeFrequency: "monthly" },
  { path: "/refused-visa", priority: 0.9, changeFrequency: "monthly" },
  { path: "/free-roadmap", priority: 0.9, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides/brazil", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides/argentina", priority: 0.8, changeFrequency: "monthly" },
  { path: "/residence-by-investment", priority: 0.8, changeFrequency: "monthly" },
  { path: "/citizenship-by-investment", priority: 0.8, changeFrequency: "monthly" },
  { path: "/citizenship-by-investment/argentina", priority: 0.8, changeFrequency: "monthly" },
  { path: "/uae-golden-visa", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visit-visas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/why-eam-global", priority: 0.7, changeFrequency: "monthly" },
  { path: "/testimonials", priority: 0.7, changeFrequency: "weekly" },
  ...(PODCAST_LIVE ? [{ path: "/podcast", priority: 0.6, changeFrequency: "weekly" as const }] : []),
  { path: "/legal-translation-attestation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/company-formation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/relocation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

const abs = (path: string) => new URL(path, SITE.url).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-16");
  return ROUTES.flatMap((r) => {
    if (!TRANSLATED_PATHS.has(r.path)) return [{ url: abs(r.path), lastModified, changeFrequency: r.changeFrequency, priority: r.priority }];
    // Translated pages: one entry per language, each listing the others (hreflang).
    const alt = languageAlternates(r.path, "en").languages;
    const languages = Object.fromEntries(Object.entries(alt).map(([k, v]) => [k, abs(v)]));
    return LOCALES.map((l) => ({
      url: abs(languageAlternates(r.path, l).canonical),
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    }));
  });
}
