import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves the English homepage at "/" from the internal app/[lang] route (/en).
 *
 * Every other English URL is mapped by the rewrites in next.config.ts. The
 * homepage is done here instead because on Vercel the browser's background
 * requests for "/" (prefetches and in-site navigation, e.g. clicking the logo)
 * arrive as "/index…", which the config rewrite turned into the unknown page
 * /en/index, so the 404 page appeared. A proxy rewrite sees the real "/" and
 * Next.js carries it through to those requests as well.
 *
 * The matcher keeps this to the homepage, so other pages never run it.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/en";
  return NextResponse.rewrite(url);
}

export const config = { matcher: "/" };
