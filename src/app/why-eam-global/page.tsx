import type { Metadata } from "next";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { SealCheck } from "@phosphor-icons/react/dist/ssr/SealCheck";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Signature } from "@phosphor-icons/react/dist/ssr/Signature";
import { SuitcaseRolling } from "@phosphor-icons/react/dist/ssr/SuitcaseRolling";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import founder from "@/assets/images/founder-alaa-marzouk.png";
import { DOOR_STAGES } from "@/content/home";
import { SEO, WHY } from "@/content/pages";
import { GREETINGS, PILLARS, PRESENCE, type PillarKey } from "@/content/site";
import { cn } from "@/lib/cn";
import { Bezel, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { SplitHeading } from "@/components/ui/split-heading";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";
import { PageHero } from "@/components/page/page-hero";
import { FounderTimeline, MissionVision } from "@/components/home/founder-story";
import { Prose, SplitBlock } from "@/components/page/blocks";
import { DataTable } from "@/components/page/tables";
import { ChatCard, GuaranteeReceipt, RoadmapDoc } from "@/components/art/documents";
import { WorldRoutes } from "@/components/art/maps";

export const metadata: Metadata = {
  title: SEO.why.title,
  description: SEO.why.description,
  alternates: { canonical: "/why-eam-global" },
};

const PILLAR_ICONS: Record<PillarKey, typeof Translate> = {
  language: Translate,
  founder: Signature,
  response: Clock,
  ground: MapPin,
  door: SuitcaseRolling,
  roadmap: FileText,
  guarantee: ShieldCheck,
};

const ANCHORS: Record<PillarKey, string> = {
  language: "#language",
  founder: "#founder",
  response: "#response",
  ground: "#presence",
  door: "#door",
  roadmap: "#roadmap",
  guarantee: "#guarantee",
};

type PresenceRow = (typeof PRESENCE)[number];

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow={WHY.eyebrow}
        title={WHY.headline}
        intro={WHY.intro}
        crumbs={[{ label: "Why EAM Global" }]}
        aside={
          <Bezel tone="white" radius="2.2rem">
            <nav aria-label="The seven differences" className="p-5 md:p-6">
              <div className="px-2 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">The seven differences</div>
              <ol>
                {PILLARS.map((p) => (
                  <li key={p.key}>
                    <a href={ANCHORS[p.key]} className="group flex items-center justify-between gap-4 rounded-xl px-2 py-2.5 transition-colors duration-300 hover:bg-paper">
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[10.5px] text-leaf-deep">{p.n}</span>
                        <span className="font-display text-[1.2rem] leading-tight">{p.label}</span>
                      </span>
                      <span aria-hidden className="h-px w-6 bg-ink/20 transition-[width] duration-500 ease-fluid group-hover:w-10" />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Bezel>
        }
      />

      {/* The seven pillars at a glance */}
      <Section tone="paper-2" id="pillars">
        <Container>
          <SectionHeading eyebrow="The seven USPs" title="Seven promises, each one *measurable*" />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => {
              const Icon = PILLAR_ICONS[p.key];
              return (
                <Reveal as="li" key={p.key} delay={(i % 4) * 70} className={cn(i === 6 && "sm:col-span-2 lg:col-span-1")}>
                  <a href={ANCHORS[p.key]} className="group flex h-full flex-col rounded-[1.6rem] bg-[#fbf9f4] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_24px_48px_-38px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06] transition-transform duration-700 ease-fluid hover:-translate-y-1">
                    <span className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-full bg-paper-2 text-ink">
                        <Icon weight="light" className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-[11px] text-ink-3">{p.n}</span>
                    </span>
                    <span className="mt-6 font-display text-[1.45rem] leading-tight">{p.label}</span>
                    <span className="mt-2 text-[14px] leading-relaxed text-ink-3">
                      <Rich text={p.promise} />
                    </span>
                  </a>
                </Reveal>
              );
            })}
            <Reveal as="li" delay={210} className="hidden lg:block">
              <div className="flex h-full flex-col justify-between rounded-[1.6rem] bg-ink p-6 text-paper">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sun">The difference</span>
                <p className="font-display text-[1.45rem] leading-snug">The big firms sell programs. EAM Global sells the whole move.</p>
              </div>
            </Reveal>
          </ul>
        </Container>
      </Section>

      {/* 1. Language */}
      <SplitBlock
        id="language"
        eyebrow="01 · Speak your language"
        title={WHY.language.title}
        aside={
          <ul className="flex flex-wrap gap-2">
            {GREETINGS.map((g) => (
              <li key={g.code} lang={g.code} dir={g.code === "ar" ? "rtl" : "ltr"} className="rounded-full bg-white/70 px-4 py-2 font-display text-[1.4rem] italic ring-1 ring-ink/[0.07]">
                {g.word}
              </li>
            ))}
          </ul>
        }
      >
        <Prose paragraphs={WHY.language.paragraphs} />
        <Reveal className="mt-6">
          <p className="rounded-2xl bg-paper-2 p-5 text-[15px] text-ink-2 ring-1 ring-ink/[0.06]">
            <Rich text={WHY.language.languages} />
          </p>
        </Reveal>
      </SplitBlock>

      {/* 2. Founder */}
      <Section tone="paper-2" id="founder">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal variant="scale" className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-28 lg:col-span-5 lg:mx-0 lg:self-start">
            <Bezel radius="2.2rem">
              <div className="relative aspect-[4/5]">
                <Image src={founder} alt="Alaa Marzouk" fill placeholder="blur" sizes="(min-width: 1024px) 460px, 90vw" className="object-cover object-[50%_18%]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 pt-28">
                  <div className="font-display text-[2rem] leading-none text-paper">Alaa Marzouk</div>
                  <div className="mt-2 text-[13.5px] text-paper/75">Founder and Senior Immigration Consultant</div>
                </div>
              </div>
            </Bezel>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-leaf-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-leaf-deep">
                <SealCheck weight="fill" className="size-3.5" aria-hidden /> {WHY.founder.badge}
              </span>
            </Reveal>
            <SplitHeading text={WHY.founder.headline} className="mt-6 text-[clamp(2.2rem,4.2vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.04em] text-balance" emClassName="text-ink-3/60" />
            <Reveal delay={120}>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{WHY.founder.bio}</p>
            </Reveal>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {WHY.founder.credentials.map((c, i) => (
                <Reveal as="li" key={c.label} delay={i * 70}>
                  <div className="h-full rounded-[1.4rem] bg-[#fbf9f4] p-5 ring-1 ring-ink/[0.06]">
                    <div className="font-display text-[1.6rem] leading-tight text-leaf-deep">{c.value}</div>
                    <div className="mt-1.5 text-[13px] leading-snug text-ink-3">{c.label}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={160}>
              <p className="mt-8 border-t border-ink/10 pt-6 text-[15.5px] leading-relaxed text-ink-3">{WHY.founder.note}</p>
            </Reveal>
            <Reveal delay={200} className="mt-10">
              <h3 className="text-[13px] font-medium text-ink-3">His own move</h3>
            </Reveal>
            <FounderTimeline className="mt-5" />
            <MissionVision className="mt-10" />
          </div>
        </Container>
      </Section>

      {/* 3. 24/7 */}
      <SplitBlock id="response" eyebrow="03 · 24/7 human response" title={WHY.response.title} tone="ink">
        <Reveal>
          <p className="text-[19px] leading-relaxed text-paper/85">{WHY.response.body}</p>
          <p className="mt-5 text-[15.5px] leading-relaxed text-paper/60">{WHY.response.channels}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.1fr_1fr] md:items-start">
          <Reveal variant="scale">
            <ChatCard dark />
          </Reveal>
          <Reveal delay={120}>
            <ul className="grid grid-cols-2 gap-3">
              {PRESENCE.map((p) => (
                <li key={p.key} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper/50">
                    <LiveDot className="size-1.5" /> {p.country === "United Arab Emirates" ? "Dubai" : p.country}
                  </span>
                  <LiveClock timeZone={p.timeZone} className="mt-2 block font-display text-[1.6rem] text-paper" />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </SplitBlock>

      {/* 4. Presence */}
      <Section id="presence">
        <Container>
          <SectionHeading eyebrow="04 · On the ground" title={WHY.presence.title} intro={WHY.presence.intro} />
          <Reveal variant="scale" className="mt-12">
            <Bezel tone="white" radius="2.2rem">
              <div className="p-6 md:p-10">
                <WorldRoutes />
              </div>
            </Bezel>
          </Reveal>
          <Reveal className="mt-10">
            <DataTable<PresenceRow>
              rows={[...PRESENCE]}
              rowKey={(p) => p.key}
              columns={[
                { key: "country", label: "Country", render: (p) => <span className="font-display text-[1.2rem] text-ink">{p.country}</span> },
                { key: "city", label: "City", render: (p) => <Rich text={p.city} /> },
                { key: "type", label: "Team type", render: (p) => <Rich text={p.type} /> },
                { key: "languages", label: "Languages", render: (p) => <Rich text={p.languages} /> },
              ]}
            />
            <p className="mt-4 text-[14px] text-ink-3">
              <Rich text="{{Add others}}" />
            </p>
          </Reveal>
          <Reveal>
            <p className="mt-10 max-w-3xl font-display text-[1.6rem] leading-snug text-ink-2">{WHY.presence.practice}</p>
          </Reveal>
        </Container>
      </Section>

      {/* 5. Door-to-Door */}
      <Section tone="paper-2" id="door">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow="05 · Door-to-door package" title={WHY.door.title} className="lg:col-span-7" />
            <Reveal className="lg:col-span-5 lg:pb-3">
              <p className="text-[17px] text-ink-3">{WHY.door.intro}</p>
            </Reveal>
          </div>
          <Reveal className="mt-12">
            <DataTable<(typeof DOOR_STAGES)[number]>
              rows={[...DOOR_STAGES]}
              rowKey={(s) => s.stage}
              columns={[
                { key: "stage", label: "Stage", className: "md:w-[26%]", render: (s) => <span className="font-display text-[1.25rem] text-ink">{s.stage}</span> },
                { key: "does", label: "What EAM Global does", wide: true, render: (s) => s.does },
              ]}
            />
          </Reveal>
        </Container>
      </Section>

      {/* 6. Roadmap */}
      <Section id="roadmap">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="06 · Free personal roadmap" title={WHY.roadmap.title} intro={WHY.roadmap.body} />
          </div>
          <Reveal variant="scale" className="lg:col-span-6">
            <RoadmapDoc className="mx-auto max-w-[460px] -rotate-[1deg]" />
          </Reveal>
        </Container>
      </Section>

      {/* 7. Guarantee */}
      <Section tone="ink" id="guarantee">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="ink" dot="sun">
                07 · No Win, No Fee
              </Eyebrow>
            </Reveal>
            <SplitHeading text={WHY.guarantee.title} className="mt-6 text-[clamp(2.2rem,4.2vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white" emClassName="text-white/50" />
            <Reveal delay={120}>
              <p className="mt-6 font-display text-[1.6rem] italic leading-snug text-sun">{WHY.guarantee.promise}</p>
            </Reveal>
            <Reveal delay={200} className="mt-10 max-w-[400px]">
              <GuaranteeReceipt id="why-receipt" />
            </Reveal>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-7">
            {[
              { k: "What is refunded", v: WHY.guarantee.refunded, tone: "leaf" },
              { k: "What is not refunded", v: WHY.guarantee.notRefunded, tone: "muted" },
              { k: "Conditions", v: WHY.guarantee.conditions, tone: "muted" },
            ].map((b, i) => (
              <Reveal key={b.k} delay={i * 90}>
                <div className={cn("rounded-[1.6rem] p-6 ring-1 md:p-8", b.tone === "leaf" ? "bg-leaf-deep ring-white/10" : "bg-white/[0.04] ring-white/10")}>
                  <div className={cn("font-mono text-[10.5px] uppercase tracking-[0.2em]", b.tone === "leaf" ? "text-leaf-soft" : "text-paper/50")}>{b.k}</div>
                  <p className="mt-3 text-[16.5px] leading-relaxed text-paper/85">{b.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
