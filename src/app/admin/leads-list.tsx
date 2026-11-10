"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { ChatCircleDots } from "@phosphor-icons/react/dist/csr/ChatCircleDots";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { FileArrowDown } from "@phosphor-icons/react/dist/csr/FileArrowDown";
import { MapTrifold } from "@phosphor-icons/react/dist/csr/MapTrifold";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { cn } from "@/lib/cn";

export type LeadItem = {
  id: string;
  name: string;
  score: "hot" | "warm" | "cold" | "unrated";
  received: string;
  ago: string;
  isToday: boolean;
  isThisWeek: boolean;
  source: "chat" | "roadmap" | "contact" | "guide";
  wants: string;
  summary: string;
  whatsapp: string;
  email: string;
  details: [string, string][];
  message: string;
  conversation: { from: "visitor" | "daniel"; text: string }[];
};

/** What each rating means, in the words the team would use. */
const SCORES = {
  hot: { label: "Hot", meaning: "Ready to start. Reply first.", tone: "bg-[#fbe3d6] text-[#8d3b1c]", dot: "bg-[#d4581f]" },
  warm: { label: "Warm", meaning: "Interested, still has questions.", tone: "bg-sun-soft text-[#7a5a0c]", dot: "bg-sun" },
  cold: { label: "Cold", meaning: "Just looking for now.", tone: "bg-paper-2 text-ink-3", dot: "bg-ink-3" },
  unrated: { label: "Not rated", meaning: "No rating yet.", tone: "bg-paper-2 text-ink-3", dot: "bg-ink/20" },
} as const;

const SOURCES = {
  chat: { label: "Chat with Daniel", Icon: ChatCircleDots },
  roadmap: { label: "Free roadmap form", Icon: MapTrifold },
  contact: { label: "Contact form", Icon: EnvelopeSimple },
  guide: { label: "Guide download", Icon: FileArrowDown },
} as const;

type Filter = "all" | "hot" | "warm" | "cold";

