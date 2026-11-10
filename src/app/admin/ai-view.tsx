import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { aiUsage, type Usage } from "@/lib/admin/openai-usage";
import { cn } from "@/lib/cn";
import { Card, Notice, PageIntro, compact, shortDay, usd, whole } from "./ui";

/** OpenAI's line items, in words a non-technical reader can follow. */
const ITEMS: [RegExp, string][] = [
  [/cached input$/, "Re-reading Daniel's instructions (reused, a tenth of the price)"],
  [/cache writes - 12hr$/, "Storing his instructions for 12 hours"],
  [/cache writes$/, "Storing his instructions for reuse"],
  [/, input$/, "Reading new questions"],
  [/, output$/, "Writing answers (and thinking them through)"],
];
const itemLabel = (item: string) => ITEMS.find(([re]) => re.test(item))?.[1] ?? item;

export async function AiView() {
  const ai = await aiUsage(30);
  const intro = (
    <PageIntro eyebrow="AI costs" title="What Daniel costs to run">
      What OpenAI charged for Daniel&apos;s answers over the last 30 days. Figures can show up a few hours late.
    </PageIntro>
  );
  if (!("usage" in ai)) {
    return (
      <>
        {intro}
        <Notice title="Costs aren't available right now">
          The website couldn&apos;t read your OpenAI account. Details for whoever runs the website: {ai.error}
        </Notice>
      </>
    );
  }
  const u = ai.usage;
  const t = u.totals;
  const perReply = t.requests ? t.cost / t.requests : 0;
  const today = u.days.at(-1)?.cost ?? 0;
  const yesterday = u.days.at(-2)?.cost ?? 0;
  return (
    <>
      {intro}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="admin-rise rounded-[28px] bg-ink/[0.025] p-1.5 ring-1 ring-ink/[0.04] md:col-span-7" style={{ "--d": 60 } as React.CSSProperties}>
          <div className="flex h-full flex-col justify-between gap-8 rounded-[22px] bg-ink p-6 text-white shadow-[0_22px_50px_-30px_rgba(11,27,47,0.6)] sm:p-7">
            <p className="text-[14px] text-white/60">Spent in the last 30 days</p>
            <div>
              <p className="text-[clamp(3rem,7vw,4.4rem)] font-medium leading-none tracking-[-0.045em] tabular-nums">{usd(t.cost)}</p>
              <p className="mt-3 text-[14.5px] text-white/70">
                Today {usd(today)} · yesterday {usd(yesterday)}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:col-span-5">
          <Card delay={120}>
            <p className="text-[13.5px] text-ink-3">AI replies</p>
            <p className="mt-1 text-[2.2rem] font-medium leading-none tracking-[-0.04em] tabular-nums">{whole.format(t.requests)}</p>
            <p className="mt-2 text-[13.5px] text-ink-3">Daniel&apos;s answers, plus the quick checks that rate each lead</p>
          </Card>
          <Card delay={180}>
            <p className="text-[13.5px] text-ink-3">Each reply costs about</p>
            <p className="mt-1 text-[2.2rem] font-medium leading-none tracking-[-0.04em] tabular-nums">{usd(perReply)}</p>
            <p className="mt-2 text-[13.5px] text-ink-3">{perReply ? `So $10 pays for about ${whole.format(Math.floor(10 / perReply))} replies` : "No replies yet"}</p>
          </Card>
        </div>
      </div>

      <Card delay={240}>
        <CostChart days={u.days} />
      </Card>

      <Card delay={300}>
        <p className="flex items-center gap-2 text-[15px] font-medium">
          <Info weight="light" className="size-5 text-navy" aria-hidden />
          Good to know
        </p>
        <ul className="mt-3 flex flex-col gap-2.5 text-[14.5px] leading-relaxed text-ink-2">
          <li>Daniel reads the same long instructions with every question. OpenAI keeps them ready, so after the first message they cost a tenth of the price.</li>
          <li>This page shows everything your OpenAI account spent, including any other project that uses it.</li>
          <li>
            Your remaining credit is on OpenAI&apos;s billing page:{" "}
            <a
              href="https://platform.openai.com/settings/organization/billing/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy"
            >
              open OpenAI billing
              <ArrowUpRight weight="light" className="size-3.5" aria-hidden />
            </a>
          </li>
        </ul>
      </Card>

      <Card delay={340}>
        <details>
          <summary className="cursor-pointer text-[14.5px] font-medium text-ink">Technical details (for whoever runs the website)</summary>
          <TechnicalDetails usage={u} />
        </details>
      </Card>
    </>
  );
}

