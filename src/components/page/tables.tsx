import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CITIZENSHIP_PROGRAMS, CITIZENSHIP_REGIONS, RESIDENCE_REGIONS, slugify, type CitizenshipProgram, type ResidenceProgram } from "@/content/programs";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";
import { Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";

/* Shared table styling: a real <table> on desktop, stacked cards on phones. */
const tableCls =
  "w-full border-separate border-spacing-0 text-start text-[14.5px] max-md:block max-md:[&_tbody]:flex max-md:[&_tbody]:flex-col max-md:[&_tbody]:gap-3";
const theadCls = "max-md:hidden";
const thCls = "border-b border-ink/15 pb-3 pe-4 text-start font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-ink-3";
const trCls =
  "group/row transition-colors duration-300 md:hover:bg-white/60 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-3 max-md:rounded-2xl max-md:bg-[#fbf9f4] max-md:p-5 max-md:ring-1 max-md:ring-ink/[0.07]";
const tdCls =
  "border-b border-ink/[0.08] py-4 pe-4 align-top text-ink-2 max-md:border-0 max-md:p-0 max-md:before:mb-1 max-md:before:block max-md:before:font-mono max-md:before:text-[9.5px] max-md:before:uppercase max-md:before:tracking-[0.16em] max-md:before:text-ink-3 max-md:before:content-[attr(data-label)]";

export type Column<T> = { key: string; label: string; render: (row: T) => React.ReactNode; className?: string; wide?: boolean };

/** Generic responsive table used by every directory and routes block. */
export function DataTable<T>({ rows, columns, rowKey, rowId, caption }: { rows: T[]; columns: Column<T>[]; rowKey: (r: T) => string; rowId?: (r: T) => string; caption?: string }) {
  return (
    <table className={tableCls}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className={theadCls}>
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col" className={cn(thCls, c.className)}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={rowKey(r)} id={rowId?.(r)} className={cn(trCls, "scroll-mt-40")}>
            {columns.map((c, ci) => (
              <td key={c.key} data-label={c.label} className={cn(tdCls, ci === 0 && "max-md:col-span-2 max-md:before:hidden", c.wide && "max-md:col-span-2", c.className)}>
                {c.render(r)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CountryCell({ country, href, localTeam, homeOffice, isNew }: { country: string; href?: string; localTeam?: boolean; homeOffice?: boolean; isNew?: boolean }) {
  const name = <span className="font-display text-[1.2rem] leading-tight text-ink">{country}</span>;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {href ? (
        <AppLink href={href} className="group/link inline-flex items-center gap-1.5">
          {name}
          <ArrowUpRight weight="light" className="size-4 text-ink-3 transition-transform duration-500 ease-fluid group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
        </AppLink>
      ) : (
        name
      )}
      {localTeam && <Badge>Local team</Badge>}
      {homeOffice && <Badge tone="sun">Home office</Badge>}
      {isNew && <Badge tone="sun">New 2026</Badge>}
    </div>
  );
}

/* ------------------------------------------------------------------ Residence directory */
export function ResidenceDirectory() {
  return (
    <div className="flex flex-col gap-20">
      {RESIDENCE_REGIONS.map((region) => {
        const columns: Column<ResidenceProgram>[] = [
          {
            key: "country",
            label: "Country",
            className: "md:w-[24%]",
            render: (p) => <CountryCell country={p.country} href={p.href} localTeam={p.localTeam} homeOffice={p.homeOffice} />,
          },
          { key: "amount", label: "Minimum qualifying amount", wide: true, className: "md:w-[30%]", render: (p) => <span className="text-ink"><Rich text={p.amount} /></span> },
          { key: "rights", label: "Live / work / study", render: (p) => p.rights },
          ...(region.hasSchengen
            ? [{ key: "schengen", label: "Schengen", render: (p: ResidenceProgram) => (p.schengen ? <span className="text-leaf-deep">Yes</span> : <span className="text-ink-3">No</span>) }]
            : []),
          { key: "note", label: "Note", wide: true, render: (p) => <span className="text-ink-3">{p.note ?? "—"}</span> },
        ];
        return (
          <Reveal key={region.id} id={region.id} className="scroll-mt-40">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink pb-4">
              <h3 className="font-display text-[2.2rem] leading-none tracking-[-0.02em]">{region.name}</h3>
              <span className="font-mono text-[11px] text-ink-3">{region.programs.length} programs</span>
            </div>
            <DataTable rows={region.programs} columns={columns} rowKey={(p) => p.country} rowId={(p) => slugify(p.country)} caption={`Residence programs in ${region.name}`} />
            {region.closed && (
              <div className="mt-6 rounded-2xl bg-paper-2 p-5 text-[14px] text-ink-2 ring-1 ring-ink/[0.06]">
                <span className="font-medium">{region.closed.intro}: </span>
                {region.closed.items.join(", ")}. <span className="text-ink-3">{region.closed.note}</span>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Citizenship directory */
export function CitizenshipDirectory() {
  const columns: Column<CitizenshipProgram>[] = [
    {
      key: "country",
      label: "Country",
      className: "md:w-[22%]",
      render: (p) => <CountryCell country={p.country} href={p.href} localTeam={p.localTeam} isNew={p.isNew} />,
    },
    { key: "amount", label: "Minimum qualifying amount", wide: true, className: "md:w-[28%]", render: (p) => <span className="text-ink">{p.amount}</span> },
    { key: "visa", label: "Visa-free (approx.)", render: (p) => <span className="font-display text-[1.2rem] text-ink">{p.visaFree}</span> },
    { key: "residence", label: "Residence required", render: (p) => p.residence },
    { key: "note", label: "Note", wide: true, render: (p) => <span className="text-ink-3">{p.note ?? "—"}</span> },
  ];
  return (
    <div className="flex flex-col gap-16">
      {CITIZENSHIP_REGIONS.map((region) => {
        const rows = CITIZENSHIP_PROGRAMS.filter((p) => p.region === region);
        return (
          <Reveal key={region} id={slugify(region)} className="scroll-mt-40">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink pb-4">
              <h3 className="font-display text-[2.2rem] leading-none tracking-[-0.02em]">{region}</h3>
              <span className="font-mono text-[11px] text-ink-3">
                {rows.length} {rows.length === 1 ? "program" : "programs"}
              </span>
            </div>
            <DataTable rows={rows} columns={columns} rowKey={(p) => p.country} rowId={(p) => slugify(p.country)} caption={`Citizenship programs: ${region}`} />
          </Reveal>
        );
      })}
    </div>
  );
}

/** Sticky in-page navigation between directory regions. */
export function RegionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Regions" className="no-scrollbar sticky top-[5.5rem] z-[5] -mx-5 overflow-x-auto px-5 py-3 md:mx-0 md:px-0">
      <ul className="flex w-max gap-2 rounded-full bg-paper/90 p-1.5 ring-1 ring-ink/[0.08] backdrop-blur-xl">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="block whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] text-ink-2 transition-colors duration-300 hover:bg-white hover:text-ink">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ Routes table (country pages) */
export function RoutesTable({ rows, labels = ["Route", "Requirement", "Outcome"] }: { rows: readonly { route: string; requirement: string; outcome: string }[]; labels?: [string, string, string] }) {
  const columns: Column<{ route: string; requirement: string; outcome: string }>[] = [
    { key: "route", label: labels[0], className: "md:w-[26%]", render: (r) => <span className="font-display text-[1.2rem] leading-tight text-ink">{r.route}</span> },
    { key: "req", label: labels[1], wide: true, render: (r) => <Rich text={r.requirement} /> },
    { key: "out", label: labels[2], wide: true, render: (r) => <span className="text-ink-3"><Rich text={r.outcome} /></span> },
  ];
  return <DataTable rows={[...rows]} columns={columns} rowKey={(r) => r.route + r.requirement} />;
}
