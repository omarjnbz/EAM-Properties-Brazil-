/**
 * Opens Daniel from anywhere on the page (program rows, FAQ answers, the
 * homepage box, the 404 page, selected text). The launcher in the root layout
 * listens for this event; a request made before it has hydrated waits in a
 * small queue so the first tap is never lost.
 */
export type DanielRequest = {
  /** Sent as the visitor's message as soon as the chat opens. */
  message?: string;
  /** Starts the five-tap "Plan my move" qualifier instead. */
  plan?: boolean;
};

export const DANIEL_EVENT = "daniel:open";

type Queue = { __danielQueue?: DanielRequest[]; __danielReady?: boolean };

export function openDaniel(request: DanielRequest = {}) {
  const w = window as Window & Queue;
  if (!w.__danielReady) {
    (w.__danielQueue ??= []).push(request);
    return;
  }
  window.dispatchEvent(new CustomEvent<DanielRequest>(DANIEL_EVENT, { detail: request }));
}

/** Called once by the launcher: marks it ready and returns anything requested before then. */
export function takeDanielQueue(): DanielRequest[] {
  const w = window as Window & Queue;
  w.__danielReady = true;
  const queued = w.__danielQueue ?? [];
  w.__danielQueue = [];
  return queued;
}

/** Fills "{name}" slots in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
