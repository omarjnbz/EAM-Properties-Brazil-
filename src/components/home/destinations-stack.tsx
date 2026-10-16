import Image, { type StaticImageData } from "next/image";
import brazilHouse from "@/assets/stock/brazil-house-stone.jpg";
import dubai from "@/assets/stock/dubai-orange.jpg";
import buenosAires from "@/assets/stock/buenos-aires-obelisco.jpg";
import asuncion from "@/assets/stock/asuncion-drone-2.jpg";
import lisbon from "@/assets/stock/lisbon-cathedral.jpg";
import caribbean from "@/assets/stock/caribbean-island.jpg";
import { HOME } from "@/content/home";
import { Badge, Button, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";

type Destination = {
  key: string;
  country: string;
  headline: string;
  line: string;
  image: StaticImageData;
  position?: string;
  meta: [string, string][];
  href: string;
  badge?: string;
};

const cards = HOME.destinations.cards;

const DESTINATIONS: Destination[] = [
  {
    key: "brazil",
    country: "Brazil",
    headline: "Investor residence, pathway to citizenship",
    line: HOME.destinations.brazil.line,
    image: brazilHouse,
    meta: [
      ["Minimum", "{{BRL amount}}"],
      ["Route", "Residence, then naturalisation"],
      ["Team", "São Paulo"],
    ],
    href: "/residence-by-investment/brazil",
    badge: "Local team",
  },
  {
    key: "uae",
    country: "United Arab Emirates",
    headline: cards[0].headline,
    line: cards[0].line,
    image: dubai,
    meta: [
      ["Minimum", "AED 400,000"],
      ["Visa length", "2, 5 or 10 years"],
      ["Team", "Dubai head office"],
    ],
    href: cards[0].href,
    badge: "Home office",
  },
  {
    key: "argentina",
    country: "Argentina",
    headline: cards[1].headline,
    line: cards[1].line,
    image: buenosAires,
    position: "50% 30%",
    meta: [
      ["Contribution", "USD 350,000"],
      ["Opens", "Q4 2026"],
      ["Team", "Buenos Aires"],
    ],
    href: cards[1].href,
    badge: "New 2026",
  },
  {
    key: "paraguay",
    country: "Paraguay",
    headline: cards[2].headline,
    line: cards[2].line,
    image: asuncion,
    meta: [
      ["Minimum", "USD 150,000"],
      ["Rights", "Live, work, study"],
      ["Team", "Asunción"],
    ],
    href: cards[2].href,
    badge: "Local team",
  },
  {
    key: "portugal",
    country: "Portugal",
    headline: cards[3].headline,
    line: cards[3].line,
    image: lisbon,
    meta: [
      ["Minimum", "EUR 250,000"],
      ["Schengen", "Yes"],
      ["In-country", "About 7 days a year"],
    ],
    href: cards[3].href,
  },
  {
    key: "caribbean",
    country: "Caribbean",
    headline: cards[4].headline,
    line: cards[4].line,
    image: caribbean,
    meta: [
      ["Minimum", "USD 200,000"],
      ["Programs", "Five"],
      ["Family", "Included"],
    ],
    href: cards[4].href,
  },
];

/** Destinations as full-bleed cards that stack on top of each other while scrolling. */
export function DestinationsStack() {
  return (
    <section id="destinations" className="bg-canvas py-20 md:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow="Featured destinations" title="Where our clients are moving *in 2026*" className="lg:col-span-7" />
          <Reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">
              Six destinations, four with our own people on the ground. Minimum amounts as publicly listed in October 2026; your free roadmap confirms the current figure.
            </p>
            <Button href="/residence-by-investment" variant="ink">
              Compare every program
            </Button>
          </Reveal>
        </div>

        <ul data-stack className="mt-12 flex flex-col gap-[14svh] md:mt-16">
          {DESTINATIONS.map((dst, i) => (
            <li key={dst.key} data-stack-card className="sticky" style={{ top: `calc(5.75rem + ${i * 14}px)` }}>
              <article suppressHydrationWarning className="relative isolate flex h-[min(76svh,620px)] min-h-[520px] origin-top flex-col justify-end overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_30px_80px_-40px_rgba(11,27,47,0.6)]">
                <Image
                  src={dst.image}
                  alt={`${dst.country}`}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1280px) 1176px, 100vw"
                  className="-z-10 object-cover"
                  style={{ objectPosition: dst.position ?? "50% 50%" }}
                />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
                <div aria-hidden className="absolute inset-y-0 start-0 -z-10 w-3/4 bg-gradient-to-r from-ink/55 to-transparent" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between md:inset-x-8 md:top-7">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-medium ring-1 ring-white/20 backdrop-blur-md">
                    {String(i + 1).padStart(2, "0")} · {dst.country}
                  </span>
                  {dst.badge && <Badge tone={dst.badge === "New 2026" ? "sun" : "light"}>{dst.badge}</Badge>}
                </div>

                <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <h3 className="text-[clamp(1.9rem,3.8vw,3.1rem)] font-medium leading-[1.04] tracking-[-0.04em] text-balance">{dst.headline}</h3>
                    <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-white/75">{dst.line}</p>
                    <div className="mt-6">
                      <Button href={dst.href} variant="paper">
                        Explore {dst.country === "United Arab Emirates" ? "the UAE" : dst.country}
                      </Button>
                    </div>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 lg:col-span-5">
                    {dst.meta.map(([k, v]) => (
                      <div key={k} className="rounded-2xl bg-white/12 p-2.5 ring-1 ring-white/15 backdrop-blur-md sm:p-3.5">
                        <dt className="text-[11px] text-white/60 sm:text-[11.5px]">{k}</dt>
                        <dd className="mt-1 text-[12.5px] font-medium leading-snug sm:text-[14px]">
                          <Rich text={v} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
