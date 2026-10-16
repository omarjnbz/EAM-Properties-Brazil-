// Generates the site's cartographic artwork from Natural Earth data (public domain,
// via the `world-atlas` package). Run with `npm run geo` after changing anything here.
//
// Outputs:
//   public/art/world-dots.svg   — dotted world map (cached static file)
//   src/lib/geo-data.ts         — projected city points, route arcs and country shapes

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature, merge } from "topojson-client";
import { geoNaturalEarth1, geoMercator, geoPath, geoContains } from "d3-geo";

const load = (res) => JSON.parse(readFileSync(new URL(`../node_modules/world-atlas/${res}`, import.meta.url)));
const t110 = load("countries-110m.json");
const t50 = load("countries-50m.json");

const round = (n) => Math.round(n * 10) / 10;

// Ramer–Douglas–Peucker simplification in projected (screen) space.
function rdp(points, eps) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1e-9;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= eps) return [points[0], points[points.length - 1]];
  return [...rdp(points.slice(0, idx + 1), eps).slice(0, -1), ...rdp(points.slice(idx), eps)];
}

const ringArea = (r) => Math.abs(r.reduce((a, [x, y], i) => {
  const [nx, ny] = r[(i + 1) % r.length];
  return a + (x * ny - nx * y);
}, 0) / 2);

// Projects a GeoJSON object and returns a compact, simplified SVG path string.
function compactPath(projection, object, { eps = 0.55, minArea = 1.5 } = {}) {
  const rings = [];
  let ring = null;
  const ctx = {
    moveTo(x, y) { ring = [[x, y]]; rings.push(ring); },
    lineTo(x, y) { ring.push([x, y]); },
    closePath() {},
    arc() {},
  };
  geoPath(projection, ctx)(object);
  let d = "";
  for (const r of rings) {
    if (r.length < 3 || ringArea(r) < minArea) continue;
    const simple = rdp(r, eps);
    if (simple.length < 3) continue;
    let [px, py] = [round(simple[0][0]), round(simple[0][1])];
    d += `M${px} ${py}`;
    for (let i = 1; i < simple.length; i++) {
      const x = round(simple[i][0]);
      const y = round(simple[i][1]);
      const rx = round(x - px);
      const ry = round(y - py);
      if (rx === 0 && ry === 0) continue;
      d += `l${rx} ${ry}`.replace(/ -/g, "-");
      px = x;
      py = y;
    }
    d += "z";
  }
  return d;
}
const pt = ([x, y]) => [round(x), round(y)];

const countries50 = feature(t50, t50.objects.countries).features;
const byId50 = (id) => {
  const f = countries50.find((c) => c.id === id);
  if (!f) throw new Error(`Missing country ${id}`);
  return f;
};

// ---------------------------------------------------------------- cities
const CITIES = {
  dubai: { name: "Dubai", lonLat: [55.2708, 25.2048] },
  saoPaulo: { name: "São Paulo", lonLat: [-46.6333, -23.5505] },
  rio: { name: "Rio de Janeiro", lonLat: [-43.1729, -22.9068] },
  florianopolis: { name: "Florianópolis", lonLat: [-48.5482, -27.5949] },
  brasilia: { name: "Brasília", lonLat: [-47.8825, -15.7942] },
  buenosAires: { name: "Buenos Aires", lonLat: [-58.3816, -34.6037] },
  asuncion: { name: "Asunción", lonLat: [-57.5759, -25.2637] },
  belgrade: { name: "Belgrade", lonLat: [20.4489, 44.7866] },
  lisbon: { name: "Lisbon", lonLat: [-9.1393, 38.7223] },
  abuDhabi: { name: "Abu Dhabi", lonLat: [54.3773, 24.4539] },
  roseau: { name: "Roseau", lonLat: [-61.3881, 15.3092] },
};

// ---------------------------------------------------------------- world dots
const W = 1000;
const H = 470;
const noAntarctica = merge(
  t110,
  t110.objects.countries.geometries.filter((g) => g.id !== "010"),
);
const world = geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], noAntarctica);

