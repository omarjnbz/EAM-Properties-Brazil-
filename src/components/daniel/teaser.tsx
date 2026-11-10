"use client";

import { ListChecks } from "@phosphor-icons/react/dist/csr/ListChecks";
import { X } from "@phosphor-icons/react/dist/csr/X";
import type { Dictionary } from "@/content/i18n";
import { danielTopic } from "@/content/daniel";
import { AiChip } from "./daniel-mark";

type Copy = Dictionary["chat"];

const CHIP =
  "daniel-chip touch-manipulation select-none rounded-full bg-paper px-3 py-1.5 text-[13px] text-ink-2 ring-1 ring-line transition-[background-color,color,scale] duration-150 ease-expo hover:bg-navy hover:text-white hover:ring-navy active:scale-[0.97]";

/**
 * Daniel's greeting: a speech bubble that grows out of the launcher (its
 * corner points at it), shows him typing, then asks the page's question with
 * quick replies. Once per session; a returning visitor is offered their last
 * conversation instead. Fixed copy, so it costs no AI call; only a tap does.
 */
export default function DanielTeaser({
  copy,
  path,
  returning,
  onAsk,
  onPlan,
  onContinue,
  onDismiss,
}: {
  copy: Copy;
  path: string;
  returning: string | null;
  onAsk: (question: string) => void;
  onPlan: () => void;
  onContinue: () => void;
  onDismiss: () => void;
}) {
  const topic = path === "/" ? copy.pages.home : path === "/contact" ? copy.pages.contact : (danielTopic(path) ?? copy.pages.fallback);
  const said = (text: string) => (
    <span className="daniel-said block" style={{ "--t": "900ms" } as React.CSSProperties}>
      <span className="daniel-typing" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      <span className="daniel-said-text block">{text}</span>
    </span>
  );

  return (
    <aside
      aria-label={copy.teaser.label}
      className="daniel-ui daniel-bubble fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+62px)] end-4 z-30 w-[min(310px,calc(100vw-2rem))] md:bottom-[86px] md:end-6"
    >
      <div className="daniel-seq rounded-[22px] rounded-ee-[6px] bg-surface p-4 text-ink shadow-[0_24px_60px_-18px_rgba(11,27,47,0.5)] ring-1 ring-ink/[0.08]" data-play="">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-semibold tracking-[-0.01em]">{copy.name}</p>
          <AiChip label={copy.ai} />
          <button
            type="button"
            onClick={onDismiss}
            className="-me-1.5 -mt-1 ms-auto grid size-8 touch-manipulation place-items-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <X className="size-3.5" aria-hidden />
            <span className="sr-only">{copy.teaser.dismiss}</span>
          </button>
        </div>

        {returning ? (
          <>
            <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{said(copy.teaser.backTitle)}</p>
            <p className="daniel-chip mt-1 text-[13.5px] leading-snug text-ink-3" style={{ "--i": 0 } as React.CSSProperties}>
              {/* The question may be in another script than the page: isolate it so the quote marks stay put. */}
              {copy.teaser.backBody.split("{topic}").map((part, i) => (
                <span key={i}>
                  {i > 0 && <bdi className="text-ink-2">{returning}</bdi>}
                  {part}
                </span>
              ))}
            </p>
            <button
              type="button"
              onClick={onContinue}
              style={{ "--i": 1, "--t": "900ms" } as React.CSSProperties}
              className="daniel-chip mt-3 w-full touch-manipulation rounded-full bg-navy px-4 py-2.5 text-[13.5px] font-medium text-white transition-[background-color,scale] duration-150 ease-expo hover:bg-navy-deep active:scale-[0.97]"
            >
              {copy.teaser.continue}
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-[15.5px] font-medium leading-snug text-ink">{said(topic.question)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5" style={{ "--t": "900ms" } as React.CSSProperties}>
              {topic.chips.slice(0, 4).map((c, i) => (
                <button key={c.label} type="button" onClick={() => onAsk(c.q)} style={{ "--i": i } as React.CSSProperties} className={CHIP}>
                  {c.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onPlan}
              style={{ "--i": topic.chips.length, "--t": "900ms" } as React.CSSProperties}
              className="daniel-chip mt-3 inline-flex touch-manipulation items-center gap-1.5 text-[13px] font-medium text-navy hover:underline"
            >
              <ListChecks weight="bold" className="size-4" aria-hidden />
              {copy.planChip}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
