import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Draft protection: until SITE_INDEXABLE=true is set (at launch), every page,
  // PDF and image tells search engines not to index it. Link previews still work.
  async headers() {
    if (process.env.SITE_INDEXABLE === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  images: {
    // AVIF first: the smallest files for visitors on slow mobile networks.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  turbopack: {
    // Pin the workspace root (a stray lockfile in the home folder confuses detection).
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
