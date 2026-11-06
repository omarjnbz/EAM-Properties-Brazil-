import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // The vercel.app address is a duplicate of the live site.
      {
        source: "/:path*",
        has: [{ type: "host", value: "eam-properties-brazil.vercel.app" }],
        destination: "https://www.eam-global.lat/:path*",
        permanent: true,
      },
      // English lives at unprefixed URLs; /en/… is only the internal route.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  // Every page is under app/[lang]. Arabic and Portuguese URLs (/ar, /pt) match it
  // directly; everything else is English and is served from /en internally.
  // afterFiles: static files, /api and metadata routes are matched first.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:path((?!(?:ar|pt|en)(?:/|$)).+)", destination: "/en/:path" },
      ],
      fallback: [],
    };
  },
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
