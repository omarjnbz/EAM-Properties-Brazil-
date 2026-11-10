import Link from "next/link";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { cn } from "@/lib/cn";
import { logout } from "./actions";

/* ------------------------------------------------------------------ formatting (plain, for non-technical readers) */
export const usd = (v: number) => (v === 0 ? "$0" : v < 0.1 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`);
export const whole = new Intl.NumberFormat("en");
export const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
export const shortDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/* ------------------------------------------------------------------ cards: a soft tray holding a white plate */
export function Card({ children, className, inner, delay = 0 }: { children: React.ReactNode; className?: string; inner?: string; delay?: number }) {
  return (
    <div className={cn("admin-rise rounded-[28px] bg-ink/[0.025] p-1.5 ring-1 ring-ink/[0.04]", className)} style={{ "--d": delay } as React.CSSProperties}>
      <div
        className={cn(
          "h-full rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(11,27,47,0.04),0_22px_50px_-34px_rgba(11,27,47,0.28)] sm:p-6",
          inner,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full bg-navy/[0.07] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-navy-deep">{children}</span>;
}

/** Each section's opening: what this page is for, in one plain sentence. */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="admin-rise flex flex-col items-start gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">{title}</h1>
      <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-3">{children}</p>
    </div>
  );
}

/** A plain-language notice: what's missing and what to do about it. */
export function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card inner="bg-[#fffaf0]">
      <p className="text-[15px] font-medium text-ink">{title}</p>
      <div className="mt-2 text-[14px] leading-relaxed text-ink-2">{children}</div>
    </Card>
  );
}

/* ------------------------------------------------------------------ the page frame: floating header with the three sections */
const SECTIONS = [
  { key: "leads", href: "/admin", label: "Leads" },
  { key: "ai", href: "/admin/ai", label: "AI costs" },
  { key: "daniel", href: "/admin/daniel", label: "Daniel" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export function Shell({ active, children }: { active: SectionKey; children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] bg-[radial-gradient(60%_80%_at_70%_0%,rgba(127,180,234,0.18),transparent)]" />
      <header className="sticky top-3 z-20 mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-[1120px] flex-wrap items-center gap-2 rounded-[22px] bg-white/85 p-1.5 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_16px_40px_-28px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06] backdrop-blur-xl sm:rounded-full">
        <Link href="/admin" className="flex items-center gap-2 rounded-full py-1.5 ps-3 pe-2">
          <span className="grid size-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">E</span>
          <span className="text-[14px] font-medium tracking-[-0.01em]">EAM Global</span>
        </Link>
        <nav aria-label="Admin sections" className="order-3 flex w-full gap-1 rounded-full bg-paper p-1 sm:order-none sm:ms-auto sm:w-auto">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              aria-current={s.key === active ? "page" : undefined}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-center text-[14px] font-medium transition-[background-color,color,box-shadow] duration-300 ease-fluid sm:flex-none",
                s.key === active ? "bg-white text-ink shadow-[0_1px_2px_rgba(11,27,47,0.08)] ring-1 ring-ink/[0.06]" : "text-ink-3 hover:text-ink",
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="ms-auto sm:ms-0">
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-medium text-ink-2 transition-[background-color,scale] duration-200 ease-expo hover:bg-paper active:scale-[0.97]"
          >
            <SignOut weight="light" className="size-[18px]" aria-hidden />
            Log out
          </button>
        </form>
      </header>
      <main className="relative mx-auto flex max-w-[1120px] flex-col gap-6 px-4 pt-10 pb-20 sm:px-6 md:gap-8 md:pt-14">{children}</main>
    </div>
  );
}
