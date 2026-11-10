/**
 * EAM Global website leads → Google Sheet + email.
 *
 * Paste this whole file into the Sheet's Extensions → Apps Script editor, then
 * deploy it as a Web app (see "Website leads" in the README). The website posts
 * every form lead and every AI chat lead here (LEADS_WEBHOOK_URL on Vercel).
 *
 * Script properties (Project Settings → Script properties):
 *   SECRET        the same value as LEADS_WEBHOOK_SECRET on Vercel
 *   NOTIFY_EMAIL  who gets an email per lead, comma-separated
 *
 * The website's admin panel (/admin) reads the newest leads back with a GET:
 *   …/exec?action=list&limit=50&secret=SECRET  →  { ok: true, leads: [ … ] }
 * Rows are only ever returned when SECRET is set and matches; without the
 * action the GET stays a plain health check. After changing this file, deploy
 * it again as a New version (Deploy → Manage deployments → Edit → New version).
 */

const SHEET_NAME = "Leads";
const TIME_ZONE = "Asia/Dubai";

const COLUMNS = [
  ["submittedAt", "Received (Dubai)"],
  ["type", "Form"],
  ["name", "Name"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
  ["nationality", "Nationality"],
  ["currentCountry", "Lives in"],
  ["destination", "Destination"],
  ["goal", "Goal"],
  ["budget", "Budget"],
  ["familySize", "Family size"],
  ["language", "Language"],
  ["message", "Message"],
  ["job", "Job"],
  ["guide", "Guide"],
  ["consent", "Newsletter consent"],
  ["page", "Page"],
  ["visitorCountry", "Visitor country"],
  // Added November 2026 (AI lead handling). New columns always go at the end, so
  // older rows keep lining up; leadsSheet() fills in their headings.
  ["score", "AI score"],
  ["summary", "AI summary"],
  ["transcript", "Chat transcript"],
];

const FORM_NAMES = {
  roadmap: "Free roadmap",
  contact: "Contact form",
  guide: "Guide download",
  chat: "AI chat (Daniel)",
};

function doPost(e) {
  try {
    const lead = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty("SECRET") || "";
    if (secret && lead.secret !== secret) return reply({ ok: false, error: "unauthorised" });

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = leadsSheet();
      const when = lead.submittedAt ? new Date(lead.submittedAt) : new Date();
      sheet.appendRow(
        COLUMNS.map(([key]) => (key === "submittedAt" ? Utilities.formatDate(when, TIME_ZONE, "yyyy-MM-dd HH:mm") : safe(lead[key]))),
      );
    } finally {
      lock.releaseLock();
    }

    const to = props.getProperty("NOTIFY_EMAIL");
    if (to) {
      try {
        notify(to, lead);
      } catch (err) {
        // The lead is already in the Sheet; a mail quota error must not fail the form.
        console.error("email failed", err);
      }
    }
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String(err) });
  }
}

/**
 * Open the web app URL in a browser to check the deployment works. With
 * ?action=list&secret=… (the admin panel, server to server) it returns the
 * newest leads, newest first, at most 50.
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action !== "list") return reply({ ok: true, service: "EAM Global leads" });

  // Reading needs a real secret: an empty SECRET never opens the Sheet to the web.
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET") || "";
  if (!secret || params.secret !== secret) return reply({ ok: false, error: "unauthorised" });

  const limit = Math.max(1, Math.min(50, Number(params.limit) || 50));
  const sheet = leadsSheet();
  const last = sheet.getLastRow();
  if (last < 2) return reply({ ok: true, leads: [] });
  const count = Math.min(limit, last - 1);
  const rows = sheet.getRange(last - count + 1, 1, count, COLUMNS.length).getValues();
  const leads = rows.reverse().map((row) => {
    const lead = {};
    COLUMNS.forEach(([key], i) => {
      const value = row[i];
      // The Sheet turns "2026-11-11 09:30" into a date; send it back in the same form.
      lead[key] = value instanceof Date ? Utilities.formatDate(value, TIME_ZONE, "yyyy-MM-dd HH:mm") : value == null ? "" : String(value);
    });
    return lead;
  });
  return reply({ ok: true, leads: leads });
}

function leadsSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([, label]) => label));
    sheet.setFrozenRows(1);
  }
  // A Sheet made with an older version of this script lacks the newer headings.
  const header = sheet.getRange(1, 1, 1, COLUMNS.length);
  const labels = header.getValues()[0];
  if (COLUMNS.some(([, label], i) => labels[i] !== label)) {
    header.setValues([COLUMNS.map(([, label]) => label)]).setFontWeight("bold");
  }
  return sheet;
}

function notify(to, lead) {
  const form = FORM_NAMES[lead.type] || lead.type;
  const digits = String(lead.whatsapp || "").replace(/[^0-9]/g, "");
  const score = lead.score ? lead.score.toUpperCase() + " · " : "";
  // The summary and transcript get their own paragraphs below the fields.
  const lines = COLUMNS.filter(([key]) => !["submittedAt", "score", "summary", "transcript"].includes(key) && lead[key]).map(([key, label]) => label + ": " + lead[key]);
  const body = [
    "New " + form + " lead from the website.",
    "",
    lead.summary ? "AI summary (" + (lead.score || "unscored") + "): " + lead.summary : null,
    lead.summary ? "" : null,
    ...lines,
    lead.transcript ? "\nChat transcript:\n" + lead.transcript : "",
    "",
    digits ? "Reply on WhatsApp: https://wa.me/" + digits : "",
    "All leads: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ]
    .filter((line) => line !== null)
    .join("\n");
  MailApp.sendEmail({
    to: to,
    subject: "[Website lead] " + score + form + ": " + (lead.name || "no name") + (lead.destination ? " · " + lead.destination : ""),
    body: body,
    replyTo: lead.email || undefined,
  });
}

/** Stops a submitted value from being read as a Sheet formula. */
function safe(value) {
  const s = value == null ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
