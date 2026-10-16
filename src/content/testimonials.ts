/**
 * Founder-and-client video testimonials. Only the first entry exists today; the
 * other five are the launch targets from the production checklist and stay
 * marked as placeholders until consent, transcripts and caption files arrive.
 */
import type { StaticImageData } from "next/image";
import shamoutPoster from "@/assets/testimonials/shamout-usa-visit-poster.jpg";

export type TestimonialVideo = {
  /** Full quality (576×1024, ~1 Mbps). */
  src: string;
  /** Light version for 2G/3G and Data Saver (360×640, ~0.3 Mbps). */
  srcSm: string;
  /** 4-second silent loop for the preview. */
  loop: string;
  poster: StaticImageData;
  duration: string;
  /** ISO 8601 duration for search engines, e.g. PT1M51S. */
  isoDuration: string;
  /** Date the film was published on the site (replace with the original date if it was posted earlier). */
  uploadDate: string;
  subtitles: string;
  /** BCP 47 language of the spoken audio. */
  inLanguage: string;
};

export type Testimonial = {
  id: string;
  client: string;
  program: string;
  year: string;
  place: string;
  destination: string;
  destinationCode: string;
  language: string;
  quote: string;
  available: boolean;
  tone: "navy" | "leaf" | "sun" | "clay" | "ink" | "lagoon";
  video?: TestimonialVideo;
  /** Service checklist shown beside the film (from the service page it belongs to). */
  service?: string[];
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "shamout-usa-visit",
    client: "Dr. Abdelhalim S. & family",
    program: "USA Visit Visa",
    year: "2026",
    place: "Dubai office",
    destination: "United States",
    destinationCode: "US",
    language: "Arabic",
    quote: "{{Insert translated quote once English transcript is confirmed.}}",
    available: true,
    tone: "navy",
    video: {
      src: "/videos/testimonials/shamout-usa-visit.mp4",
      srcSm: "/videos/testimonials/shamout-usa-visit-sm.mp4",
      loop: "/videos/testimonials/shamout-usa-visit-loop.mp4",
      poster: shamoutPoster,
      duration: "1:51",
      isoDuration: "PT1M51S",
      uploadDate: "2026-10-16",
      subtitles: "Spoken in Arabic, with Arabic subtitles",
      inLanguage: "ar",
    },
    service: [
      "Eligibility check",
      "Document checklist",
      "Forms and appointment",
      "Cover letter and sponsor documents",
      "Interview preparation",
      "Case tracking and passport collection",
    ],
  },
  {
    id: "uae-golden-visa",
    client: "{{Client name}}",
    program: "UAE Golden Visa",
    year: "{{Year}}",
    place: "Dubai office",
    destination: "United Arab Emirates",
    destinationCode: "AE",
    language: "{{Language}}",
    quote: "{{Quote from the video}}",
    available: false,
    tone: "sun",
  },
  {
    id: "brazil-residence",
    client: "{{Client name}}",
    program: "Brazil investor residence",
    year: "{{Year}}",
    place: "Dubai office",
    destination: "Brazil",
    destinationCode: "BR",
    language: "{{Language}}",
    quote: "{{Quote from the video}}",
    available: false,
    tone: "leaf",
  },
  {
    id: "caribbean-passport",
    client: "{{Client name}}",
    program: "Caribbean passport",
    year: "{{Year}}",
    place: "Dubai office",
    destination: "Caribbean",
    destinationCode: "DM",
    language: "{{Language}}",
    quote: "{{Quote from the video}}",
    available: false,
    tone: "lagoon",
  },
  {
    id: "company-formation",
    client: "{{Client name}}",
    program: "Company formation",
    year: "{{Year}}",
    place: "Dubai office",
    destination: "United Arab Emirates",
    destinationCode: "AE",
    language: "{{Language}}",
    quote: "{{Quote from the video}}",
    available: false,
    tone: "clay",
  },
  {
    id: "relocation",
    client: "{{Client name}}",
    program: "Door-to-Door relocation",
    year: "{{Year}}",
    place: "Dubai office",
    destination: "{{Destination}}",
    destinationCode: "—",
    language: "{{Language}}",
    quote: "{{Quote from the video}}",
    available: false,
    tone: "ink",
  },
];
