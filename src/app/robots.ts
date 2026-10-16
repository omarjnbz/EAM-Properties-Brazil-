import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Form endpoints and the guides' print layouts (the PDFs themselves stay crawlable).
      disallow: ["/api/", "/guides/brazil/print", "/guides/argentina/print"],
    },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
    host: SITE.url,
  };
}
