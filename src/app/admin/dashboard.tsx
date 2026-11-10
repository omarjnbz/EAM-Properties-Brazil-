import { CARDS_GUIDE, SYSTEM_PROMPT, SYSTEM_PROMPT_COMPACT } from "@/lib/chat/knowledge";
import { chatProviders } from "@/lib/chat/providers";
import { aiUsage, type Usage } from "@/lib/admin/openai-usage";
import { recentLeads, type LeadsResult, type SheetLead } from "@/lib/admin/leads";
import { cn } from "@/lib/cn";
import { logout } from "./actions";

/* ------------------------------------------------------------------ formatting */
const usd = (v: number) => (v === 0 ? "$0" : v < 0.1 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`);
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en");
const shortDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const FORMS: Record<string, string> = { roadmap: "Free roadmap", contact: "Contact form", guide: "Guide download", chat: "AI chat (Daniel)" };
const LINE_ITEMS: Record<string, string> = {};
const lineItem = (item: string) =>
  LINE_ITEMS[item] ??
  item
    .replace(/, cached input$/, " · reused (cached) input")
    .replace(/, cache writes - 12hr$/, " · cache writes (12 h)")
    .replace(/, cache writes$/, " · cache writes")
    .replace(/, input$/, " · new input")
    .replace(/, output$/, " · output (answers + reasoning)");

/** The overview: AI usage and cost, leads, and Daniel's set-up. Server only: keys never reach the page. */
export async function Dashboard() {
  const [ai, leads] = await Promise.all([aiUsage(30), recentLeads(50)]);
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-6 sm:px-6 md:py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-navy">EAM Global · Admin</p>
          <h1 className="mt-0.5 text-[1.7rem] font-medium tracking-[-0.02em]">Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[12px] text-ink-3 ring-1 ring-ink/[0.08]">{process.env.VERCEL_ENV ?? "local"}</span>
          <form action={logout}>
            <button type="submit" className="h-9 rounded-full bg-white px-4 text-[13.5px] font-medium text-ink ring-1 ring-ink/10 transition-colors hover:ring-ink/25">
              Log out
            </button>
          </form>
        </div>
      </header>

      {"usage" in ai ? <UsageSection usage={ai.usage} /> : <Panel title="AI usage and cost" note={ai.error} />}
      <LeadsSection result={leads} />
      <DanielSection />
    </div>
  );
}

/* ------------------------------------------------------------------ building blocks */
function Panel({ title, intro, note, children, className }: { title: string; intro?: React.ReactNode; note?: string; children?: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.06] sm:p-6", className)}>
      <h2 className="text-[1.15rem] font-medium tracking-[-0.015em]">{title}</h2>
      {intro && <p className="mt-1 max-w-3xl text-[13.5px] leading-relaxed text-ink-3">{intro}</p>}
      {note && <p className="mt-3 rounded-2xl bg-sun-soft px-4 py-3 text-[13.5px] text-ink">{note}</p>}
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-paper px-4 py-3.5">
      <p className="text-[12.5px] text-ink-3">{label}</p>
      <p className="mt-0.5 text-[1.6rem] font-medium tracking-[-0.03em] text-ink tabular-nums">{value}</p>
      {sub && <p className="text-[12px] text-ink-3">{sub}</p>}
    </div>
  );
}

const th = "border-b border-line py-2 pe-4 text-start text-[11.5px] font-medium uppercase tracking-[0.06em] text-ink-3";
const td = "border-b border-line py-2.5 pe-4 align-top text-[13.5px] text-ink-2";

/* ------------------------------------------------------------------ AI usage */
function UsageSection({ usage }: { usage: Usage }) {
  const t = usage.totals;
  const today = usage.days.at(-1);
  const yesterday = usage.days.at(-2);
  const perRequest = t.requests ? t.cost / t.requests : 0;
  const cachedShare = t.input ? Math.round((t.cached / t.input) * 100) : 0;
  return (
    <Panel
      title="AI usage and cost · last 30 days"
      intro={
        <>
          Straight from your OpenAI organization (every project and key, website included). Days are UTC, and OpenAI&apos;s
          cost figures can lag real use by a few hours. Credit balance:{" "}
          <a className="text-navy underline underline-offset-2" href="https://platform.openai.com/settings/organization/billing/overview" target="_blank" rel="noopener noreferrer">
            OpenAI billing
          </a>
          .
        </>
      }
    >
      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Stat label="Spent" value={usd(t.cost)} sub={`today ${usd(today?.cost ?? 0)} · yesterday ${usd(yesterday?.cost ?? 0)}`} />
        <Stat label="AI requests" value={whole.format(t.requests)} sub="answers, lead checks and scores" />
        <Stat label="Cost per request" value={usd(perRequest)} sub={perRequest ? `≈ ${whole.format(Math.floor(1 / perRequest))} requests per $1` : "no requests yet"} />
        <Stat label="Tokens" value={`${compact.format(t.input)} in · ${compact.format(t.output)} out`} sub={`${cachedShare}% of input reused at the cached rate`} />
      </div>

      <CostChart days={usage.days} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="overflow-x-auto">
          <h3 className="text-[14px] font-medium">Where the money goes</h3>
          <table className="mt-2 w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={th}>Item</th>
                <th className={cn(th, "text-end")}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {usage.lineItems.map((l) => (
                <tr key={l.item}>
                  <td className={td}>{lineItem(l.item)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{usd(l.cost)}</td>
                </tr>
              ))}
              {usage.lineItems.length === 0 && (
                <tr>
                  <td className={td} colSpan={2}>
                    No cost yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <h3 className="text-[14px] font-medium">By model</h3>
          <table className="mt-2 w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={th}>Model</th>
                <th className={cn(th, "text-end")}>Requests</th>
                <th className={cn(th, "text-end")}>Input (cached)</th>
                <th className={cn(th, "text-end")}>Output</th>
              </tr>
            </thead>
            <tbody>
              {usage.models.map((m) => (
                <tr key={m.model}>
                  <td className={td}>{m.model}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{whole.format(m.requests)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>
                    {compact.format(m.input)} ({compact.format(m.cached)})
                  </td>
                  <td className={cn(td, "text-end tabular-nums")}>{compact.format(m.output)}</td>
                </tr>
              ))}
              {usage.models.length === 0 && (
                <tr>
                  <td className={td} colSpan={4}>
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {usage.projects.length > 1 && (
            <p className="mt-3 text-[12.5px] text-ink-3">
              Projects: {usage.projects.map((p) => `${p.name} ${usd(p.cost)}`).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

/**
 * Daily cost, one bar per day (one series: the title names it, so no legend).
 * Hover or focus a day for its cost and requests; the same numbers sit in the
 * table below the chart.
 */
function CostChart({ days }: { days: Usage["days"] }) {
  const max = Math.max(...days.map((d) => d.cost), 0);
  const ticks = [0, Math.floor(days.length / 2), days.length - 1];
  return (
    <figure className="mt-6">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-medium">Cost per day</span>
        <span className="text-[12px] text-ink-3">highest {usd(max)}</span>
      </figcaption>
      <div className="relative mt-3 h-40">
        <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dashed border-line" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        <ol className="absolute inset-0 flex items-end gap-[2px] border-b border-ink/20">
          {days.map((d) => {
            const h = max > 0 ? Math.max(d.cost > 0 ? 3 : 0, (d.cost / max) * 100) : 0;
            return (
              <li key={d.day} tabIndex={0} aria-label={`${shortDay(d.day)}: ${usd(d.cost)}, ${d.requests} requests`} className="group relative flex h-full flex-1 items-end outline-none">
                <span className="block w-full rounded-t-[4px] bg-navy transition-colors group-hover:bg-navy-deep group-focus-visible:bg-navy-deep" style={{ height: `${h}%` }} />
                <span className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-1 hidden w-max -translate-x-1/2 rounded-xl bg-ink px-2.5 py-1.5 text-[12px] leading-snug text-white shadow-lg group-hover:block group-focus-visible:block">
                  <span className="block font-medium">{shortDay(d.day)}</span>
                  {usd(d.cost)} · {whole.format(d.requests)} requests
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-1.5 flex justify-between text-[11.5px] text-ink-3" aria-hidden>
        {ticks.map((i) => (
          <span key={i}>{shortDay(days[i].day)}</span>
        ))}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-[12.5px] font-medium text-navy">Show as a table</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={th}>Day (UTC)</th>
                <th className={cn(th, "text-end")}>Cost</th>
                <th className={cn(th, "text-end")}>Requests</th>
                <th className={cn(th, "text-end")}>Input</th>
                <th className={cn(th, "text-end")}>Output</th>
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((d) => (
                <tr key={d.day}>
                  <td className={td}>{d.day}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{usd(d.cost)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{whole.format(d.requests)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{compact.format(d.input)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{compact.format(d.output)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/* ------------------------------------------------------------------ Leads */
const SCORES: Record<string, string> = { hot: "bg-[#fbe3d6] text-[#8d3b1c]", warm: "bg-sun-soft text-[#7a5a0c]", cold: "bg-paper-2 text-ink-3" };

function LeadsSection({ result }: { result: LeadsResult }) {
  if (!("leads" in result)) {
    const note =
      result.unavailable === "no-webhook"
        ? "LEADS_WEBHOOK_URL isn't set on this server, so there is no leads Sheet to read."
        : result.unavailable === "old-script"
          ? "The leads Sheet's Apps Script needs its update to list leads here: paste scripts/leads-webhook.gs into the Sheet's Apps Script, save, then Deploy → Manage deployments → Edit → New version. Until then, open the Sheet from Google Drive."
          : `Couldn't read the leads Sheet: ${result.detail ?? "unknown error"}`;
    return <Panel title="Leads" note={note} />;
  }
  const leads = result.leads;
  const counts = leads.reduce<Record<string, number>>((c, l) => ((c[l.score || "unscored"] = (c[l.score || "unscored"] ?? 0) + 1), c), {});
  return (
    <Panel
      title={`Leads · newest ${leads.length}`}
      intro={`From the leads Google Sheet. ${["hot", "warm", "cold"].map((s) => `${counts[s] ?? 0} ${s}`).join(" · ")}. Open a lead for its message and chat transcript.`}
    >
      <div className="mt-4 flex flex-col gap-2">
        {leads.map((l, i) => (
          <LeadRow key={`${l.submittedAt}-${i}`} lead={l} />
        ))}
        {leads.length === 0 && <p className="text-[13.5px] text-ink-3">No leads yet.</p>}
      </div>
    </Panel>
  );
}

