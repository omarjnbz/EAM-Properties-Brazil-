/**
 * What the AI has cost: OpenAI's organization Costs and Usage APIs, read with
 * an admin key (OPENAI_ADMIN_KEY). Server-only; the key never reaches the page.
 * Costs arrive in daily UTC buckets and can lag behind real use by a few hours.
 */
import { connection } from "next/server";

const API = "https://api.openai.com/v1/organization";

type CostResult = { amount: { value: number; currency: string }; line_item: string | null; project_id: string | null };
type UsageResult = {
  model: string | null;
  project_id: string | null;
  num_model_requests: number;
  input_tokens: number;
  input_cached_tokens?: number;
  output_tokens: number;
};
type Page<T> = { data: { start_time: number; results: T[] }[]; has_more: boolean; next_page: string | null };

export type Day = { day: string; cost: number; requests: number; input: number; cached: number; output: number };
export type Usage = {
  days: Day[];
  totals: { cost: number; requests: number; input: number; cached: number; output: number };
  lineItems: { item: string; cost: number }[];
  models: { model: string; requests: number; input: number; cached: number; output: number }[];
  projects: { id: string; name: string; cost: number }[];
};

async function get<T>(path: string, params: Record<string, string | number | string[]>, key: string): Promise<Page<T>["data"]> {
  const out: Page<T>["data"] = [];
  let page: string | null = null;
  for (let i = 0; i < 5; i++) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) for (const one of Array.isArray(v) ? v : [v]) q.append(k, String(one));
    if (page) q.set("page", page);
    const res = await fetch(`${API}/${path}?${q}`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15_000), cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as Page<T> & { error?: { message?: string } };
    if (!res.ok) throw new Error(json.error?.message || `OpenAI ${res.status}`);
    out.push(...json.data);
    if (!json.has_more || !json.next_page) break;
    page = json.next_page;
  }
  return out;
}

const dayKey = (unix: number) => new Date(unix * 1000).toISOString().slice(0, 10);

/** The last `days` days of cost and usage, or why it isn't available. */
export async function aiUsage(days = 30): Promise<{ usage: Usage } | { error: string }> {
  const key = process.env.OPENAI_ADMIN_KEY;
  if (!key) return { error: "OPENAI_ADMIN_KEY is not set on this server." };
  await connection(); // "the last 30 days" depends on the clock: request time only
  const start = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
  try {
    const [costs, usage, projects] = await Promise.all([
      get<CostResult>("costs", { start_time: start, bucket_width: "1d", limit: days + 1, group_by: ["line_item", "project_id"] }, key),
      get<UsageResult>("usage/completions", { start_time: start, bucket_width: "1d", limit: Math.min(31, days + 1), group_by: ["model", "project_id"] }, key),
      fetch(`${API}/projects?limit=50`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15_000), cache: "no-store" })
        .then((r) => r.json() as Promise<{ data?: { id: string; name: string }[] }>)
        .catch(() => ({ data: [] })),
    ]);

    // One row per day, oldest first, including days with no use.
    const byDay = new Map<string, Day>();
    const first = new Date(start * 1000);
    for (let i = 0; i <= days; i++) {
      const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate() + i)).toISOString().slice(0, 10);
      byDay.set(d, { day: d, cost: 0, requests: 0, input: 0, cached: 0, output: 0 });
    }
    const lineItems = new Map<string, number>();
    const perProject = new Map<string, number>();
    for (const bucket of costs) {
      const d = byDay.get(dayKey(bucket.start_time));
      for (const r of bucket.results) {
        const v = Number(r.amount?.value) || 0;
        if (d) d.cost += v;
        const item = r.line_item ?? "Other";
        lineItems.set(item, (lineItems.get(item) ?? 0) + v);
        const p = r.project_id ?? "none";
        perProject.set(p, (perProject.get(p) ?? 0) + v);
      }
    }
    const models = new Map<string, Usage["models"][number]>();
    for (const bucket of usage) {
      const d = byDay.get(dayKey(bucket.start_time));
      for (const r of bucket.results) {
        const cached = r.input_cached_tokens ?? 0;
        if (d) {
          d.requests += r.num_model_requests;
          d.input += r.input_tokens;
          d.cached += cached;
          d.output += r.output_tokens;
        }
        const name = r.model ?? "Other";
        const m = models.get(name) ?? { model: name, requests: 0, input: 0, cached: 0, output: 0 };
        m.requests += r.num_model_requests;
        m.input += r.input_tokens;
        m.cached += cached;
        m.output += r.output_tokens;
        models.set(name, m);
      }
    }

    const list = [...byDay.values()];
    const names = new Map((projects.data ?? []).map((p) => [p.id, p.name]));
    return {
      usage: {
        days: list,
        totals: list.reduce(
          (t, d) => ({ cost: t.cost + d.cost, requests: t.requests + d.requests, input: t.input + d.input, cached: t.cached + d.cached, output: t.output + d.output }),
          { cost: 0, requests: 0, input: 0, cached: 0, output: 0 },
        ),
        lineItems: [...lineItems].map(([item, cost]) => ({ item, cost })).sort((a, b) => b.cost - a.cost),
        models: [...models.values()].sort((a, b) => b.requests - a.requests),
        projects: [...perProject].map(([id, cost]) => ({ id, name: names.get(id) ?? id, cost })).sort((a, b) => b.cost - a.cost),
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't reach OpenAI." };
  }
}
