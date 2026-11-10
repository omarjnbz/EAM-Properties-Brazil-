"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CalendarCheck } from "@phosphor-icons/react/dist/csr/CalendarCheck";
import { ListChecks } from "@phosphor-icons/react/dist/csr/ListChecks";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import type { Dictionary } from "@/content/i18n";
import { countryName, regionName } from "@/content/i18n/countries";
import { CITIZENSHIP_PROGRAMS, RESIDENCE_REGIONS, citizenshipHref, residenceHref, slugify } from "@/content/programs";
import { BOOKING, SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { AppLink } from "@/components/ui/app-link";
import { fill } from "./bus";
import { DanielMark } from "./daniel-mark";

type Copy = Dictionary["chat"];

/**
 * Card markers Daniel may write on their own line (taught in the system prompt):
 *   [[program:Portugal]]  residence program card
 *   [[passport:Grenada]]  citizenship program card
 *   [[handoff]]           WhatsApp + book-a-call card
 *   [[plan]]              starts the "Plan my move" qualifier
 * Every figure on a card comes from content/programs.ts, never from the model,
 * and an unknown country renders nothing.
 */
export type Marker = { kind: "program" | "passport"; country: string } | { kind: "handoff" } | { kind: "plan" };

const MARKER = /\[\[\s*(program|passport|handoff|plan)\s*(?::\s*([^\]]+?))?\s*\]\]/gi;

