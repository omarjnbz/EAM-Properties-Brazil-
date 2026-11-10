/**
 * Recent leads for the admin panel, read back from the leads Google Sheet
 * through its Apps Script web app (the same LEADS_WEBHOOK_URL the site posts to).
 *
 * It asks with a GET (`?action=list&secret=…`). A script deployed before the
 * list action existed answers a GET with its plain health check, so asking can
 * never add a row; the panel then says the script needs its update.
 */
export type SheetLead = Record<string, string>;

export type LeadsResult =
  | { leads: SheetLead[] }
  | { unavailable: "no-webhook" | "old-script" | "error"; detail?: string };

export async function recentLeads(limit = 60): Promise<LeadsResult> {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return { unavailable: "no-webhook" };
  const q = new URLSearchParams({ action: "list", limit: String(limit), secret: process.env.LEADS_WEBHOOK_SECRET ?? "" });
  try {
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}${q}`, { signal: AbortSignal.timeout(12_000), cache: "no-store", redirect: "follow" });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; leads?: SheetLead[]; service?: string; error?: string } | null;
    if (json && Array.isArray(json.leads)) return { leads: json.leads };
    if (json?.service) return { unavailable: "old-script" };
    if (!json) return { unavailable: "error", detail: "the leads address didn't answer like the Google Sheet's Apps Script (no JSON). On a local test server it may point to a stand-in." };
    return { unavailable: "error", detail: json.error === "unauthorised" ? "the Sheet refused the secret: LEADS_WEBHOOK_SECRET must match the script's SECRET." : json.error || `the Sheet answered ${res.status}.` };
  } catch (err) {
    return { unavailable: "error", detail: err instanceof Error ? err.message : "The Sheet didn't answer." };
  }
}
