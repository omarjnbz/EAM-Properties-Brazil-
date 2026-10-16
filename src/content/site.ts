/**
 * Site-wide content for the English master (eam-global.com).
 *
 * Inline markup used across all content files:
 *   {{text}}  a placeholder the client must confirm. Rendered highlighted; nothing
 *             in double braces may go live.
 *   *text*    emphasis. In display headings it renders as the lighter second tone.
 */

/**
 * Founder facts used across the site. Years follow the founder's own words in the
 * 2026-10-16 call ("more than 12 years of experience in the field", arrived in
 * Brazil in 2014). The earlier content brief said 16+: confirm before launch.
 */
export const FOUNDER = {
  name: "Alaa Marzouk",
  role: "Founder and Senior Immigration Consultant",
  years: 12,
  yearsLabel: "12+",
  arrivedBrazil: 2014,
  origin: "Egyptian",
  languages: ["Arabic", "English", "Portuguese", "Spanish"],
} as const;

/**
 * New social channels. Set a full URL once each account exists; `null` renders
 * as "coming soon". No Spotify (podcast episodes go to YouTube).
 */
export const SOCIAL: { key: "youtube" | "instagram" | "tiktok"; label: string; url: string | null }[] = [
  { key: "youtube", label: "YouTube", url: null },
  { key: "instagram", label: "Instagram", url: null },
  { key: "tiktok", label: "TikTok", url: null },
];

export const SITE = {
  name: "EAM Global",
  descriptor: "Documents Clearing Services",
  url: "https://www.eam-global.com",
  phoneDisplay: "+971 58 507 8600",
  phoneHref: "tel:+971585078600",
  whatsappDisplay: "+971 56 563 6536",
  whatsappHref:
    "https://wa.me/971565636536?text=Hello%20EAM%20Global%2C%20I%27d%20like%20to%20talk%20to%20an%20advisor.",
  email: "info@eam-global.com",
  emailHref: "mailto:info@eam-global.com",
  headline: "We don't just get you the visa. We get you *home*.",
  subline: "Your move, handled. In your language, on the ground, around the clock.",
  address: "{{Full Dubai address}}, Dubai, United Arab Emirates",
  walkIn: "Walk-in {{Sat–Thu, 9:00–18:00}}; messages answered 24/7",
  licence: "{{number}}",
  founded: "{{year}}",
  cta: {
    roadmap: "Get your free roadmap",
    roadmapShort: "Free Roadmap",
    talk: "Talk to an advisor now",
    talkSuffix: "24/7",
  },
} as const;

/** Offices and local teams. Cities and team types in braces await confirmation. */
export const PRESENCE = [
  {
    key: "dubai",
    country: "United Arab Emirates",
    city: "Dubai",
    type: "Head office",
    languages: "Arabic, English, {{…}}",
    timeZone: "Asia/Dubai",
  },
  {
    key: "saoPaulo",
    country: "Brazil",
    city: "{{São Paulo}}",
    type: "{{Own team / partner}}",
    languages: "Portuguese, English",
    timeZone: "America/Sao_Paulo",
  },
  {
    key: "buenosAires",
    country: "Argentina",
    city: "{{Buenos Aires}}",
    type: "{{Own team / partner}}",
    languages: "Spanish, English",
    timeZone: "America/Argentina/Buenos_Aires",
  },
  {
    key: "asuncion",
    country: "Paraguay",
    city: "{{Asunción}}",
    type: "{{Own team / partner}}",
    languages: "Spanish, English",
    timeZone: "America/Asuncion",
  },
  {
    key: "belgrade",
    country: "Serbia",
    city: "{{Belgrade}}",
    type: "{{Own team / partner}}",
    languages: "Serbian, English",
    timeZone: "Europe/Belgrade",
  },
] as const;

/** The seven USPs: icon, three-word label, one-sentence promise, long form. */
export const PILLARS = [
  {
    n: "01",
    key: "language",
    label: "Speak Your Language",
    promise:
      "Our teams speak Portuguese, Spanish, Arabic, English and the local language of your destination.",
    lead: "We speak your language.",
    body: "Portuguese, Spanish, Arabic, English, and the local language where you are going. You will never sit in a government office guessing.",
    href: "/why-eam-global#language",
  },
  {
    n: "02",
    key: "founder",
    label: "Founder-Led Expertise",
    promise:
      "Alaa Marzouk, 12+ years in global migration and an immigrant to Brazil himself, has guided hundreds of families and investors to approval.",
    lead: "Our founder leads your case.",
    body: "Alaa Marzouk moved to Brazil as an immigrant in 2014, has spent more than 12 years in the field and has personally guided hundreds of families and investors to approval. Your file is reviewed by the person whose name is on the door.",
    href: "/why-eam-global#founder",
  },
  {
    n: "03",
    key: "response",
    label: "24/7 Human Response",
    promise:
      "Message us any hour and a real advisor replies within 60 minutes, not in three working days.",
    lead: "A real person, within 60 minutes, 24/7.",
    body: "WhatsApp, web form, phone or email. Nights, weekends, holidays. Not an auto-reply.",
    href: "/contact",
  },
  {
    n: "04",
    key: "ground",
    label: "On the Ground",
    promise:
      "Local offices and partners in Brazil, Argentina, Paraguay, Serbia and {{list}}, plus Dubai HQ.",
    lead: "We are already there.",
    body: "Local teams in Brazil, Argentina, Paraguay, Serbia and {{list}}. When you land, someone who knows the city meets you.",
    href: "/why-eam-global#presence",
  },
  {
    n: "05",
    key: "door",
    label: "Door-to-Door Package",
    promise:
      "Airport pickup, hotel, paperwork, appointments: one team handles every step of your move.",
    lead: "Door-to-door relocation.",
    body: "From airport pickup to hotel, appointments, translations and the final stamp. One team, one plan, one point of contact, in a package built around your family.",
    href: "/relocation",
  },
  {
    n: "06",
    key: "roadmap",
    label: "Free Personal Roadmap",
    promise:
      "Before you pay anything, you get a written step-by-step plan: documents, timeline, costs.",
    lead: "Your roadmap is free.",
    body: "A consultation built around your case. Before you pay anything, you receive a written plan: every document, every step, the realistic timeline and the full cost.",
    href: "/free-roadmap",
  },
  {
    n: "07",
    key: "guarantee",
    label: "No Win, No Fee",
    promise:
      "If we do not deliver, our professional fees are refunded. Government and third-party charges excluded.",
    lead: "No Win, No Fee.",
    body: "If your application is not approved, our professional fees come back to you. Only government and third-party charges are non-refundable.",
    href: "/why-eam-global#guarantee",
  },
] as const;

export type PillarKey = (typeof PILLARS)[number]["key"];

/** Greetings in the team's languages, used by the language marquee. */
export const GREETINGS = [
  { word: "Olá", lang: "Portuguese", code: "pt" },
  { word: "Hola", lang: "Spanish", code: "es" },
  { word: "مرحبا", lang: "Arabic", code: "ar" },
  { word: "Hello", lang: "English", code: "en" },
  { word: "Zdravo", lang: "Serbian", code: "sr" },
] as const;