export function LeadsList({ leads }: { leads: LeadItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const count = (s: LeadItem["score"]) => leads.filter((l) => l.score === s).length;
  const shown = filter === "all" ? leads : leads.filter((l) => l.score === filter);
  const today = leads.filter((l) => l.isToday).length;
  const week = leads.filter((l) => l.isThisWeek).length;

  return (
    <>
      {/* The day at a glance; each rating is also a filter. */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-12">
        <div className="admin-rise col-span-3 rounded-[28px] bg-ink/[0.025] p-1.5 ring-1 ring-ink/[0.04] lg:col-span-3" style={{ "--d": 60 } as React.CSSProperties}>
          {/* Phones: one row (number, then the sentence). Desktop: the same order as the rating tiles beside it. */}
          <div className="flex h-full flex-col justify-between gap-6 rounded-[22px] bg-ink p-5 text-white shadow-[0_22px_50px_-30px_rgba(11,27,47,0.6)] sm:p-6">
            <p className="hidden text-[13.5px] text-white/60 lg:block">New leads</p>
            <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-2">
              <p className="text-[2.8rem] font-medium leading-none tracking-[-0.04em] tabular-nums lg:text-[2.4rem]">{today}</p>
              <p className="text-[14px] leading-snug text-white/70 lg:text-[13.5px]">
                <span className="lg:hidden">New leads </span>in the last 24 hours
                <span className="block text-white/50">{week} this week</span>
              </p>
            </div>
          </div>
        </div>
        {(["hot", "warm", "cold"] as const).map((s, i) => {
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(active ? "all" : s)}
              aria-pressed={active}
              style={{ "--d": 120 + i * 60 } as React.CSSProperties}
              className={cn(
                "admin-rise group rounded-[24px] p-1 text-start ring-1 transition-[background-color,scale] duration-300 ease-expo active:scale-[0.98] sm:rounded-[28px] sm:p-1.5 lg:col-span-3",
                active ? "bg-navy/10 ring-navy/25" : "bg-ink/[0.025] ring-ink/[0.04] hover:bg-ink/[0.05]",
              )}
            >
              <span className="flex h-full flex-col justify-between gap-4 rounded-[20px] bg-white p-3.5 shadow-[0_1px_2px_rgba(11,27,47,0.04),0_22px_50px_-34px_rgba(11,27,47,0.28)] sm:gap-6 sm:rounded-[22px] sm:p-5">
                <span className="flex items-center justify-between gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold", SCORES[s].tone)}>
                    <span className={cn("size-1.5 rounded-full", SCORES[s].dot)} aria-hidden />
                    {SCORES[s].label}
                  </span>
                  <span className="hidden text-[12px] text-ink-3 sm:inline">{active ? "Showing only these" : "Tap to filter"}</span>
                </span>
                <span>
                  <span className="block text-[2rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums sm:text-[2.4rem]">{count(s)}</span>
                  <span className="mt-2 block text-[12.5px] leading-snug text-ink-3 sm:text-[13.5px]">{SCORES[s].meaning}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {filter !== "all" && (
          <button type="button" onClick={() => setFilter("all")} className="self-start rounded-full bg-white px-4 py-2 text-[13.5px] font-medium text-ink ring-1 ring-ink/10 hover:ring-ink/25">
            Show all {leads.length} leads
          </button>
        )}
        {shown.map((l, i) => (
          <LeadCard key={l.id} lead={l} delay={Math.min(i, 8) * 50 + 200} />
        ))}
        {shown.length === 0 && (
          <p className="rounded-[22px] bg-white px-5 py-6 text-[14.5px] text-ink-3 ring-1 ring-ink/[0.05]">
            {leads.length === 0 ? "No leads yet. They appear here as soon as someone fills in a form or gives Daniel their number." : "No leads with this rating."}
          </p>
        )}
      </div>
    </>
  );
}

function LeadCard({ lead: l, delay }: { lead: LeadItem; delay: number }) {
  const [open, setOpen] = useState(false);
  const score = SCORES[l.score];
  const { Icon, label } = SOURCES[l.source];
  const initials = (l.name === "No name given" ? "" : l.name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const hasMore = l.details.length > 0 || l.message || l.conversation.length > 0;

  return (
    <article className="admin-rise rounded-[28px] bg-ink/[0.025] p-1.5 ring-1 ring-ink/[0.04]" style={{ "--d": delay } as React.CSSProperties}>
      <div className="rounded-[22px] bg-white p-4 shadow-[0_1px_2px_rgba(11,27,47,0.04),0_22px_50px_-34px_rgba(11,27,47,0.28)] sm:p-5">
        <div className="flex gap-3.5 sm:gap-4">
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-[14px] font-semibold", score.tone)} aria-hidden>
            {initials || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="text-[16.5px] font-medium tracking-[-0.015em] text-ink">{l.name}</h3>
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold", score.tone)}>
                <span className={cn("size-1.5 rounded-full", score.dot)} aria-hidden />
                {score.label}
              </span>
              <span className="ms-auto text-[12.5px] text-ink-3" title={`${l.received} (Dubai time)`}>
                {l.ago}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink-3">
              <Icon weight="light" className="size-4" aria-hidden />
              {label}
              <span aria-hidden>·</span>
              <span>{l.received} (Dubai)</span>
            </p>
            {l.wants && (
              <p className="mt-3 text-[14.5px] text-ink-2">
                <span className="text-ink-3">Wants: </span>
                {l.wants}
              </p>
            )}
            {l.summary && (
              <p className="mt-3 flex gap-2 rounded-2xl bg-paper px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-2">
                <Sparkle weight="light" className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
                <span>
                  <span className="font-medium text-ink">Daniel&apos;s summary: </span>
                  {l.summary}
                </span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {l.whatsapp && (
                <a
                  href={`https://wa.me/${l.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 items-center gap-2 rounded-full bg-leaf ps-4 pe-1 text-[14px] font-medium text-white transition-[background-color,scale] duration-200 ease-expo hover:bg-leaf-deep active:scale-[0.97]"
                >
                  <WhatsappLogo weight="fill" className="size-4" aria-hidden />
                  Reply on WhatsApp
                  <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 ease-expo group-hover:-translate-y-px group-hover:translate-x-px">
                    <ArrowUpRight weight="light" className="size-3.5" aria-hidden />
                  </span>
                </a>
              )}
              {l.email && (
                <a
                  href={`mailto:${l.email}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink ring-1 ring-ink/10 transition-[box-shadow,scale] duration-200 ease-expo hover:ring-ink/25 active:scale-[0.97]"
                >
                  <EnvelopeSimple weight="light" className="size-4" aria-hidden />
                  Email
                </a>
              )}
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-navy transition-colors hover:bg-navy/5"
                >
                  {open ? "Hide details" : l.conversation.length ? "See the conversation" : "See details"}
                  <CaretDown weight="light" className={cn("size-4 transition-transform duration-300 ease-expo", open && "rotate-180")} aria-hidden />
                </button>
              )}
            </div>

            {open && (
              <div className="admin-rise mt-4 grid gap-4 border-t border-line pt-4">
                {l.details.length > 0 && (
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {l.details.map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-[13.5px]">
                        <dt className="w-32 shrink-0 text-ink-3">{k}</dt>
                        <dd className="min-w-0 break-words text-ink-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {l.message && (
                  <div>
                    <p className="text-[12.5px] font-medium text-ink-3">Their message</p>
                    <p dir="auto" className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-2">
                      {l.message}
                    </p>
                  </div>
                )}
                {l.conversation.length > 0 && (
                  <div>
                    <p className="text-[12.5px] font-medium text-ink-3">The conversation with Daniel</p>
                    <div className="mt-2 flex max-h-[420px] flex-col gap-2 overflow-y-auto rounded-2xl bg-paper p-3">
                      {l.conversation.map((m, i) => (
                        <div key={i} className={cn("flex flex-col gap-0.5", m.from === "visitor" ? "items-end" : "items-start")}>
                          <span className="px-1 text-[11px] text-ink-3">{m.from === "visitor" ? "Visitor" : "Daniel (AI)"}</span>
                          <p
                            dir="auto"
                            className={cn(
                              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed",
                              m.from === "visitor" ? "rounded-se-md bg-navy text-white" : "rounded-ss-md bg-white text-ink-2",
                            )}
                          >
                            {m.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
