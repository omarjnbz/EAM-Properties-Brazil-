"use client";

/* eslint-disable @next/next/no-img-element -- YouTube thumbnails are external; a plain lazy <img> avoids configuring the image optimiser for them */
import { useState } from "react";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import type { Episode } from "@/content/podcast";

/**
 * Click-to-play YouTube episode. Only a small thumbnail loads until the visitor
 * taps play; the privacy-friendly youtube-nocookie player loads after that.
 */
export function EpisodeCard({ episode }: { episode: Episode }) {
  const [playing, setPlaying] = useState(false);
  const id = encodeURIComponent(episode.youtubeId);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-ink/[0.05]">
      <div className="relative aspect-video bg-ink">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full" aria-label={`Play episode: ${episode.title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
            <span aria-hidden className="absolute inset-0 bg-ink/25" />
            <span className="absolute start-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink transition-transform duration-500 ease-fluid group-hover:scale-110 rtl:translate-x-1/2">
              <Play weight="fill" className="ms-1 size-6" aria-hidden />
            </span>
            <span className="absolute bottom-3 end-3 rounded-full bg-black/50 px-2.5 py-1 text-[12px] font-medium text-white">{episode.duration}</span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="text-[12.5px] text-ink-3">{episode.date}</div>
        <h3 className="mt-1.5 text-[18px] font-semibold leading-snug tracking-[-0.025em]">{episode.title}</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{episode.summary}</p>
      </div>
    </article>
  );
}
