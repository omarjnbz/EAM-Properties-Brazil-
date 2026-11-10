import { connection } from "next/server";
import { recentLeads, type SheetLead } from "@/lib/admin/leads";
import { LeadsList, type LeadItem } from "./leads-list";
import { Notice, PageIntro } from "./ui";

const GOALS: Record<string, string> = {
  live: "Live abroad",
  passport: "Second passport",
  visit: "Visit or travel",
  business: "Business",
  refused: "Reapply after a refusal",
};

const SOURCES: Record<string, LeadItem["source"]> = {
  chat: "chat",
  roadmap: "roadmap",
  contact: "contact",
  guide: "guide",
};

/** "res-portugal" → "Residence in Portugal"; "visit-usa" → "Visit visa, USA"; "brazil" → "Brazil". */
function destination(value: string) {
  const name = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bUsa\b/, "USA").replace(/\bUk\b/, "UK").replace(/\bUae\b/, "UAE");
  if (value.startsWith("res-")) return `Residence in ${name(value.slice(4))}`;
  if (value.startsWith("cit-")) return `Citizenship of ${name(value.slice(4))}`;
  if (value.startsWith("visit-")) return `Visit visa, ${name(value.slice(6))}`;
  return name(value);
}

/** The Sheet stores Dubai time as "2026-11-11 09:30" (Dubai has no daylight saving). */
const received = (s: string) => Date.parse(`${s.replace(" ", "T")}:00+04:00`);

/** "11 Nov, 09:30" in Dubai time. */
const friendlyTime = (ms: number) =>
  new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Dubai" });

// Codes from the Sheet ("ar", "AE", "/pt/contact") in words.
const languageName = new Intl.DisplayNames(["en"], { type: "language" });
const regionName = new Intl.DisplayNames(["en"], { type: "region" });
const plainLanguage = (code: string) => {
  try {
    return languageName.of(code) ?? code;
  } catch {
    return code;
  }
};
const plainRegion = (code: string) => {
  try {
    return /^[A-Z]{2}$/i.test(code) ? (regionName.of(code.toUpperCase()) ?? code) : code;
  } catch {
    return code;
  }
};
function plainPage(path: string) {
  const m = path.match(/^\/(ar|pt)(?=\/|$)/);
  const lang = m ? (m[1] === "ar" ? " (Arabic)" : " (Portuguese)") : "";
  const rest = path.slice(m ? m[0].length : 0) || "/";
  const name = rest === "/" ? "Homepage" : rest.replace(/^\//, "").replace(/[-/]/g, " ").replace(/^./, (c) => c.toUpperCase());
  return `${name}${lang}`;
}

function ago(ms: number, now: number) {
  const minutes = Math.round((now - ms) / 60_000);
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** "Visitor: …\n\nDaniel (AI): …" → bubbles, without Daniel's card markers. */
function conversation(transcript: string): LeadItem["conversation"] {
  if (!transcript) return [];
  return transcript
    .split(/\n\n(?=(?:Visitor|Daniel \(AI\)|VISITOR|WEBSITE ASSISTANT): )/)
    .map((part) => {
      const daniel = /^(Daniel \(AI\)|WEBSITE ASSISTANT): /.test(part);
      const text = part
        .replace(/^(Visitor|Daniel \(AI\)|VISITOR|WEBSITE ASSISTANT): /, "")
        .replace(/\[\[[^\]]*\]\]/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim();
      return { from: daniel ? ("daniel" as const) : ("visitor" as const), text: text.length > 1200 ? `${text.slice(0, 1200)}…` : text };
    })
    .filter((m) => m.text);
}

function toItem(l: SheetLead, i: number, now: number): LeadItem {
  const at = received(l.submittedAt ?? "");
  const score = (["hot", "warm", "cold"] as const).find((s) => s === l.score) ?? "unrated";
  const wants = [l.destination && destination(l.destination), l.goal && (GOALS[l.goal] ?? l.goal), l.budget && `budget ${l.budget}`, l.familySize && `${l.familySize} ${l.familySize === "1" ? "person" : "people"}`]
    .filter(Boolean)
    .join(" · ");
  const details: [string, string][] = (
    [
      ["Phone / WhatsApp", l.whatsapp],
      ["Email", l.email],
      ["Nationality", l.nationality],
      ["Lives in", l.currentCountry],
      ["Language", l.language && plainLanguage(l.language)],
      ["Job", l.job],
      ["Visiting from", l.visitorCountry && plainRegion(l.visitorCountry)],
      ["Sent from the page", l.page && plainPage(l.page)],
    ] as [string, string | undefined][]
  ).filter((d): d is [string, string] => !!d[1]);
  return {
    id: `${l.submittedAt}-${i}`,
    name: l.name || "No name given",
    score,
    received: Number.isFinite(at) ? friendlyTime(at) : (l.submittedAt ?? ""),
    ago: Number.isFinite(at) ? ago(at, now) : "",
    isToday: Number.isFinite(at) && now - at < 24 * 60 * 60 * 1000,
    isThisWeek: Number.isFinite(at) && now - at < 7 * 24 * 60 * 60 * 1000,
    source: SOURCES[l.type] ?? "contact",
    wants,
    summary: l.summary ?? "",
    whatsapp: (l.whatsapp ?? "").replace(/[^0-9]/g, ""),
    email: l.email ?? "",
    details,
    message: l.message ?? "",
    conversation: conversation(l.transcript ?? ""),
  };
}

/** Reads the Sheet and prepares every lead for display ("3 h ago" needs the clock: request time only). */
async function loadLeads() {
  await connection();
  const result = await recentLeads(50);
  if (!("leads" in result)) return result;
  const now = Date.now();
  return { leads: result.leads.map((l, i) => toItem(l, i, now)) };
}

export async function LeadsView() {
  const result = await loadLeads();
  const intro = (
    <PageIntro eyebrow="Leads" title="People who want to talk to us">
      Everyone who left their details on the website or with Daniel, newest first. Daniel rates each one: reply to the hot ones first.
    </PageIntro>
  );
  if (!("leads" in result)) {
    return (
      <>
        {intro}
        {result.unavailable === "old-script" ? (
          <Notice title="One last step to see leads here">
            Your leads are safe in the Google Sheet. To show them on this page, update the Sheet&apos;s script once: open the Sheet → Extensions → Apps Script,
            paste the new script, save, then Deploy → Manage deployments → Edit → New version.
          </Notice>
        ) : result.unavailable === "no-webhook" ? (
          <Notice title="The leads Sheet isn't connected">The website doesn&apos;t know where your leads Sheet is yet (LEADS_WEBHOOK_URL on the server).</Notice>
        ) : (
          <Notice title="Couldn't open the leads Sheet just now">
            Your leads are still in the Google Sheet. Details for whoever runs the website: {result.detail}
          </Notice>
        )}
      </>
    );
  }
  return (
    <>
      {intro}
      <LeadsList leads={result.leads} />
    </>
  );
}
