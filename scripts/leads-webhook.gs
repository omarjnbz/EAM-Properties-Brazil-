/**
 * EAM Global website leads → Google Sheet + email.
 *
 * Paste this whole file into the Sheet's Extensions → Apps Script editor, then
 * deploy it as a Web app (see "Website leads" in the README). The website posts
 * every roadmap, contact and guide form here (LEADS_WEBHOOK_URL on Vercel).
 *
 * Script properties (Project Settings → Script properties):
 *   SECRET        the same value as LEADS_WEBHOOK_SECRET on Vercel
 *   NOTIFY_EMAIL  who gets an email per lead, comma-separated
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
];

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

/** Open the web app URL in a browser to check the deployment works. */
function doGet() {
  return reply({ ok: true, service: "EAM Global leads" });
}

function leadsSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([, label]) => label));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

function notify(to, lead) {
  const form = { roadmap: "Free roadmap", contact: "Contact form", guide: "Guide download" }[lead.type] || lead.type;
  const digits = String(lead.whatsapp || "").replace(/[^0-9]/g, "");
  const lines = COLUMNS.filter(([key]) => key !== "submittedAt" && lead[key]).map(([key, label]) => label + ": " + lead[key]);
  const body = [
    "New " + form + " lead from the website.",
    "",
    ...lines,
    "",
    digits ? "Reply on WhatsApp: https://wa.me/" + digits : "",
    "All leads: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ].join("\n");
  MailApp.sendEmail({
    to: to,
    subject: "[Website lead] " + form + ": " + (lead.name || "no name") + (lead.destination ? " · " + lead.destination : ""),
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
