import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/** Every public page, for search engines. Placeholder legal pages are left out until they have real content. */
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
  { path: "/podcast", priority: 0.6, changeFrequency: "weekly" },
  { path: "/legal-translation-attestation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/company-formation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/relocation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-16");
  return ROUTES.map((r) => ({ url: new URL(r.path, SITE.url).toString(), lastModified, changeFrequency: r.changeFrequency, priority: r.priority }));
}
