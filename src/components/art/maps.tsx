/* eslint-disable @next/next/no-img-element -- static, cached SVG artwork (not photos) */
import { cn } from "@/lib/cn";
import { SOUTH_AMERICA, WORLD, WORLD_ARCS, WORLD_POINTS, type ShapeKey } from "@/lib/geo-data";
import { LiveDot } from "@/components/ui/live-dot";

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* ------------------------------------------------------------------ Pin (HTML overlay on a fixed-aspect map) */
function Pin({
  x,
  y,
  w,
  h,
  label,
  sub,
  hq,
  n,
  tone = "ink",
  align = "end",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  hq?: boolean;
  n?: number;
  tone?: "ink" | "light";
  align?: "start" | "end";
}) {
  return (
    <div className="absolute" style={{ left: pct(x, w), top: pct(y, h) }}>
      <span className="absolute -translate-x-1/2 -translate-y-1/2">
        {n ? (
          <span className="grid size-[18px] place-items-center rounded-full bg-sun font-mono text-[9.5px] font-semibold text-ink ring-[3px] ring-sun/25">
            {n}
          </span>
        ) : (
          <LiveDot className={hq ? "size-3" : "size-2.5"} color={hq ? "bg-sun" : "bg-leaf"} />
        )}
      </span>
      {label && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase leading-tight tracking-[0.14em]",
            align === "end" ? "start-3" : "end-3 text-end",
            tone === "light" ? "text-paper/85" : "text-ink-2",
          )}
        >
          {label}
          {sub && <span className={cn("block normal-case tracking-normal", tone === "light" ? "text-paper/50" : "text-ink-3")}>{sub}</span>}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ World routes */
/** Dotted world map with routes from Dubai HQ to every local team. */
export function WorldRoutes({ className, tone = "paper", labels = true }: { className?: string; tone?: "paper" | "ink"; labels?: boolean }) {
  const routes = [
    { key: "saoPaulo", label: "São Paulo" },
    { key: "buenosAires", label: "Buenos Aires" },
    { key: "asuncion", label: "Asunción" },
    { key: "belgrade", label: "Belgrade" },
  ] as const;
  const stroke = tone === "ink" ? "#e7b53c" : "#0e569e";
  const light = tone === "ink";

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${WORLD.width} / ${WORLD.height}` }}
      data-reveal=""
      suppressHydrationWarning
    >
      <img
        src={light ? "/art/world-dots-light.svg" : "/art/world-dots.svg"}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={cn("absolute inset-0 size-full", light ? "opacity-[0.22]" : "opacity-[0.16]")}
      />
      <svg viewBox={`0 0 ${WORLD.width} ${WORLD.height}`} className="absolute inset-0 size-full" aria-hidden fill="none">
        {routes.map((r, i) => (
          <path
            key={r.key}
            d={WORLD_ARCS[r.key].d}
            pathLength={1}
            className="route-line"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="round"
            style={{ "--len": 1, "--rd": 300 + i * 220 } as React.CSSProperties}
          />
        ))}
      </svg>
      <Pin x={WORLD_POINTS.dubai[0]} y={WORLD_POINTS.dubai[1]} w={WORLD.width} h={WORLD.height} hq label={labels ? "Dubai HQ" : undefined} tone={light ? "light" : "ink"} />
      {routes.map((r) => (
        <Pin
          key={r.key}
          x={WORLD_POINTS[r.key][0]}
          y={WORLD_POINTS[r.key][1]}
          w={WORLD.width}
          h={WORLD.height}
          label={labels && (r.key === "saoPaulo" || r.key === "belgrade") ? r.label : undefined}
          align="end"
          tone={light ? "light" : "ink"}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Brazil / South America */
export const BRAZIL_CITIES = [
  { key: "saoPaulo", label: "São Paulo", sub: "is business" },
  { key: "rio", label: "Rio de Janeiro", sub: "is lifestyle" },
  { key: "florianopolis", label: "Florianópolis", sub: "is where many newcomers settle" },
] as const;

/**
 * South America with Brazil highlighted. City pins are numbered and explained in
 * a legend, because São Paulo, Rio and Florianópolis sit too close for labels.
 */
export function BrazilMap({ className, tone = "ink", legend = true }: { className?: string; tone?: "ink" | "paper"; legend?: boolean }) {
  const light = tone === "ink";
  return (
    <figure className={cn("flex flex-col gap-6", className)}>
      <div className="relative w-full" style={{ aspectRatio: `${SOUTH_AMERICA.width} / ${SOUTH_AMERICA.height}` }}>
        <img
          src={light ? "/art/south-america-dark.svg" : "/art/south-america-light.svg"}
          alt="Map of South America with Brazil highlighted"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full"
        />
        {(["buenosAires", "asuncion"] as const).map((k) => (
          <Pin key={k} x={SOUTH_AMERICA.points[k][0]} y={SOUTH_AMERICA.points[k][1]} w={SOUTH_AMERICA.width} h={SOUTH_AMERICA.height} />
        ))}
        {BRAZIL_CITIES.map((c, i) => (
          <Pin key={c.key} x={SOUTH_AMERICA.points[c.key][0]} y={SOUTH_AMERICA.points[c.key][1]} w={SOUTH_AMERICA.width} h={SOUTH_AMERICA.height} n={i + 1} />
        ))}
      </div>
      {legend && (
        <figcaption className={cn("grid gap-2 text-[13px] sm:grid-cols-2", light ? "text-paper/70" : "text-ink-3")}>
          {BRAZIL_CITIES.map((c, i) => (
            <span key={c.key} className="flex items-baseline gap-2.5">
              <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-sun font-mono text-[9.5px] font-semibold text-ink">{i + 1}</span>
              <span>
                <span className={cn("font-display text-[15px] italic", light ? "text-paper" : "text-ink")}>{c.label}</span> {c.sub}
              </span>
            </span>
          ))}
          <span className="flex items-center gap-2.5">
            <LiveDot className="size-2.5" />
            <span>Buenos Aires and Asunción: our local teams next door</span>
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ Country artwork */
export type ArtTone = "sand" | "sky" | "rose" | "azulejo" | "lagoon";

const TONE_BG: Record<ArtTone, string> = {
  sand: "linear-gradient(160deg,#efe4cf,#e3d1ae)",
  sky: "linear-gradient(160deg,#e0e8ef,#c8d7e5)",
  rose: "linear-gradient(160deg,#f2e1dc,#e6c6bc)",
  azulejo: "linear-gradient(160deg,#e1e7f1,#c6d1e6)",
  lagoon: "linear-gradient(160deg,#dcefe9,#bfe0d8)",
};

/**
 * A country silhouette from Natural Earth with a pin on the team's city.
 * The silhouette is a cached static file (see scripts/build-geo.mjs), so it
 * never adds weight to the page's HTML.
 */
export function CountryArt({ shape, tone, className }: { shape: ShapeKey; tone: ArtTone; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: TONE_BG[tone] }} aria-hidden>
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(11,27,47,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(11,27,47,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
      <img src={`/art/country-${shape}-${tone}.svg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-contain p-3" />
    </div>
  );
}
