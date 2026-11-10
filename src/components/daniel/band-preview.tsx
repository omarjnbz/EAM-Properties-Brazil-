"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/i18n";
import { openDaniel } from "./bus";
import { AskInput } from "./ask-input";
import { AiChip, DanielMark, type DanielState } from "./daniel-mark";

type Copy = Dictionary["chat"];

/**
 * The homepage's live preview of a chat with Daniel. When it scrolls into view
 * it plays once: he types his hello, then his question, then the quick replies
 * land; the reply box at the bottom hands whatever the visitor writes to the
 * real chat. Purpose: show how Daniel works before anyone opens him.
 * Without motion (slow networks, reduced motion) it is simply all there.
 */
export function BandPreview({ copy }: { copy: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  // His mark thinks while the first dots show, speaks while the words land, then rests.
  const [state, setState] = useState<DanielState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlay(true);
        io.disconnect();
        if (!document.documentElement.classList.contains("motion")) return;
        setState("thinking");
        timers.push(window.setTimeout(() => setState("speaking"), 700));
        timers.push(window.setTimeout(() => setState("idle"), 2000));
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const b = copy.band;
  const chips = copy.pages.home.chips;
  return (
    <div
      ref={ref}
      data-play={play ? "" : undefined}
      className="daniel-seq overflow-hidden rounded-[24px] bg-canvas ring-1 ring-ink/[0.06]"
    >
      <div className="flex items-center gap-3 border-b border-line bg-white/70 px-4 py-3">
        <DanielMark size={36} state={state} live />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[14.5px] font-semibold tracking-[-0.01em] text-ink">
            {copy.name}
            <AiChip label={copy.ai} />
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-ink-3">
            <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
            {b.online}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pt-4 pb-3 text-[14.5px] leading-relaxed">
        <Said t={700}>{b.hello}</Said>
        <Said t={1500}>{copy.pages.home.question}</Said>
        <div className="flex flex-wrap justify-end gap-2 pt-1" style={{ "--t": "1500ms" } as React.CSSProperties}>
          {chips.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => openDaniel({ message: c.q })}
              style={{ "--i": i } as React.CSSProperties}
              className="daniel-chip touch-manipulation select-none rounded-full bg-white px-3.5 py-1.5 text-[13.5px] text-navy-deep ring-1 ring-navy/20 transition-[background-color,color,scale] duration-150 ease-expo hover:bg-navy hover:text-white active:scale-[0.97]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="daniel-chip border-t border-line bg-white/70 p-3" style={{ "--i": chips.length + 1, "--t": "1500ms" } as React.CSSProperties}>
        <AskInput label={copy.inputLabel} placeholder={copy.placeholder} examples={b.examples} submit={b.submit} plan={b.plan} size="md" />
      </div>
    </div>
  );
}

/** One of Daniel's bubbles in the preview: typing dots until `t`, then the words. */
function Said({ t, children }: { t: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div
        dir="auto"
        style={{ "--t": `${t}ms`, "--dots-x": "1rem" } as React.CSSProperties}
        className="daniel-said max-w-[88%] rounded-2xl rounded-ss-md bg-white px-4 py-2.5 text-ink-2 shadow-[0_1px_2px_rgba(11,27,47,0.05)]"
      >
        <span className="daniel-typing" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="daniel-said-text block">{children}</span>
      </div>
    </div>
  );
}
