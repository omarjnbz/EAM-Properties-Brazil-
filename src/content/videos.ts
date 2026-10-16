/**
 * Explainer videos: our own team presenting a program, as opposed to the
 * client films in testimonials.ts. They sit on the destination pages, never
 * under "Real families. Real approvals.".
 */
import brazilPoster from "@/assets/videos/brazil-passport-poster.jpg";
import type { TestimonialVideo } from "./testimonials";

export type Explainer = {
  id: string;
  title: string;
  summary: string;
  destination: string;
  video: TestimonialVideo;
};

export const EXPLAINERS: Explainer[] = [
  {
    id: "brazil-passport",
    title: "The Brazilian passport, explained",
    summary:
      "A short video from our Dubai office, in Arabic: why the Brazilian passport is among the strongest in the world, with visa-free or visa-on-arrival entry to roughly 170 destinations across Europe, the Gulf, Asia and Africa.",
    destination: "Brazil",
    video: {
      src: "/videos/explainers/brazil-passport.mp4",
      srcSm: "/videos/explainers/brazil-passport-sm.mp4",
      loop: "/videos/explainers/brazil-passport-loop.mp4",
      poster: brazilPoster,
      duration: "0:48",
      isoDuration: "PT48S",
      uploadDate: "2026-10-17",
      subtitles: "Spoken in Arabic, with Arabic subtitles",
      inLanguage: "ar",
    },
  },
];
