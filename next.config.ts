import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
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