function LeadRow({ lead: l }: { lead: SheetLead }) {
  const digits = (l.whatsapp ?? "").replace(/[^0-9]/g, "");
  const interest = [l.destination, l.goal, l.budget, l.familySize && `family ${l.familySize}`].filter(Boolean).join(" · ");
  const transcript = l.transcript ?? "";
  return (
    <details className="group rounded-2xl bg-paper px-4 py-3 open:bg-white open:ring-1 open:ring-ink/[0.08]">
      <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1">
        <span className="w-[8.5rem] shrink-0 text-[12.5px] text-ink-3 tabular-nums">{l.submittedAt}</span>
        {l.score && <span className={cn("rounded-full px-2 py-0.5 text-[11.5px] font-semibold uppercase tracking-[0.04em]", SCORES[l.score] ?? SCORES.cold)}>{l.score}</span>}
        <span className="text-[14px] font-medium text-ink">{l.name || "No name"}</span>
        <span className="text-[12.5px] text-ink-3">{FORMS[l.type] ?? l.type}</span>
        {interest && <span className="text-[12.5px] text-ink-2">{interest}</span>}
        {l.summary && <span className="basis-full text-[13px] leading-snug text-ink-2 sm:ps-[9.25rem]">{l.summary}</span>}
      </summary>
      <div className="mt-3 grid gap-3 border-t border-line pt-3 text-[13.5px] text-ink-2 sm:ps-[9.25rem]">
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          {digits && (
            <a className="font-medium text-leaf-deep underline underline-offset-2" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
              WhatsApp {l.whatsapp}
            </a>
          )}
          {l.email && (
            <a className="font-medium text-navy underline underline-offset-2" href={`mailto:${l.email}`}>
              {l.email}
            </a>
          )}
          {[l.nationality && `Nationality: ${l.nationality}`, l.currentCountry && `Lives in: ${l.currentCountry}`, l.language && `Language: ${l.language}`, l.page && `Page: ${l.page}`, l.visitorCountry && `From: ${l.visitorCountry}`]
            .filter(Boolean)
            .map((x) => (
              <span key={x as string}>{x}</span>
            ))}
        </p>
        {l.message && <p className="whitespace-pre-wrap">{l.message}</p>}
        {transcript && (
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink-3">Chat with Daniel</p>
            <p dir="auto" className="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-paper px-3 py-2 text-[13px] leading-relaxed">
              {transcript.length > 3000 ? `${transcript.slice(0, 3000)}…` : transcript}
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ Daniel */
function DanielSection() {
  const providers = chatProviders().map((p) => ({ id: p.id, model: String(p.options.model ?? ""), reasoning: String(p.options.reasoning_effort ?? "") }));
  const hook = process.env.LEADS_WEBHOOK_URL;
  const checks: [string, boolean, string][] = [
    ["OpenAI key", !!process.env.OPENAI_API_KEY, "answers the chat"],
    ["Groq key", !!process.env.GROQ_API_KEY, "backup when OpenAI fails"],
    [
      "Leads webhook",
      !!hook && !!process.env.LEADS_WEBHOOK_SECRET,
      !hook ? "not set: in production, leads are refused and visitors go to WhatsApp" : !process.env.LEADS_WEBHOOK_SECRET ? "set, but LEADS_WEBHOOK_SECRET is missing" : "leads reach the Sheet and the team's email",
    ],
    ["OpenAI admin key", !!process.env.OPENAI_ADMIN_KEY, "usage and cost on this page"],
    ["Search engines", process.env.SITE_INDEXABLE === "true", "SITE_INDEXABLE: off until launch"],
  ];
  // Each AI gets its own size (src/app/api/chat/route.ts): the full prompt for OpenAI,
  // a compact one for Groq's free tier. Both are shown with the card guide the chat adds.
  const prompts = [
    { label: "OpenAI (full)", text: `${SYSTEM_PROMPT}\n\n${CARDS_GUIDE}` },
    { label: "Groq (compact)", text: `${SYSTEM_PROMPT_COMPACT}\n\n${CARDS_GUIDE}` },
  ];
  const tokens = (text: string) => whole.format(Math.round(text.length / 4));
  return (
    <Panel
      title="Daniel, the AI guide"
      intro="Who answers, which keys this server has (never their values), and the full instructions Daniel receives with every question, built from the site's own content files."
    >
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-[14px] font-medium">Who answers</h3>
          <ol className="mt-2 flex flex-col gap-1.5 text-[13.5px] text-ink-2">
            {providers.map((p, i) => (
              <li key={p.id}>
                {i === 0 ? "First" : "If that fails"}: <span className="font-medium text-ink">{p.id === "openai" ? "OpenAI" : "Groq"}</span> · {p.model} · reasoning {p.reasoning}
              </li>
            ))}
            {providers.length === 0 && <li>No AI key: the chat is hidden.</li>}
          </ol>
          <h3 className="mt-5 text-[14px] font-medium">Set up on this server</h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {checks.map(([label, on, what]) => (
              <li key={label} className="flex items-baseline gap-2 text-[13.5px]">
                <span className={cn("w-11 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold", on ? "bg-leaf-soft text-leaf-deep" : "bg-paper-2 text-ink-3")}>{on ? "ON" : "OFF"}</span>
                <span className="font-medium text-ink">{label}</span>
                <span className="text-ink-3">{what}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[14px] font-medium">His instructions</h3>
          <p className="mt-2 text-[13.5px] text-ink-2">
            About {tokens(prompts[0].text)} tokens sent to OpenAI with every question ({tokens(prompts[1].text)} to Groq), most of it reused at the
            cached rate, plus the last 10 messages of the conversation and the page the visitor is on.
          </p>
          <p className="mt-2 text-[13px] text-ink-3">
            To change what he knows, edit the site&apos;s content files (src/content/programs.ts, pages.ts, site.ts): the pages and Daniel update together.
            His rules live in src/lib/chat/knowledge.ts.
          </p>
          {prompts.map((p) => (
            <details key={p.label} className="mt-3">
              <summary className="cursor-pointer text-[13px] font-medium text-navy">
                Read the instructions for {p.label}, ≈ {tokens(p.text)} tokens
              </summary>
              <pre className="mt-2 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl bg-paper px-3 py-2 font-mono text-[12px] leading-relaxed text-ink-2">{p.text}</pre>
            </details>
          ))}
        </div>
      </div>
    </Panel>
  );
}