/** Splits a reply into its text and its cards. While streaming, a half-written marker is hidden. */
export function parseReply(content: string, streaming = false): { text: string; cards: Marker[] } {
  const cards: Marker[] = [];
  let text = content.replace(MARKER, (_, kind: string, arg?: string) => {
    const k = kind.toLowerCase();
    if ((k === "program" || k === "passport") && arg) cards.push({ kind: k, country: arg.trim() });
    else if (k === "handoff" || k === "plan") cards.push({ kind: k });
    return "";
  });
  if (streaming) text = text.replace(/\[\[[^\]]*\]?$/, "");
  // Drop duplicates (the model sometimes repeats a card).
  const seen = new Set<string>();
  const unique = cards.filter((c) => {
    const id = c.kind + ("country" in c ? slugify(c.country) : "");
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return { text: text.replace(/\n{3,}/g, "\n\n").trim(), cards: unique.slice(0, 3) };
}

const ALIASES: Record<string, string> = {
  uae: "united-arab-emirates",
  emirates: "united-arab-emirates",
  dubai: "united-arab-emirates",
  usa: "united-states",
  us: "united-states",
  "united-states-of-america": "united-states",
  uk: "united-kingdom",
  turkey: "turkiye",
  "st-kitts": "st-kitts-and-nevis",
  "saint-kitts-and-nevis": "st-kitts-and-nevis",
  "saint-lucia": "st-lucia",
  antigua: "antigua-and-barbuda",
  nauru: "nauru",
  "sao-tome": "sao-tome-and-principe",
};

const key = (name: string) => {
  const k = slugify(name);
  return ALIASES[k] ?? k;
};

const RESIDENCE = new Map(RESIDENCE_REGIONS.flatMap((r) => r.programs.map((p) => [key(p.country), { ...p, region: r.name }] as const)));
const CITIZENSHIP = new Map(CITIZENSHIP_PROGRAMS.map((p) => [key(p.country), p] as const));

/** Amounts with an unconfirmed {{placeholder}} show "to be confirmed" instead of the brace text. */
const amount = (value: string, tbc: string) => (/\{\{/.test(value) ? tbc : value.replace(/\*/g, ""));

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-line py-1.5 first:border-t-0">
      <dt className="shrink-0 text-[12px] text-ink-3">{label}</dt>
      <dd className="text-end text-[13px] font-medium text-ink">{value}</dd>
    </div>
  );
}

export function ProgramCard({ marker, copy, locale, onNavigate }: { marker: { kind: "program" | "passport"; country: string }; copy: Copy; locale: Locale; onNavigate: () => void }) {
  const c = copy.cards;
  if (marker.kind === "program") {
    const p = RESIDENCE.get(key(marker.country));
    if (!p) return null;
    return (
      <Card
        kind={c.residence}
        region={regionName(p.region, locale)}
        country={countryName(p.country, locale)}
        badge={p.localTeam ? c.localTeam : undefined}
        href={residenceHref(p)}
        copy={copy}
        onNavigate={onNavigate}
      >
        <Row label={c.minimum} value={<bdi>{amount(p.amount, c.tbc)}</bdi>} />
        {locale === "en" && <Row label={c.rights} value={p.rights} />}
        {p.schengen !== undefined && <Row label={c.schengen} value={p.schengen ? <span className="text-leaf-deep">{c.yes}</span> : c.no} />}
      </Card>
    );
  }
  const p = CITIZENSHIP.get(key(marker.country));
  if (!p) return null;
  return (
    <Card
      kind={c.citizenship}
      region={regionName(p.region, locale)}
      country={countryName(p.country, locale)}
      badge={p.localTeam ? c.localTeam : undefined}
      href={citizenshipHref(p)}
      copy={copy}
      onNavigate={onNavigate}
    >
      <Row label={c.minimum} value={<bdi>{amount(p.amount, c.tbc)}</bdi>} />
      <Row label={c.visaFree} value={<bdi>{p.visaFree}</bdi>} />
      {locale === "en" && <Row label={c.stay} value={p.residence} />}
    </Card>
  );
}

function Card({
  kind,
  region,
  country,
  badge,
  href,
  copy,
  onNavigate,
  children,
}: {
  kind: string;
  region: string;
  country: string;
  badge?: string;
  href: string;
  copy: Copy;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <article className="daniel-rise rounded-2xl bg-surface p-4 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_10px_24px_-16px_rgba(11,27,47,0.3)] ring-1 ring-ink/[0.07]">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
        <span className="text-navy">{kind}</span>
        <span aria-hidden>·</span>
        <span>{region}</span>
        {badge && <span className="ms-auto rounded-full bg-leaf-soft px-2 py-0.5 text-[10.5px] normal-case tracking-normal text-leaf-deep">{badge}</span>}
      </div>
      <h4 className="mt-1.5 text-[1.15rem] font-medium leading-tight tracking-[-0.02em] text-ink">{country}</h4>
      <dl className="mt-2">{children}</dl>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[11px] leading-snug text-ink-3">{copy.cards.asOf}</p>
        <AppLink
          href={href}
          onClick={onNavigate}
          className="group inline-flex shrink-0 items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-navy-deep"
        >
          {copy.cards.details}
          <ArrowUpRight weight="bold" className="size-3 rtl:-scale-x-100" aria-hidden />
        </AppLink>
      </div>
    </article>
  );
}

/** WhatsApp text that carries Daniel's notes, so the advisor starts with the context. */
export function whatsappWith(text?: string) {
  if (!text) return SITE.whatsappHref;
  return `${SITE.whatsappHref.split("?")[0]}?text=${encodeURIComponent(text.slice(0, 1500))}`;
}

/** "Talk to a real person": the hand-off from Daniel to the team, by WhatsApp or a booked call. */
export function HandoffCard({ copy, onNavigate, whatsappText, passing }: { copy: Copy; onNavigate: () => void; whatsappText?: string; passing?: boolean }) {
  const h = copy.handoff;
  return (
    <article className="daniel-rise overflow-hidden rounded-2xl bg-ink text-white shadow-[0_14px_30px_-18px_rgba(11,27,47,0.7)]">
      {passing && (
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] text-white/75">
          <DanielMark size={18} />
          <span aria-hidden className="h-px w-5 bg-gradient-to-r from-white/50 to-[#8fc24a] rtl:bg-gradient-to-l" />
          <span className="grid size-[18px] place-items-center rounded-full bg-leaf text-[9px] font-semibold">AM</span>
          <span className="ms-1">{h.passing}</span>
        </div>
      )}
      <div className="p-4">
        <h4 className="text-[1.05rem] font-medium tracking-[-0.02em]">{h.title}</h4>
        <p className="mt-1 text-[13px] leading-relaxed text-white/70">{h.body}</p>
        <div className="mt-3 flex flex-col gap-2">
          <a
            href={whatsappWith(whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-leaf-deep"
          >
            <WhatsappLogo weight="fill" className="size-4" aria-hidden />
            {h.whatsapp}
          </a>
          <AppLink
            href="/book"
            onClick={onNavigate}
            className="inline-flex flex-1 flex-col items-center justify-center rounded-full bg-white/10 px-4 py-1.5 text-[13.5px] font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
          >
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck weight="bold" className="size-4" aria-hidden />
              {h.book}
            </span>
            <span className="text-[10.5px] font-normal text-white/60">{fill(h.bookNote, { minutes: BOOKING.minutes, via: BOOKING.via })}</span>
          </AppLink>
        </div>
      </div>
    </article>
  );
}

/** The [[plan]] marker: a button that starts the five-tap qualifier. */
export function PlanButton({ label, onPlan }: { label: string; onPlan: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlan}
      className="daniel-rise inline-flex items-center gap-2 self-start rounded-full bg-navy px-4 py-2 text-[13.5px] font-medium text-white shadow-[0_8px_18px_-10px_rgba(14,86,158,0.8)] transition-colors hover:bg-navy-deep"
    >
      <ListChecks weight="bold" className="size-4" aria-hidden />
      {label}
    </button>
  );
}