const th = "border-b border-line py-2 pe-4 text-start text-[11.5px] font-medium uppercase tracking-[0.06em] text-ink-3";
const td = "border-b border-line py-2.5 pe-4 align-top text-[13.5px] text-ink-2";

function TechnicalDetails({ usage: u }: { usage: Usage }) {
  const cachedShare = u.totals.input ? Math.round((u.totals.cached / u.totals.input) * 100) : 0;
  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <div className="overflow-x-auto">
        <h3 className="text-[13.5px] font-medium">Where the money goes</h3>
        <table className="mt-2 w-full border-separate border-spacing-0">
          <tbody>
            {u.lineItems.map((l) => (
              <tr key={l.item}>
                <td className={td}>
                  {itemLabel(l.item)}
                  <span className="block text-[11.5px] text-ink-3">{l.item}</span>
                </td>
                <td className={cn(td, "text-end tabular-nums")}>{usd(l.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <h3 className="text-[13.5px] font-medium">Models and tokens</h3>
        <table className="mt-2 w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={th}>Model</th>
              <th className={cn(th, "text-end")}>Replies</th>
              <th className={cn(th, "text-end")}>Read (reused)</th>
              <th className={cn(th, "text-end")}>Written</th>
            </tr>
          </thead>
          <tbody>
            {u.models.map((m) => (
              <tr key={m.model}>
                <td className={td}>{m.model}</td>
                <td className={cn(td, "text-end tabular-nums")}>{whole.format(m.requests)}</td>
                <td className={cn(td, "text-end tabular-nums")}>
                  {compact.format(m.input)} ({compact.format(m.cached)})
                </td>
                <td className={cn(td, "text-end tabular-nums")}>{compact.format(m.output)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[12.5px] text-ink-3">
          {cachedShare}% of what Daniel read was reused at the cached price. Days are counted in UTC.
          {u.projects.length > 1 && ` Projects: ${u.projects.map((p) => `${p.name} ${usd(p.cost)}`).join(" · ")}.`}
        </p>
      </div>
    </div>
  );
}

/**
 * Spending per day: one bar per day (a single series, so the title names it and
 * there's no legend). Hover or tab to a bar for that day; the same numbers are in
 * the table underneath.
 */
function CostChart({ days }: { days: Usage["days"] }) {
  const max = Math.max(...days.map((d) => d.cost), 0);
  const ticks = [0, Math.floor(days.length / 2), days.length - 1];
  return (
    <figure>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[15px] font-medium">Spending per day</span>
        <span className="text-[12.5px] text-ink-3">Hover a bar for the day · highest day {usd(max)}</span>
      </figcaption>
      <div className="relative mt-5 h-44">
        <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dashed border-line" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        <ol className="absolute inset-0 flex items-end gap-[2px] border-b border-ink/20">
          {days.map((d) => {
            const h = max > 0 ? Math.max(d.cost > 0 ? 3 : 0, (d.cost / max) * 100) : 0;
            return (
              <li key={d.day} tabIndex={0} aria-label={`${shortDay(d.day)}: ${usd(d.cost)}, ${d.requests} replies`} className="group relative flex h-full flex-1 items-end outline-none">
                <span className="block w-full rounded-t-[4px] bg-navy transition-colors duration-200 group-hover:bg-navy-deep group-focus-visible:bg-navy-deep" style={{ height: `${h}%` }} />
                <span className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-1.5 hidden w-max -translate-x-1/2 rounded-xl bg-ink px-2.5 py-1.5 text-[12px] leading-snug text-white shadow-[0_12px_30px_-12px_rgba(11,27,47,0.6)] group-hover:block group-focus-visible:block">
                  <span className="block font-medium">{shortDay(d.day)}</span>
                  {usd(d.cost)} · {whole.format(d.requests)} replies
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-ink-3" aria-hidden>
        {ticks.map((i) => (
          <span key={i}>{shortDay(days[i].day)}</span>
        ))}
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-[13px] font-medium text-navy">Show as a table</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={th}>Day</th>
                <th className={cn(th, "text-end")}>Spent</th>
                <th className={cn(th, "text-end")}>Replies</th>
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((d) => (
                <tr key={d.day}>
                  <td className={td}>{shortDay(d.day)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{usd(d.cost)}</td>
                  <td className={cn(td, "text-end tabular-nums")}>{whole.format(d.requests)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
