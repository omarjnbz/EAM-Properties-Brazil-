import Image from "next/image";
import brazilHouse from "@/assets/stock/brazil-house-lawn.jpg";
import { HOME } from "@/content/home";
import { Badge, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";

/** Brazil, featured: the four routes beside a property photo. */
export function BrazilSpotlight() {
  const b = HOME.destinations.brazil;
  return (
    <Reveal variant="scale">
      <div className="grid overflow-hidden rounded-[28px] bg-ink text-white lg:grid-cols-12">
        <div className="relative min-h-[320px] lg:col-span-5">
          <Image src={brazilHouse} alt="A modern house with palm trees in Bahia, Brazil" fill placeholder="blur" sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          <div className="absolute start-4 top-4">
            <Badge tone="light">Local team · São Paulo</Badge>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <span className="text-[13px] font-medium text-white/60">Brazil · Residence by investment</span>
          <h3 className="mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            Investor residence now, <span className="text-white/55">citizenship later.</span>
          </h3>
          <p className="mt-3 text-[16px] text-white/70">{b.line}</p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {b.routes.map((r) => (
              <li key={r.name} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                <div className="text-[14.5px] font-medium">{r.name}</div>
                <div className="mt-1 text-[13px] leading-snug text-white/60">
                  <Rich text={r.req} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/residence-by-investment/brazil" variant="paper">
              {b.primary}
            </Button>
            <Button href="/free-roadmap?destination=brazil" variant="ghost-light">
              {b.secondary}
            </Button>
          </div>
          <p className="mt-6 text-[12.5px] text-white/45">Brazil grants residence first; citizenship follows naturalisation after a period of residence.</p>
        </div>
      </div>
    </Reveal>
  );
}
