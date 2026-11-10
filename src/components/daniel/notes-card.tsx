"use client";

import { useId, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { NotePencil } from "@phosphor-icons/react/dist/csr/NotePencil";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import type { Dictionary } from "@/content/i18n";
import { cn } from "@/lib/cn";
import { DanielMark } from "./daniel-mark";
import type { Notes, PlanKey } from "./memory";
import { fill } from "./bus";
import { HandoffCard, whatsappWith } from "./cards";

type Copy = Dictionary["chat"];

const ORDER: PlanKey[] = ["goal", "destination", "budget", "family", "timeline"];

/** The localized label for one answer. */
export function answerLabel(copy: Copy, step: PlanKey, value: string | undefined) {
  const s = copy.plan.steps.find((x) => x.key === step);
  return s?.options.find((o) => o.key === value)?.label ?? "";
}

/** "Live abroad · Brazil · USD 250,000 – 500,000 · 3 to 4 people · Within 3 months" */
export function answersLine(copy: Copy, answers: Notes["answers"]) {
  return ORDER.map((k) => answerLabel(copy, k, answers[k]))
    .filter(Boolean)
    .join(" · ");
}

/**
 * "Daniel's notes": what the qualifier learned, editable, with one button that
 * sends it to the team (/api/enquiry, type "chat"). After sending it turns into
 * the hand-off card, so the visitor always knows what happens next.
 */
export function NotesCard({
  copy,
  notes,
  onChange,
  onSend,
  onNavigate,
}: {
  copy: Copy;
  notes: Notes;
  onChange: (notes: Notes) => void;
  onSend: () => void;
  onNavigate: () => void;
}) {
  const n = copy.notes;
  const id = useId();
  const [editing, setEditing] = useState<PlanKey | null>(null);
  const sent = notes.status === "sent";

  if (sent) {
    return (
      <div className="flex flex-col gap-2">
        <p role="status" className="daniel-rise inline-flex items-start gap-2 rounded-2xl bg-leaf-soft px-4 py-3 text-[13.5px] text-leaf-deep">
          <CheckCircle weight="fill" className="mt-0.5 size-4 shrink-0" aria-hidden />
          {n.sent}
        </p>
        <HandoffCard copy={copy} onNavigate={onNavigate} passing whatsappText={fill(n.whatsappText, { answers: answersLine(copy, notes.answers) })} />
      </div>
    );
  }

  return (
    <form
      className="daniel-rise rounded-2xl bg-surface p-4 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_10px_24px_-16px_rgba(11,27,47,0.3)] ring-1 ring-navy/15"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <div className="flex items-center gap-2">
        <DanielMark size={22} />
        <h4 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{n.title}</h4>
        <NotePencil className="ms-auto size-4 text-ink-3" aria-hidden />
      </div>
      <dl className="mt-3 flex flex-col">
        {ORDER.map((k) => {
          const step = copy.plan.steps.find((s) => s.key === k);
          if (!step) return null;
          return (
            <div key={k} className="border-t border-line py-2 first:border-t-0">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[12px] text-ink-3">{n.labels[k]}</dt>
                <dd className="flex items-center gap-2 text-end text-[13px] font-medium text-ink">
                  <span>{answerLabel(copy, k, notes.answers[k]) || "—"}</span>
                  <button
                    type="button"
                    onClick={() => setEditing((e) => (e === k ? null : k))}
                    aria-expanded={editing === k}
                    className="rounded-full px-2 py-0.5 text-[11.5px] font-medium text-navy hover:bg-navy/5"
                  >
                    {n.change}
                    <span className="sr-only">: {n.labels[k]}</span>
                  </button>
                </dd>
              </div>
              {editing === k && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {step.options.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => {
                        onChange({ ...notes, answers: { ...notes.answers, [k]: o.key } });
                        setEditing(null);
                      }}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[12px] ring-1 transition-colors",
                        notes.answers[k] === o.key ? "bg-navy text-white ring-navy" : "bg-surface text-ink-2 ring-line hover:bg-paper",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </dl>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label htmlFor={`${id}-name`} className="flex flex-col gap-1 text-[11.5px] text-ink-3">
          {n.name}
          <input
            id={`${id}-name`}
            value={notes.name}
            onChange={(e) => onChange({ ...notes, name: e.target.value })}
            required
            autoComplete="name"
            className="h-10 rounded-xl bg-paper px-3 text-[16px] text-ink outline-none ring-1 ring-transparent focus:ring-navy/30 md:text-[14px]"
          />
        </label>
        <label htmlFor={`${id}-wa`} className="flex flex-col gap-1 text-[11.5px] text-ink-3">
          <span>
            {n.whatsapp} <span className="text-ink-3/80">({n.whatsappHint})</span>
          </span>
          <input
            id={`${id}-wa`}
            value={notes.whatsapp}
            onChange={(e) => onChange({ ...notes, whatsapp: e.target.value })}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            pattern="\+?[0-9 \(\)\-]{8,}"
            dir="ltr"
            placeholder="+971 5x xxx xxxx"
            className="h-10 rounded-xl bg-paper px-3 text-[16px] text-ink outline-none ring-1 ring-transparent placeholder:text-ink-3/60 focus:ring-navy/30 md:text-[14px]"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={notes.status === "sending"}
        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-leaf text-[14px] font-medium text-white transition-colors hover:bg-leaf-deep disabled:opacity-60"
      >
        {notes.status === "sending" ? n.sending : n.send}
      </button>
      <p className="mt-2 text-center text-[11px] text-ink-3">{n.privacy}</p>
      {notes.status === "error" && (
        <div role="alert" className="mt-2 flex flex-col gap-2 rounded-xl bg-sun-soft px-3 py-2.5 text-[12.5px] text-ink">
          <p>{notes.error || n.error}</p>
          {/* Nothing is lost if delivery fails: the same notes go straight to WhatsApp. */}
          <a
            href={whatsappWith(fill(n.whatsappText, { answers: answersLine(copy, notes.answers) }))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-leaf px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-leaf-deep"
          >
            <WhatsappLogo weight="fill" className="size-3.5" aria-hidden />
            {copy.handoff.whatsapp}
          </a>
        </div>
      )}
    </form>
  );
}
