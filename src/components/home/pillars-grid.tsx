import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ClockCountdown } from "@phosphor-icons/react/dist/ssr/ClockCountdown";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Signature } from "@phosphor-icons/react/dist/ssr/Signature";
import { SuitcaseRolling } from "@phosphor-icons/react/dist/ssr/SuitcaseRolling";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { FOUNDER, PILLARS, type PillarKey } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { AppLink } from "@/components/ui/app-link";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { CountUp } from "@/components/motion/count-up";

/** The numbers behind the stats row; their labels come from the page's language. */
const STAT_VALUES = [FOUNDER.years, 60, 48, 35];

const HREFS = Object.fromEntries(PILLARS.map((p) => [p.key, p.href])) as Record<PillarKey, string>;

const ICONS: Record<PillarKey, typeof Translate> = {
  language: Translate,
  founder: Signature,
  response: ClockCountdown,
  ground: MapPin,
  door: SuitcaseRolling,
  roadmap: FileText,
  guarantee: ShieldCheck,
};

/** The seven USPs, each as a card that links to its full explanation. */
export async function PillarsGrid() {
  const p = (await getDictionary()).home.pillars;
  return (
    <Section tone="paper-2" id="pillars">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} className="lg:col-span-7" />
          <Reveal className="lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{p.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-6 md:grid-cols-4" aria-label={p.statsAria}>
          {p.stats.map((st, i) => (
            <Reveal as="li" key={st.label} delay={i * 70} className="flex flex-col gap-1.5">
              <CountUp value={STAT_VALUES[i]} suffix={st.suffix} className="text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-[-0.045em]" />
              <span className="text-[13.5px] leading-snug text-ink-3">{st.label}</span>
            </Reveal>
          ))}
        </ul>

        <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {p.items.map((pillar, i) => {
            const Icon = ICONS[pillar.key];
            return (
              <Reveal as="li" key={pillar.key} delay={(i % 4) * 80} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <AppLink
                  href={HREFS[pillar.key]}
                  className="group flex h-full flex-col rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,27,47,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-canvas text-ink transition-colors duration-300 group-hover:bg-leaf group-hover:text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-[13px] font-medium text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-8 text-[19px] font-semibold leading-snug tracking-[-0.025em]">{pillar.label}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">
                    <span className="text-ink-2">{pillar.lead}</span> <Rich text={pillar.body} />
                  </p>
                </AppLink>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={240} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <AppLink
              href="/why-eam-global"
              className="group flex h-full min-h-[240px] flex-col justify-between rounded-[22px] bg-leaf p-6 text-white transition-[transform,background-color] duration-500 ease-fluid hover:-translate-y-1 hover:bg-leaf-deep"
            >
              <span className="text-[13px] font-medium text-white/75">{p.differenceEyebrow}</span>
              <div>
                <p className="text-[22px] font-medium leading-snug tracking-[-0.03em]">{p.differenceText}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">
                  {p.differenceCta}
                  <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                </span>
              </div>
            </AppLink>
          </Reveal>
        </ul>
      </Container>
    </Section>
  );
}