const STEP = 9.2;
let dots = "";
let dotCount = 0;
for (let row = 0, y = STEP / 2; y < H; row++, y += STEP * 0.866) {
  const offset = row % 2 ? STEP / 2 : 0;
  for (let x = STEP / 2 + offset; x < W; x += STEP) {
    const ll = world.invert([x, y]);
    if (ll && geoContains(noAntarctica, ll)) {
      dots += `M${round(x)} ${round(y)}h0`;
      dotCount++;
    }
  }
}

mkdirSync(new URL("../public/art/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../public/art/world-dots.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none"><path d="${dots}" stroke="#0B1B2F" stroke-width="3.6" stroke-linecap="round"/></svg>\n`,
);

const worldPoints = Object.fromEntries(
  Object.entries(CITIES).map(([k, c]) => [k, pt(world(c.lonLat))]),
);

// Curved "flight" arc between two projected points, lifted towards the top of the map.
function arc(a, b, lift = 0.28) {
  const [x0, y0] = a;
  const [x2, y2] = b;
  const mx = (x0 + x2) / 2;
  const my = (y0 + y2) / 2;
  const dx = x2 - x0;
  const dy = y2 - y0;
  const len = Math.hypot(dx, dy);
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = mx + nx * len * lift;
  const cy = my + ny * len * lift;
  return { d: `M${round(x0)} ${round(y0)}Q${round(cx)} ${round(cy)} ${round(x2)} ${round(y2)}`, length: Math.round(len * 1.15) };
}

const worldArcs = {
  saoPaulo: arc(worldPoints.dubai, worldPoints.saoPaulo, 0.3),
  buenosAires: arc(worldPoints.dubai, worldPoints.buenosAires, 0.34),
  asuncion: arc(worldPoints.dubai, worldPoints.asuncion, 0.32),
  belgrade: arc(worldPoints.dubai, worldPoints.belgrade, 0.35),
};

// ---------------------------------------------------------------- South America / Brazil map
const SA_W = 560;
const SA_H = 640;
const brazil = byId50("076");
const saIds = ["032", "068", "152", "170", "218", "328", "600", "604", "740", "858", "862", "238"];
// Frames are corner MultiPoints: fitting uses their bounds and avoids polygon winding issues.
const saFrame = { type: "MultiPoint", coordinates: [[-82, 13], [-34, -56]] };
const sa = geoMercator()
  .fitExtent([[10, 10], [SA_W - 10, SA_H - 10]], saFrame)
  .clipExtent([[0, 0], [SA_W, SA_H]]);
const saPath = (f) => compactPath(sa, f, { eps: 0.6, minArea: 2 });
const neighbours = saIds.map((id) => saPath(byId50(id))).join("");
const frenchGuiana = saPath(byId50("250")); // France multipolygon, clipped to the frame
const brazilPath = compactPath(sa, brazil, { eps: 0.45, minArea: 2 });

let brazilDots = "";
const BSTEP = 7.4;
for (let row = 0, y = 0; y < SA_H; row++, y += BSTEP * 0.866) {
  const offset = row % 2 ? BSTEP / 2 : 0;
  for (let x = offset; x < SA_W; x += BSTEP) {
    const ll = sa.invert([x, y]);
    if (ll && geoContains(brazil, ll)) brazilDots += `M${round(x)} ${round(y)}h0`;
  }
}

const saPoints = Object.fromEntries(
  ["saoPaulo", "rio", "florianopolis", "brasilia", "buenosAires", "asuncion"].map((k) => [k, pt(sa(CITIES[k].lonLat))]),
);

// ---------------------------------------------------------------- destination shapes
function shape(features, pin, { w = 400, h = 300, pad = 28, frame } = {}) {
  const fc = { type: "FeatureCollection", features: Array.isArray(features) ? features : [features] };
  const proj = geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], frame ?? fc);
  if (frame) proj.clipExtent([[0, 0], [w, h]]);
  return {
    viewBox: `0 0 ${w} ${h}`,
    d: fc.features.map((f) => compactPath(proj, f, { eps: 0.5, minArea: 0.6 })).join(""),
    pin: pin ? pt(proj(pin)) : null,
  };
}

// Keep only the polygons whose first vertex falls inside a lon/lat box.
function within(featureObj, [[x0, y0], [x1, y1]]) {
  const g = featureObj.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const kept = polys.filter((poly) => {
    const [lon, lat] = poly[0][0];
    return lon >= x0 && lon <= x1 && lat <= y0 && lat >= y1;
  });
  return { ...featureObj, geometry: { type: "MultiPolygon", coordinates: kept } };
}

const caribbeanIds = ["212", "028", "308", "662", "659"];
const caribbeanContext = ["214", "630", "780", "052", "670", "850", "092", "660", "500", "652", "663", "534", "250"];
const caribbeanFrame = { type: "MultiPoint", coordinates: [[-67.2, 18.6], [-59.2, 11.6]] };
const carib = shape(caribbeanIds.map(byId50), CITIES.roseau.lonLat, { frame: caribbeanFrame });
const caribCtx = shape(caribbeanContext.map(byId50), null, { frame: caribbeanFrame });

const shapes = {
  brazil: shape(brazil, CITIES.saoPaulo.lonLat),
  uae: shape(byId50("784"), CITIES.dubai.lonLat),
  argentina: shape(byId50("032"), CITIES.buenosAires.lonLat, { w: 300, h: 400 }),
  paraguay: shape(byId50("600"), CITIES.asuncion.lonLat),
  portugal: shape(within(byId50("620"), [[-10, 42.3], [-6, 36.8]]), CITIES.lisbon.lonLat, { w: 300, h: 400 }),
  serbia: shape(byId50("688"), CITIES.belgrade.lonLat),
  caribbean: { ...carib, context: caribCtx.d },
};

// ---------------------------------------------------------------- static base layers
// Heavy geometry ships as cacheable SVG files (one per background tone) so it is not
// repeated in every page's HTML and RSC payload. Only light overlays are inlined.
const saSvg = ({ land, landStroke, brazilFill, brazilStroke, dot, dotOpacity }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SA_W} ${SA_H}" fill="none">` +
  `<path d="${neighbours + frenchGuiana}" fill="${land}" stroke="${landStroke}" stroke-width="0.8" stroke-linejoin="round"/>` +
  `<path d="${brazilPath}" fill="${brazilFill}" stroke="${brazilStroke}" stroke-width="1.2" stroke-linejoin="round"/>` +
  `<path d="${brazilDots}" stroke="${dot}" stroke-opacity="${dotOpacity}" stroke-width="2.6" stroke-linecap="round"/>` +
  `</svg>\n`;

writeFileSync(
  new URL("../public/art/south-america-dark.svg", import.meta.url),
  saSvg({ land: "#F5F0E6", landStroke: "#F5F0E6", brazilFill: "#13304F", brazilStroke: "#E7B53C", dot: "#F5F0E6", dotOpacity: 0.55 })
    .replace(`fill="#F5F0E6" stroke="#F5F0E6"`, `fill="#F5F0E6" fill-opacity="0.05" stroke="#F5F0E6" stroke-opacity="0.16"`),
);
writeFileSync(
  new URL("../public/art/south-america-light.svg", import.meta.url),
  saSvg({ land: "#E9E1D2", landStroke: "#D8CCB6", brazilFill: "#F5F0E6", brazilStroke: "#578A10", dot: "#0E569E", dotOpacity: 0.55 }),
);
writeFileSync(
  new URL("../public/art/world-dots-light.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none"><path d="${dots}" stroke="#F5F0E6" stroke-width="3.6" stroke-linecap="round"/></svg>\n`,
);

// ---------------------------------------------------------------- country art files
// One cached SVG per shape/tone combination used on the site (the card background
// and grid are CSS). Keeps silhouettes out of every page's HTML and RSC payload.
const ART_TONES = {
  sand: { fill: "#c9ad7b", stroke: "#a98a55", context: "#d8c49c" },
  sky: { fill: "#93afca", stroke: "#6e8fb1", context: "#b5c8da" },
  rose: { fill: "#cf9384", stroke: "#b47364", context: "#ddb2a6" },
  azulejo: { fill: "#6f8fc4", stroke: "#4f6fa6", context: "#a9bad8" },
  lagoon: { fill: "#3f8f7f", stroke: "#2f7365", context: "#a6d2c8" },
};
const ART_COMBOS = [
  ["uae", "sand"],
  ["argentina", "sky"],
  ["paraguay", "rose"],
  ["portugal", "azulejo"],
  ["caribbean", "lagoon"],
  ["serbia", "azulejo"],
  ["brazil", "sky"],
];
for (const [key, tone] of ART_COMBOS) {
  const sh = shapes[key];
  const t = ART_TONES[tone];
  const [, , vw, vh] = sh.viewBox.split(" ").map(Number);
  const r = Math.max(vw, vh) / 70;
  const pin = sh.pin
    ? `<circle cx="${sh.pin[0]}" cy="${sh.pin[1]}" r="${(r * 2.4).toFixed(1)}" fill="#0b1b2f" fill-opacity="0.14"/>` +
      `<circle cx="${sh.pin[0]}" cy="${sh.pin[1]}" r="${(r + 2).toFixed(1)}" fill="#fbf9f4"/>` +
      `<circle cx="${sh.pin[0]}" cy="${sh.pin[1]}" r="${r.toFixed(1)}" fill="#0b1b2f"/>`
    : "";
  writeFileSync(
    new URL(`../public/art/country-${key}-${tone}.svg`, import.meta.url),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sh.viewBox}" fill="none">` +
      (sh.context ? `<path d="${sh.context}" fill="${t.context}"/>` : "") +
      `<path d="${sh.d}" fill="${t.fill}" stroke="${t.stroke}" stroke-width="1" stroke-linejoin="round"/>${pin}</svg>\n`,
  );
}

// Barcode for the boarding passes: one static file instead of DOM rectangles.
{
  let x = 0;
  let seed = 7;
  let d = "";
  while (x < 120) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 1 + Math.floor((seed / 233280) * 3.4);
    d += `M${x} 0h${w}v34h-${w}z`;
    x += w + 1 + ((seed >> 3) % 2);
  }
  writeFileSync(
    new URL("../public/art/barcode.svg", import.meta.url),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 34" preserveAspectRatio="none"><path d="${d}" fill="#1d2f45"/></svg>\n`,
  );
}

// ---------------------------------------------------------------- write module
const out = `// AUTO-GENERATED by scripts/build-geo.mjs from Natural Earth (public domain). Do not edit by hand.

export const WORLD = { width: ${W}, height: ${H} } as const;

export const WORLD_POINTS = ${JSON.stringify(worldPoints)} as const;

export const WORLD_ARCS = ${JSON.stringify(worldArcs)} as const;

export const SOUTH_AMERICA = {
  width: ${SA_W},
  height: ${SA_H},
  points: ${JSON.stringify(saPoints)},
} as const;

export const SHAPES = ${JSON.stringify(Object.fromEntries(Object.entries(shapes).map(([k, v]) => [k, { viewBox: v.viewBox, pin: v.pin }])))} as const;

export type ShapeKey = keyof typeof SHAPES;
`;
writeFileSync(new URL("../src/lib/geo-data.ts", import.meta.url), out);

console.log(`world dots: ${dotCount}, world svg ${(dots.length / 1024).toFixed(1)}KB, geo-data.ts ${(out.length / 1024).toFixed(1)}KB`);
console.log("brazil path", (brazilPath.length / 1024).toFixed(1) + "KB", "neighbours", ((neighbours.length + frenchGuiana.length) / 1024).toFixed(1) + "KB", "brazilDots", (brazilDots.length / 1024).toFixed(1) + "KB");
for (const [k, v] of Object.entries(shapes)) console.log(k, (v.d.length / 1024).toFixed(1) + "KB", v.pin);
