"use client";

import { useEffect, useState } from "react";
import { fill } from "./bus";
import { DanielMark } from "./daniel-mark";

const MIN = 2;
const MAX = 160;

/**
 * Highlight any words on the page ("Schengen", "attestation", a fee) and a
 * small "Ask Daniel" bubble appears over them. On touch screens it sits below
 * the selection so it doesn't fight the phone's own copy menu.
 * Ignores the chat itself, form fields and anything marked data-no-daniel.
 */
export function SelectionAsk({ label, template, onAsk }: { label: string; template: string; onAsk: (question: string) => void }) {
  const [spot, setSpot] = useState<{ x: number; y: number; below: boolean; text: string } | null>(null);

  useEffect(() => {
    let timer = 0;
    const read = () => {
      const sel = window.getSelection();
      const text = sel?.toString().replace(/\s+/g, " ").trim() ?? "";
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || text.length < MIN || text.length > MAX) {
        setSpot(null);
        return;
      }
      const node = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
      if (!node?.closest("#main") || node.closest("input, textarea, select, [contenteditable], [data-no-daniel]")) {
        setSpot(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return setSpot(null);
      const touch = window.matchMedia("(pointer: coarse)").matches;
      const below = touch || rect.top < 70;
      const x = Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80);
      setSpot({ x, y: below ? rect.bottom + 10 : rect.top - 10, below, text });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 180);
    };
    const hide = () => setSpot(null);
    document.addEventListener("selectionchange", schedule);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("selectionchange", schedule);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, []);

  if (!spot) return null;
  return (
    <button
      type="button"
      // Keep the selection while the button is pressed.
      onPointerDown={(e) => e.preventDefault()}
      onClick={() => {
        onAsk(fill(template, { text: spot.text.length > 80 ? `${spot.text.slice(0, 77)}…` : spot.text }));
        window.getSelection()?.removeAllRanges();
        setSpot(null);
      }}
      style={{ left: spot.x, top: spot.y }}
      className={`daniel-ui daniel-rise fixed z-[60] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink py-1 ps-1 pe-3 text-[12.5px] font-medium text-white shadow-[0_12px_30px_-10px_rgba(11,27,47,0.6)] ring-1 ring-white/10 ${spot.below ? "" : "-translate-y-full"}`}
    >
      <DanielMark size={22} />
      {label}
    </button>
  );
}
