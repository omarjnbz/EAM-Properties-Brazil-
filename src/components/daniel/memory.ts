/**
 * What Daniel remembers between visits. It lives only in the visitor's own
 * browser (localStorage), never on our servers, and expires after 30 days.
 * Every access is wrapped: private windows and blocked storage simply mean
 * Daniel starts fresh.
 */
export type PlanKey = "goal" | "destination" | "budget" | "family" | "timeline";
export type PlanAnswers = Partial<Record<PlanKey, string>>;

export type ChatMessage =
  | { id: string; role: "user"; content: string; local?: boolean }
  | { id: string; role: "assistant"; content: string; local?: boolean; error?: boolean; lead?: "sent" | "failed" }
  | { id: string; role: "notes" };

export type Notes = {
  answers: PlanAnswers;
  name: string;
  whatsapp: string;
  status: "idle" | "sending" | "sent" | "error";
  error?: string;
};

type Stored = { v: 1; at: number; messages: ChatMessage[]; notes: Notes | null };

const KEY = "eam:daniel:v1";
const TEASER_KEY = "eam:daniel:teaser";
const TTL = 30 * 24 * 60 * 60 * 1000;
const MAX_MESSAGES = 40;

export function loadChat(): Pick<Stored, "messages" | "notes"> | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Stored;
    if (data?.v !== 1 || !Array.isArray(data.messages) || Date.now() - data.at > TTL) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    // A send that was cut off by closing the tab is not worth restoring.
    const notes = data.notes && data.notes.status === "sending" ? { ...data.notes, status: "idle" as const } : data.notes;
    return { messages: data.messages.filter((m) => m.role === "notes" || m.content), notes };
  } catch {
    return null;
  }
}

export function saveChat(messages: ChatMessage[], notes: Notes | null) {
  try {
    const kept = messages.filter((m) => m.role === "notes" || (m.content && !("error" in m && m.error))).slice(-MAX_MESSAGES);
    if (kept.length === 0 && !notes) {
      window.localStorage.removeItem(KEY);
      return;
    }
    const data: Stored = { v: 1, at: Date.now(), messages: kept, notes };
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked: Daniel just won't remember this one.
  }
}

export function clearChat() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}

/** The visitor's last question from an earlier visit, for the "welcome back" greeting. */
export function lastQuestion(): string | null {
  const chat = loadChat();
  const last = chat?.messages.findLast((m) => m.role === "user" && !m.local);
  if (!last || last.role !== "user") return null;
  const text = last.content.replace(/\s+/g, " ").trim();
  return text.length > 70 ? `${text.slice(0, 67)}…` : text;
}

/** The after-hero greeting shows once per browser session. */
export function teaserSeen() {
  try {
    return window.sessionStorage.getItem(TEASER_KEY) === "1";
  } catch {
    return false;
  }
}

export function markTeaserSeen() {
  try {
    window.sessionStorage.setItem(TEASER_KEY, "1");
  } catch {}
}

export const newId = () => Math.random().toString(36).slice(2, 10);
