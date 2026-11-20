/**
 * Whether search engines may index this deployment. The live site (Vercel
 * production) is indexable; previews and local builds are not, so branch
 * copies never compete with the real pages. SITE_INDEXABLE overrides it:
 * "false" hides the live site from search engines, "true" allows any build.
 * Used by next.config.ts (the X-Robots-Tag header) and the admin panel.
 */
export function isIndexable(env: Record<string, string | undefined> = process.env): boolean {
  if (env.SITE_INDEXABLE === "false") return false;
  if (env.SITE_INDEXABLE === "true") return true;
  return env.VERCEL_ENV === "production";
}
