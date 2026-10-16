"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import houseWindows from "@/assets/stock/brazil-house-windows.jpg";
import passports from "@/assets/stock/passports-hands.jpg";
import stamps from "@/assets/stock/passport-stamps.jpg";
import dubaiNight from "@/assets/stock/dubai-night.jpg";
import planning from "@/assets/stock/travel-planning.jpg";
import { HOME } from "@/content/home";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";

type Goal = { key: string; title: string; line: string; image: StaticImageData; alt: string; tags: string[]; href: string; cta: string };

const tiles = HOME.goals.tiles;

const GOALS: Goal[] = [
  {
    key: "live",
    title: tiles[0].heading,
    line: tiles[0].line,
    image: houseWindows,
    alt: "A modern house with large windows and palm trees in Bahia, Brazil",
    tags: ["UAE Golden Visa", "Brazil investor visa", "Portugal", "Greece", "Paraguay"],
    href: tiles[0].href,
    cta: "Residence by Investment",
  },
  {
    key: "passport",
    title: tiles[1].heading,
    line: tiles[1].line,
    image: passports,
    alt: "Travellers holding passports from different countries",
    tags: ["Argentina · new 2026", "Dominica", "Grenada", "St. Kitts and Nevis", "Türkiye"],
    href: tiles[1].href,
    cta: "Citizenship by Investment",
  },
  {
    key: "visit",
    title: tiles[2].heading,
    line: tiles[2].line,
    image: stamps,
    alt: "An open passport with entry stamps",
    tags: ["USA", "UK", "Schengen", "Canada", "Australia", "UAE"],
    href: tiles[2].href,
    cta: "Visas & Documents",
  },
  {
    key: "business",
    title: tiles[3].heading,
    line: tiles[3].line,
    image: dubaiNight,
    alt: "Downtown Dubai at night",
    tags: ["UAE mainland", "Free zone", "Offshore", "Serbia", "Paraguay", "Brazil"],
    href: tiles[3].href,
    cta: "Company Formation",
  },
  {
    key: "relocate",
    title: "Move door to door",
    line: "Airport pickup, hotel, paperwork, appointments: one team handles every step of your move.",
    image: planning,
    alt: "A map, camera and passport laid out for a trip",
    tags: ["Airport pickup", "Housing", "Appointments", "Bank account", "Schools"],
    href: "/relocation",
    cta: "Door-to-Door Relocation",
  },
];

/**
 * "What are you planning?" as an accordion. Several rows can be open; the
 * picture beside the list follows the row opened last.
 */
export function GoalsAccordion() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(["live"]));
  const [active, setActive] = useState("live");

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    if (!open.has(key)) setActive(key);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <ul className="flex flex-col gap-2.5 lg:col-span-7">
        {GOALS.map((g, i) => {
          const isOpen = open.has(g.key);
          const panelId = `goal-panel-${g.key}`;
          return (
            <li
              key={g.key}
              data-reveal=""
              suppressHydrationWarning
              style={{ "--d": i * 70 } as React.CSSProperties}
              className={cn("rounded-[22px] bg-white shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 transition-[box-shadow] duration-500", isOpen ? "ring-ink/[0.09]" : "ring-ink/[0.05]")}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(g.key)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-start md:px-6"
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-medium transition-colors duration-300", isOpen ? "bg-ink text-white" : "bg-canvas text-ink-2")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[clamp(1.2rem,2vw,1.5rem)] font-medium tracking-[-0.03em]">{g.title}</span>
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-canvas transition-transform duration-500 ease-fluid", isOpen && "rotate-45")}>
                    <Plus weight="bold" className="size-4" aria-hidden />
                  </span>
                </button>
              </h3>
              <div id={panelId} className={cn("grid transition-[grid-template-rows] duration-500 ease-fluid", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className={cn("px-5 pb-6 transition-[opacity,filter,transform] duration-500 ease-fluid md:ps-[4.75rem] md:pe-6", isOpen ? "opacity-100 blur-0" : "-translate-y-1 opacity-0 blur-sm")}>
                    <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-2xl lg:hidden">
                      <Image src={g.image} alt={g.alt} fill placeholder="blur" sizes="100vw" className="object-cover" />
                    </div>
                    <p className="max-w-lg text-[15.5px] leading-relaxed text-ink-3">{g.line}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {g.tags.map((t) => (
                        <li key={t} className="rounded-full bg-canvas px-3 py-1.5 text-[12.5px] text-ink-2">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <AppLink href={g.href} className="group mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-medium">
                      {g.cta}
                      <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </AppLink>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2" data-reveal="scale" suppressHydrationWarning>
          {GOALS.map((g) => (
            <Image
              key={g.key}
              src={g.image}
              alt={g.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 460px, 0px"
              className={cn("object-cover transition-[opacity,transform,filter] duration-700 ease-fluid", active === g.key ? "scale-100 opacity-100 blur-0" : "scale-[1.04] opacity-0 blur-sm")}
            />
          ))}
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-[13.5px] font-medium backdrop-blur-md">
            {GOALS.find((g) => g.key === active)?.cta}
          </div>
        </div>
      </div>
    </div>
  );
}
