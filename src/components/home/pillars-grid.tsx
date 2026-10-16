import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ClockCountdown } from "@phosphor-icons/react/dist/ssr/ClockCountdown";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Signature } from "@phosphor-icons/react/dist/ssr/Signature";
import { SuitcaseRolling } from "@phosphor-icons/react/dist/ssr/SuitcaseRolling";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { HOME } from "@/content/home";
import { FOUNDER, PILLARS, type PillarKey } from "@/content/site";
import { AppLink } from "@/components/ui/app-link";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { CountUp } from "@/components/motion/count-up";

const STATS = [
  { value: FOUNDER.years, suffix: "+", label: "years in the field, founder-led" },
  { value: 60, suffix: " min", label: "to a real advisor's reply, any hour" },
  { value: 48, suffix: " h", label: "to your free, written roadmap" },
  { value: 35, suffix: "+", label: "countries with residence routes" },
];

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
export function PillarsGrid() {
  const p = HOME.pillars;
  return (
    <Section tone="paper-2" id="pillars">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={p.eyebrow} title="Seven things the big firms *can't say*" className="lg:col-span-7" />
          <Reveal className="lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{p.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-6 md:grid-cols-4" aria-label="EAM Global in numbers">
          {STATS.map((st, i) => (
            <Reveal as="li" key={st.label} delay={i * 70} className="flex flex-col gap-1.5">
              <CountUp value={st.value} suffix={st.suffix} className="text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-[-0.045em]" />
              <span className="text-[13.5px] leading-snug text-ink-3">{st.label}</span>
            </Reveal>
          ))}
        </ul>

        <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => {
            const Icon = ICONS[pillar.key];
            return (
              <Reveal as="li" key={pillar.key} delay={(i % 4) * 80} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <AppLink
                  href={pillar.href}
                  className="group flex h-full flex-col rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05] transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,27,47,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-full bg-canvas text-ink transition-colors duration-300 group-hover:bg-leaf group-hover:text-white">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-[13px] font-medium text-ink-3">{pillar.n}</span>
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
              <span className="text-[13px] font-medium text-white/75">The difference</span>
              <div>
                <p className="text-[22px] font-medium leading-snug tracking-[-0.03em]">The big firms sell programs. EAM Global sells the whole move.</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">
                  Why EAM Global
                  <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </AppLink>
          </Reveal>
        </ul>
      </Container>
    </Section>
  );
}
