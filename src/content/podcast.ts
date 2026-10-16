/**
 * The EAM Global podcast. Episodes are published on YouTube (no Spotify, per the
 * 2026-10-16 call). Add an episode with its YouTube video ID and it appears on
 * /podcast with a click-to-play preview, so nothing loads from YouTube until a
 * visitor taps play.
 */
export type Episode = {
  /** YouTube video ID, e.g. the part after `v=` in the watch URL. */
  youtubeId: string;
  title: string;
  date: string;
  duration: string;
  summary: string;
};

export const PODCAST = {
  name: "{{Podcast name}}",
  eyebrow: "Podcast",
  headline: "Real moves, real families, *in our own words.*",
  intro:
    "Conversations about residence, citizenship and starting over abroad: the questions families ask us, the stories behind their approvals, and what nobody tells you before you land.",
  episodes: [] as Episode[],
  /** Draft episode ideas shown until the first episode is published. */
  topics: [
    { title: "Landing in Brazil without Portuguese", line: "Alaa Marzouk on his own move in 2014, and what he would do differently." },
    { title: "Refused once: how to reapply the right way", line: "Why files get refused, and how a stronger second application is built." },
    { title: "Argentina's new citizenship program", line: "The two routes, the checks, and who it suits." },
    { title: "The UAE Golden Visa through property", line: "2, 5 or 10 years: which route fits your age and budget." },
  ],
};
