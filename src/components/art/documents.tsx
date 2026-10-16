import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { Checks } from "@phosphor-icons/react/dist/ssr/Checks";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { cn } from "@/lib/cn";
import { ROADMAP_CONTENTS } from "@/content/home";
import { Stamp } from "./stamp";
import { LiveDot } from "@/components/ui/live-dot";

/* ------------------------------------------------------------------ Roadmap document */
/** The free roadmap as a sheet of paper: what the visitor actually receives. */
export function RoadmapDoc({ className, compact = false }: { className?: string; compact?: boolean }) {
  const rows = compact ? ROADMAP_CONTENTS.slice(0, 5) : ROADMAP_CONTENTS;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] bg-[#fbf9f4] p-5 text-ink shadow-[0_40px_70px_-42px_rgba(11,27,47,0.5)] ring-1 ring-ink/[0.07] sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">EAM Global · Personal roadmap</div>
          <div className="mt-2 font-display text-[1.5rem] leading-tight tracking-[-0.01em]">Your move, step by step</div>
        </div>
        <div className="shrink-0 whitespace-nowrap rounded-full bg-leaf-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-leaf-deep">48 h</div>
      </div>
      <div className="mt-2 font-mono text-[10px] text-ink-3">Prepared for: your family · Free · No obligation</div>
      <ol className="mt-5 flex flex-col">
        {rows.map((r, i) => (
          <li key={r.section} className="flex items-start gap-3 border-t border-dashed border-ink/[0.12] py-2.5">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
              <Check weight="bold" className="size-3" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[9.5px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13.5px] font-medium">{r.section}</span>
              </div>
              {!compact && <p className="mt-0.5 text-[12px] leading-snug text-ink-3">{r.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
      {compact && (
        <div className="mt-1 flex gap-1.5" aria-hidden>
          {[0, 1].map((i) => (
            <span key={i} className="h-1.5 flex-1 rounded-full bg-ink/[0.07]" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Chat (24/7 response) */
/** Illustrates the 60-minute promise: a 3 a.m. message answered by a person. */
export function ChatCard({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] p-4 shadow-[0_30px_60px_-36px_rgba(11,27,47,0.5)] ring-1",
        dark ? "bg-[#0f2540] text-paper ring-white/10" : "bg-[#fbf9f4] text-ink ring-ink/[0.07]",
        className,
      )}
    >
      <div className={cn("flex items-center gap-2.5 border-b pb-3", dark ? "border-white/10" : "border-ink/[0.08]")}>
        <span className="grid size-8 place-items-center rounded-full bg-leaf text-white">
          <WhatsappLogo weight="fill" className="size-4" aria-hidden />
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-medium">Your advisor</div>
          <div className={cn("flex items-center gap-1.5 text-[11px]", dark ? "text-paper/60" : "text-ink-3")}>
            <LiveDot className="size-1.5" /> online, any hour
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-[12.5px] leading-snug">
        <div className={cn("ms-auto max-w-[82%] rounded-2xl rounded-ee-md px-3 py-2", dark ? "bg-white/10" : "bg-leaf-soft")}>
          Hi, can you help us move to São Paulo?
          <div className={cn("mt-1 text-end font-mono text-[9.5px]", dark ? "text-paper/50" : "text-ink-3")}>Fri 03:12</div>
        </div>
        <div className={cn("max-w-[86%] rounded-2xl rounded-es-md px-3 py-2", dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white ring-1 ring-ink/[0.06]")}>
          Olá! Of course. I&apos;m your advisor. Shall I start your free roadmap?
          <div className={cn("mt-1 flex items-center justify-end gap-1 font-mono text-[9.5px]", dark ? "text-paper/50" : "text-ink-3")}>
            Fri 03:41 <Checks className="size-3.5 text-navy" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Guarantee receipt */
/** No Win, No Fee as a receipt: exactly what comes back and what does not. */
export function GuaranteeReceipt({ className, id = "receipt" }: { className?: string; id?: string }) {
  const lines = [
    { label: "Professional fees", sub: "Consultation, preparation, processing", value: "Refunded", ok: true },
    { label: "Government & embassy fees", sub: "Paid to official bodies", value: "Not refundable", ok: false },
    { label: "Third-party costs", sub: "Translations, courier, medical", value: "Not refundable", ok: false },
  ];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] bg-[#fbf9f4] p-5 pb-16 text-ink shadow-[0_30px_60px_-36px_rgba(11,27,47,0.5)] ring-1 ring-ink/[0.07]",
        className,
      )}
    >
      <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">
        <span>No Win, No Fee</span>
        <span>If refused</span>
      </div>
      <ul className="mt-3">
        {lines.map((l) => (
          <li key={l.label} className="flex items-start justify-between gap-3 border-t border-dashed border-ink/[0.14] py-2.5">
            <div className="min-w-0">
              <div className="text-[13px] font-medium">{l.label}</div>
              <div className="text-[11px] text-ink-3">{l.sub}</div>
            </div>
            <span className={cn("shrink-0 font-mono text-[10px] uppercase tracking-[0.12em]", l.ok ? "text-leaf-deep" : "text-ink-3")}>{l.value}</span>
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-5 bottom-4 flex items-center justify-between border-t border-ink/[0.14] pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Your fee, back</span>
      </div>
      <Stamp id={id} ring="REFUNDED • NO WIN NO FEE • EAM GLOBAL • " center="REFUNDED" sub="FEES" rotate={-14} className="pointer-events-none absolute -bottom-7 end-2 size-24 text-leaf/80 mix-blend-multiply" />
    </div>
  );
}
