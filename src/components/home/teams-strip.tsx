import { PRESENCE } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";

/** Where the teams are, with their local time: proof that someone is always awake. */
export function TeamsStrip() {
  return (
    <section aria-label="Our offices and local teams" className="bg-canvas py-10 md:py-14">
      <Container className="grid items-center gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <p className="max-w-[16rem] text-[13px] font-medium uppercase leading-snug tracking-[0.06em] text-ink-3">On the ground where you are going, from Dubai to Belgrade</p>
        </Reveal>
        <ul className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 lg:col-span-9 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {PRESENCE.map((p, i) => (
            <Reveal as="li" key={p.key} delay={i * 70} className="shrink-0">
              <div className="flex h-full min-w-[168px] flex-col justify-between gap-5 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold tracking-[-0.02em]">
                    <Rich text={p.city} />
                  </span>
                  <LiveDot className="size-1.5" color={p.key === "dubai" ? "bg-sun" : "bg-leaf"} />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <span className={cn("text-[12px] leading-tight text-ink-3")}>{p.key === "dubai" ? "Head office" : p.country}</span>
                  <LiveClock timeZone={p.timeZone} className="text-[13px] font-medium text-ink-2" />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
