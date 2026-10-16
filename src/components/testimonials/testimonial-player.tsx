"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import type { TestimonialVideo } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { useLiteNetwork } from "@/components/ui/app-link";

/**
 * A real testimonial video. Fast connections get a silent 4-second preview loop
 * while the card is on screen; one tap plays the full film with sound and
 * controls. On 2G/3G or Data Saver only the poster loads, and the tap streams
 * the light 360p version instead.
 */
export function TestimonialPlayer({ video, label, className, sizes = "(min-width: 1024px) 400px, 90vw" }: { video: TestimonialVideo; label: string; className?: string; sizes?: string }) {
  const [playing, setPlaying] = useState(false);
  const lite = useLiteNetwork();
  const loopRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);

  // Silent preview only on fast networks with motion allowed, and only while visible.
  useEffect(() => {
    const v = loopRef.current;
    if (!v || playing) return;
    if (!document.documentElement.classList.contains("motion")) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [playing]);

  useEffect(() => {
    if (playing) fullRef.current?.play().catch(() => {});
  }, [playing]);

  return (
    <div className={cn("relative aspect-[9/16] overflow-hidden rounded-[28px] bg-ink shadow-[0_40px_80px_-40px_rgba(11,27,47,0.6)]", className)}>
      {playing ? (
        <video
          ref={fullRef}
          src={lite ? video.srcSm : video.src}
          poster={video.poster.src}
          controls
          playsInline
          preload="auto"
          className="absolute inset-0 size-full bg-ink object-cover"
          aria-label={label}
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full text-start" aria-label={`Play video with sound: ${label}`}>
          <Image src={video.poster} alt="" fill placeholder="blur" sizes={sizes} className="object-cover" />
          {!lite && <video ref={loopRef} src={video.loop} muted loop playsInline preload="none" aria-hidden className="absolute inset-0 size-full object-cover" />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="absolute start-1/2 top-1/2 grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-fluid group-hover:scale-110 rtl:translate-x-1/2">
            <Play weight="fill" className="ms-1 size-7" aria-hidden />
          </span>
          <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[12.5px] font-medium backdrop-blur-md">
              <SpeakerHigh weight="fill" className="size-3.5" aria-hidden /> Watch with sound
            </span>
            <span className="rounded-full bg-black/35 px-2.5 py-1.5 text-[12.5px] font-medium tabular-nums backdrop-blur-md">{video.duration}</span>
          </span>
        </button>
      )}
    </div>
  );
}
