"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { ClosedCaptioning } from "@phosphor-icons/react/dist/csr/ClosedCaptioning";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { Rich, plain } from "@/components/ui/rich";
import { useLiteNetwork } from "@/components/ui/app-link";

const TONES: Record<Testimonial["tone"], string> = {
  navy: "from-[#0e569e] via-[#0a3b70] to-[#0b1b2f]",
  leaf: "from-[#6c9a2a] via-[#3b5f0a] to-[#16260a]",
  sun: "from-[#e7b53c] via-[#b98a1e] to-[#4a3608]",
  clay: "from-[#c97a52] via-[#8d4b2c] to-[#2e170c]",
  ink: "from-[#33465f] via-[#1d2f45] to-[#0b1b2f]",
  lagoon: "from-[#4f9f8f] via-[#2b6c60] to-[#0e2a25]",
};

const initials = (name: string) =>
  plain(name)
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/**
 * Vertical 9:16 video cards. Tap opens the player with sound and captions.
 * Until the video files and caption tracks arrive, the player explains what
 * will appear. Muted 3-second loops start only on fast connections.
 */
export function TestimonialGrid({ items, variant = "home" }: { items: Testimonial[]; variant?: "home" | "library" | "compact" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Testimonial | null>(null);
  const lite = useLiteNetwork();

  const openCard = (t: Testimonial) => {
    setActive(t);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <ul
        className={cn(
          variant === "home"
            ? "no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:scroll-px-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-6"
            : variant === "compact"
              ? "mx-auto grid w-full max-w-[220px] grid-cols-1"
              : items.length === 1
                ? "grid grid-cols-1"
                : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4",
        )}
      >
        {items.map((t, i) => (
          <li
            key={t.id}
            className={cn(variant === "home" && "w-[64vw] shrink-0 snap-start sm:w-[42vw] md:w-auto", variant === "home" && i >= 3 && "hidden md:block")}
            data-reveal=""
            style={{ "--d": i * 70 } as React.CSSProperties}
            suppressHydrationWarning
          >
            <button
              type="button"
              onClick={() => openCard(t)}
              className="group block w-full rounded-[1.6rem] bg-white/[0.04] p-1 text-start ring-1 ring-white/10 transition-transform duration-700 ease-fluid hover:-translate-y-1"
              aria-label={`Play video: ${plain(t.client)}, ${t.program}`}
            >
              <div className={cn("relative aspect-[9/16] overflow-hidden rounded-[calc(1.6rem-0.25rem)] bg-gradient-to-b", TONES[t.tone])}>
                {t.video ? (
                  <Image src={t.video.poster} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
                ) : (
                  <>
                    <div aria-hidden className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:12px_12px]" />
                    <div aria-hidden className="absolute inset-x-0 top-[22%] text-center text-[5rem] font-medium leading-none tracking-[-0.04em] text-white/20">
                      {t.available ? initials(t.client) : t.destinationCode.replace("—", "··")}
                    </div>
                  </>
                )}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/25 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/90">
                    {t.available ? "Video" : "Coming soon"}
                  </span>
                  <span className="rounded-full bg-white/90 px-2 py-1 font-mono text-[9px] font-semibold tracking-[0.1em] text-ink">{t.destinationCode}</span>
                </div>
                <span className="absolute start-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-fluid group-hover:scale-110 rtl:translate-x-1/2">
                  <Play weight="fill" className="ms-0.5 size-5" aria-hidden />
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16 text-white">
                  <div className="text-[14px] font-medium leading-tight">
                    <Rich text={t.client} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
                    {t.program} · <Rich text={t.year} />
                  </div>
                </div>
              </div>
            </button>
            {variant === "library" && (
              <p className="mt-3 px-1 text-[13.5px] leading-snug text-paper/70">
                “<Rich text={t.quote} />”
              </p>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[min(92vw,420px)] rounded-[2rem] bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        {active && (
          <div className="rounded-[2rem] bg-ink p-1.5 ring-1 ring-white/10">
            <div className={cn("relative aspect-[9/16] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-gradient-to-b", TONES[active.tone])}>
              {active.video && (
                <video
                  src={lite ? active.video.srcSm : active.video.src}
                  poster={active.video.poster.src}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 z-[1] size-full bg-ink object-cover"
                  aria-label={`${plain(active.client)}, ${active.program}`}
                />
              )}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="absolute end-3 top-3 z-[2] grid size-10 place-items-center rounded-full bg-black/30 text-white"
                aria-label="Close video"
              >
                <X className="size-5" aria-hidden />
              </button>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                  <ClosedCaptioning className="size-4" aria-hidden /> EN · PT captions
                </span>
                <div className="mt-4 font-display text-[2rem] leading-tight">
                  <Rich text={active.client} />
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75">
                  {active.program} · <Rich text={active.year} /> · {active.place}
                </div>
                <p className="mt-5 text-[14px] leading-relaxed text-white/80">
                  {active.available
                    ? "The founder-and-client video plays here with sound and English and Portuguese captions. The web cut and caption files are in production."
                    : "This video is on the launch list. It will play here with sound and captions once the client's consent and transcript are confirmed."}
                </p>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
