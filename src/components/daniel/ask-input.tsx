"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { ListChecks } from "@phosphor-icons/react/dist/csr/ListChecks";
import { cn } from "@/lib/cn";
import { fill, openDaniel } from "./bus";

/**
 * A search-style box that hands the question to Daniel. With `examples`, the
 * empty box types sample questions to itself (fast networks without
 * reduced-motion only; otherwise it shows the first one, still).
 */
export function AskInput({
  label,
  placeholder,
  examples,
  submit,
  template,
  chips,
  plan,
  size = "lg",
}: {
  label: string;
  placeholder?: string;
  examples?: readonly string[];
  submit: string;
  /** Wraps what the visitor typed, e.g. "I was looking for: {text}". */
  template?: string;
  chips?: readonly { label: string; q: string }[];
  plan?: string;
  size?: "lg" | "md";
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const currentExample = useTypewriter(examples, !value && !focused, formRef, typedRef);
  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    openDaniel({ message: template ? fill(template, { text: q }) : q });
    setValue("");
  };

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value || (examples && !focused ? currentExample() : ""));
        }}
        ref={formRef}
        className={cn(
          "relative flex items-center gap-2 rounded-full bg-white ps-5 pe-1.5 shadow-[0_1px_2px_rgba(11,27,47,0.06),0_14px_34px_-20px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.08] transition-shadow focus-within:ring-navy/35",
          size === "lg" ? "h-14" : "h-12",
        )}
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={300}
          dir="auto"
          autoComplete="off"
          placeholder={examples ? "" : placeholder}
          className={cn("peer min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3", size === "lg" ? "text-[16.5px]" : "text-[16px] md:text-[15px]")}
        />
        {examples && !value && (
          <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 start-5 end-28 flex items-center overflow-hidden whitespace-nowrap text-ink-3", size === "lg" ? "text-[16.5px]" : "text-[15px]")}>
            {focused ? (
              placeholder
            ) : (
              <>
                <span ref={typedRef} className="truncate">
                  {examples[0]}
                </span>
                <span className="daniel-caret" />
              </>
            )}
          </span>
        )}
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy font-medium text-white transition-colors hover:bg-navy-deep",
            size === "lg" ? "h-11 px-5 text-[14.5px]" : "h-9 px-4 text-[14px]",
          )}
        >
          {submit}
          <ArrowUp weight="bold" className="size-3.5" aria-hidden />
        </button>
      </form>
      {(chips?.length || plan) && (
        <div className="flex flex-wrap items-center gap-2">
          {chips?.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => openDaniel({ message: c.q })}
              className="rounded-full bg-white px-3.5 py-1.5 text-[13.5px] text-ink-2 ring-1 ring-ink/[0.08] transition-colors hover:bg-navy hover:text-white hover:ring-navy"
            >
              {c.label}
            </button>
          ))}
          {plan && (
            <button type="button" onClick={() => openDaniel({ plan: true })} className="inline-flex items-center gap-1.5 px-1 text-[13.5px] font-medium text-navy hover:underline">
              <ListChecks weight="bold" className="size-4" aria-hidden />
              {plan}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Types each example out, pauses, erases it, moves on. It writes straight into
 * the DOM (no React state, so no re-render per letter) and only runs while the
 * box is on screen and idle. Static first example when motion is off.
 */
function useTypewriter(
  examples: readonly string[] | undefined,
  running: boolean,
  box: React.RefObject<HTMLElement | null>,
  ref: React.RefObject<HTMLSpanElement | null>,
) {
  const index = useRef(0);

  useEffect(() => {
    const el = ref.current;
    const target = box.current;
    if (!examples?.length || !running || !el || !target) return;
    if (!document.documentElement.classList.contains("motion")) return;
    // The span always (re)starts showing the first example in full.
    index.current = 0;
    let timer = 0;
    let visible = false;
    let n = examples[0].length;
    let erasing = false;
    const tick = () => {
      if (!visible) return;
      const full = examples[index.current];
      if (!erasing && n < full.length) n += 1;
      else if (!erasing) {
        erasing = true;
        timer = window.setTimeout(tick, 1900);
        return;
      } else if (n > 0) n -= 1;
      else {
        erasing = false;
        index.current = (index.current + 1) % examples.length;
      }
      el.textContent = examples[index.current].slice(0, n);
      timer = window.setTimeout(tick, erasing ? 22 : 48);
    };
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      target.toggleAttribute("data-typing", visible);
      if (visible && !was) timer = window.setTimeout(tick, 600);
      if (!visible) window.clearTimeout(timer);
    });
    io.observe(target);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      target.removeAttribute("data-typing");
    };
  }, [examples, running, box, ref]);

  /** The example on screen now, sent when the visitor taps Ask on an empty box. */
  return () => examples?.[index.current] ?? "";
}
