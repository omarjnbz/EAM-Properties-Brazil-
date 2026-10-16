import Image from "next/image";
import logo from "@/assets/brand/eam-global-logo.png";
import { GUIDES_PAGE, type Guide, type GuideSection } from "@/content/guides";
import { FOUNDER, SITE } from "@/content/site";
import { Rich } from "@/components/ui/rich";
import { GUIDE_COVERS } from "./guide-images";

/**
 * A4 print layout for a guide. `npm run guides:pdf` opens this page in headless
 * Chrome and saves it as the downloadable PDF. Only the guide prints: the site
 * navigation, footer and floating buttons are hidden on this route.
 */
export function GuidePrint({ guide }: { guide: Guide }) {
  const cover = GUIDE_COVERS[guide.key];
  const running = `EAM Global · ${guide.title} · 2026`;
  const css = `
    @page {
      size: A4;
      margin: 16mm 16mm 18mm;
      @bottom-left { content: "${running}"; font-family: "Instrument Sans", sans-serif; font-size: 7.5pt; color: #5f6a7b; }
      @bottom-right { content: counter(page); font-family: "Instrument Sans", sans-serif; font-size: 7.5pt; color: #5f6a7b; }
    }
    @page :first { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
    html, body { background: #fff !important; }
    body > :not(main) { display: none !important; }
    .guide-doc { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .guide-cover { width: 210mm; height: 297mm; break-after: page; }
    .guide-keep { break-inside: avoid; }
    .guide-doc h2, .guide-doc h3 { break-after: avoid; }
    @media screen { .guide-doc { max-width: 210mm; margin: 0 auto; box-shadow: 0 0 0 1px #e6e6e0; } .guide-page { padding: 16mm; } }
  `;

  return (
    <div className="guide-doc bg-white text-ink">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Cover */}
      <section className="guide-cover relative isolate flex flex-col justify-between overflow-hidden bg-ink p-[16mm] text-white">
        <Image src={cover.image} alt="" fill preload sizes="900px" quality={60} className="-z-10 object-cover" style={{ objectPosition: cover.position ?? "50% 50%" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/90" />
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white px-3 py-1.5">
            <Image src={logo} alt="EAM Global" width={92} height={36} className="h-8 w-auto" />
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium ring-1 ring-white/25">Free guide</span>
        </div>
        <div>
          <div className="text-[13px] font-medium text-white/75">{guide.edition}</div>
          <h1 className="mt-3 text-[64px] font-medium leading-[0.98] tracking-[-0.045em]">{guide.title}</h1>
          <p className="mt-5 max-w-[125mm] text-[15px] leading-relaxed text-white/85">{guide.summary}</p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/25 pt-4 text-[11px] text-white/75">
            <span>www.eam-global.com</span>
            <span>WhatsApp {SITE.whatsappDisplay}</span>
            <span>{SITE.email}</span>
          </div>
        </div>
      </section>

      {/* Contents */}
      <section className="guide-page">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-leaf-deep">Inside this guide</div>
        <ol className="mt-5 flex flex-col">
          {guide.sections.map((s, i) => (
            <li key={s.title} className="flex items-baseline gap-4 border-t border-line py-3">
              <span className="w-6 text-[12px] font-semibold text-leaf-deep">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[16px] font-semibold tracking-[-0.02em]">{s.title}</span>
            </li>
          ))}
          <li className="flex items-baseline gap-4 border-y border-line py-3">
            <span className="w-6 text-[12px] font-semibold text-leaf-deep">{String(guide.sections.length + 1).padStart(2, "0")}</span>
            <span className="text-[16px] font-semibold tracking-[-0.02em]">How EAM Global helps</span>
          </li>
        </ol>
        <div className="guide-keep mt-8 rounded-[14px] bg-canvas p-5 text-[12.5px] leading-relaxed text-ink-2">
          <div className="text-[13px] font-semibold text-ink">Written by people who made the move</div>
          <p className="mt-1.5">
            Our founder, {FOUNDER.name}, moved to Brazil as an {FOUNDER.origin} immigrant in {FOUNDER.arrivedBrazil} and learned every step the hard way. This guide is
            what we wish someone had handed us on day one.
          </p>
          <p className="mt-2 text-ink-3">{GUIDES_PAGE.disclaimer}</p>
        </div>

        {guide.sections.map((s, i) => (
          <GuideBlock key={s.title} section={s} index={i} />
        ))}

        {/* How we help */}
        <section className="guide-keep mt-12 rounded-[18px] bg-ink p-7 text-white">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8fc24a]">{String(guide.sections.length + 1).padStart(2, "0")}</div>
          <h2 className="mt-1 text-[26px] font-medium leading-tight tracking-[-0.035em]">How EAM Global helps</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[12.5px] leading-snug text-white/85">
            {[
              guide.team,
              "A free, written roadmap within 48 hours",
              "Door to door: from the airport to your first month",
              "A real advisor replies within 60 minutes, any hour",
              "No Win, No Fee on our professional fees",
              "One fixed fee, agreed in writing before you pay",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-[#8fc24a]" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-[12px]">
            <div>
              <div className="text-white/55">WhatsApp, fastest</div>
              <div className="mt-0.5 text-[14px] font-medium">{SITE.whatsappDisplay}</div>
            </div>
            <div>
              <div className="text-white/55">Phone</div>
              <div className="mt-0.5 text-[14px] font-medium">{SITE.phoneDisplay}</div>
            </div>
            <div>
              <div className="text-white/55">Email</div>
              <div className="mt-0.5 text-[14px] font-medium">{SITE.email}</div>
            </div>
            <div>
              <div className="text-white/55">Your free roadmap</div>
              <div className="mt-0.5 text-[14px] font-medium">eam-global.com/free-roadmap</div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

function SectionTitle({ index, title, intro }: { index: number; title: string; intro?: string }) {
  return (
    <div className="guide-keep">
      <div className="text-[11px] font-semibold text-leaf-deep">{String(index + 1).padStart(2, "0")}</div>
      <h2 className="mt-1 text-[26px] font-medium leading-tight tracking-[-0.035em]">{title}</h2>
      {intro && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
          <Rich text={intro} />
        </p>
      )}
    </div>
  );
}

function GuideBlock({ section: s, index }: { section: GuideSection; index: number }) {
  // Short chapters move to the next page whole instead of leaving a heading stranded.
  const keepWhole = s.kind !== "text" && s.kind !== "routes";
  return (
    <section className={keepWhole ? "guide-keep mt-11" : "mt-11"}>
      {s.kind === "text" && (
        <>
          <SectionTitle index={index} title={s.title} />
          <div className="mt-4 flex flex-col gap-3">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-ink-2">
                <Rich text={p} />
              </p>
            ))}
          </div>
        </>
      )}

      {s.kind === "routes" && (
        <>
          <SectionTitle index={index} title={s.title} intro={s.intro} />
          <table className="mt-5 w-full border-collapse text-start text-[12px]">
            <thead>
              <tr className="border-b border-ink/20 text-[10.5px] uppercase tracking-[0.06em] text-ink-3">
                <th className="w-[28%] py-2 pe-3 text-start font-medium">Route</th>
                <th className="py-2 pe-3 text-start font-medium">Requirement</th>
                <th className="w-[30%] py-2 text-start font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.route + r.requirement} className="guide-keep border-b border-line align-top">
                  <td className="py-3 pe-3 text-[13px] font-semibold leading-snug">{r.route}</td>
                  <td className="py-3 pe-3 leading-relaxed text-ink-2">
                    <Rich text={r.requirement} />
                  </td>
                  <td className="py-3 leading-relaxed text-ink-3">
                    <Rich text={r.outcome} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {s.note && <p className="mt-3 text-[11.5px] text-ink-3">{s.note}</p>}
        </>
      )}

      {s.kind === "steps" && (
        <>
          <SectionTitle index={index} title={s.title} intro={s.intro} />
          <ol className="mt-5 flex flex-col">
            {s.steps.map((st, i) => (
              <li key={st.title + i} className="guide-keep flex gap-4 border-t border-line py-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[11.5px] font-semibold text-white">{i + 1}</span>
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[13.5px] font-semibold leading-snug">
                    <Rich text={st.title} />
                  </span>
                  {st.time && (
                    <span className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-[10.5px] font-medium text-leaf-deep">
                      <Rich text={st.time} />
                    </span>
                  )}
                  {st.body && (
                    <p className="w-full text-[12.5px] leading-relaxed text-ink-3">
                      <Rich text={st.body} />
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      {s.kind === "checklist" && (
        <>
          <SectionTitle index={index} title={s.title} intro={s.intro} />
          <ul className="mt-4 flex flex-col">
            {s.items.map((item) => (
              <li key={item} className="guide-keep flex items-start gap-3 border-t border-line py-2.5 text-[13px] leading-snug text-ink-2">
                <span aria-hidden className="mt-0.5 size-3.5 shrink-0 rounded-[3px] border border-ink/40" />
                <Rich text={item} />
              </li>
            ))}
          </ul>
          {s.note && <p className="mt-3 text-[11.5px] text-ink-3">{s.note}</p>}
        </>
      )}

      {s.kind === "cities" && (
        <>
          <SectionTitle index={index} title={s.title} intro={s.intro} />
          <ul className={`mt-5 grid gap-3 ${s.cities.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
            {s.cities.map((c) => (
              <li key={c.name} className="guide-keep rounded-[14px] bg-canvas p-4">
                <div className="text-[15px] font-semibold tracking-[-0.02em]">{c.name}</div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">{c.line}</p>
              </li>
            ))}
          </ul>
          {s.note && <p className="mt-3 text-[11.5px] text-ink-3">{s.note}</p>}
        </>
      )}

      {s.kind === "costs" && (
        <>
          <SectionTitle index={index} title={s.title} intro={s.intro} />
          <dl className="mt-4 flex flex-col">
            {s.rows.map((r) => (
              <div key={r.label} className="guide-keep flex items-baseline justify-between gap-6 border-t border-line py-3 last:border-b">
                <dt className="text-[13px] text-ink-2">{r.label}</dt>
                <dd className="text-end text-[13.5px] font-semibold">
                  <Rich text={r.value} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
