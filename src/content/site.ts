/**
 * Site-wide content for the English master (eam-global.com).
 *
 * Inline markup used across all content files:
 *   {{text}}  a placeholder the client must confirm. Rendered highlighted; nothing
 *             in double braces may go live.
 *   *text*    emphasis. In display headings it renders as the lighter second tone.
 */

/**
 * Founder facts used across the site. The client confirmed "+17 years of
 * experience" in November 2026 (the 2026-10-16 call said 12+, the first brief
 * 16+). He arrived in Brazil in 2014.
 */
export const FOUNDER = {
  name: "Alaa Marzouk",
  role: "Founder and Senior Immigration Consultant",
  years: 17,
  yearsLabel: "17+",
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

/**
 * The site's public address, used for share images, canonical links, the sitemap
 * and search data. Fixed rather than taken from Vercel's production domain: that
 * picks the shortest custom domain (the bare eam-global.lat, which redirects) or
 * the vercel.app address, and both made canonical links point at the wrong place.
 * Previews keep pointing at the live site, which is what search engines should see.
 * NEXT_PUBLIC_SITE_URL overrides it (no trailing slash), e.g. after a domain move.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.eam-global.lat").replace(/\/+$/, "");

export const SITE = {
  name: "EAM Global",
  descriptor: "Documents Clearing Services",
  url: SITE_URL,
  phoneDisplay: "+55 11 98209-5635",
  phoneHref: "tel:+5511982095635",
  whatsappDisplay: "+55 11 98209-5635",
  whatsappHref:
    "https://wa.me/5511982095635?text=Hello%20EAM%20Global%2C%20I%27d%20like%20to%20talk%20to%20an%20advisor.",
  email: "info@eam-global.com",
  emailHref: "mailto:info@eam-global.com",
  headline: "We don't just get you the visa. We get you *home*.",
  subline: "Your move, handled. In your language, on the ground, around the clock.",
  address: "{{Full Dubai address}}, Dubai, United Arab Emirates",
  walkIn: "Walk-in {{Sat–Thu, 9:00–18:00}}; messages answered 24/7",
  licence: "{{number}}",
  /** Brazilian company number (CNPJ) of Alaa Marzouk's company, confirmed by the client November 2026 and listed in the public registry. */
  cnpj: "70.030.039/0001-37",
  /** Google Calendar booking page for a video call with the founder (see BOOKING). */
  bookingHref:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2F0InAFBREl7f4jz7bycNADljI1aNdfK_s95kZ4R8e07GUsh4SWLSItrd7ZBa2hA7irsKlHxJj",
  founded: "{{year}}",
  cta: {
    roadmap: "Get your free roadmap",
    roadmapShort: "Free Roadmap",
    talk: "Talk to an advisor now",
    talkSuffix: "24/7",
  },
} as const;

/**
 * The Brazilian company registration, from the Receita Federal registration
 * card (Comprovante de Inscrição, issued 10 Nov 2026). For the chat assistant;
 * the site itself shows only the CNPJ. The registered street address and the
 * personal email and phone on the card are deliberately left out.
 */
export const BRAZIL_COMPANY = {
  cnpj: SITE.cnpj,
  registry: "Receita Federal (Cadastro Nacional da Pessoa Jurídica)",
  form: "sole proprietorship (empresário individual) in the name of the founder, Alaa Marzouk; head office registration (matriz)",
  city: "São Paulo, SP",
  status: "active",
  opened: "8 November 2026",
  activities: [
    "travel agency (main activity)",
    "tour operator",
    "tourism bookings and other tourism services",
    "sales promotion",
    "language teaching",
    "organising fairs, conferences and events",
  ],
} as const;

/**
 * The paid video consultation with the founder, booked on his Google Calendar
 * appointment page (no payment on the site: the team sends payment details after
 * booking). It is NOT free; the free offer is the written roadmap.
 * `price` is a stand-in the client asked for until the real fee is set.
 */
export const BOOKING = {
  href: SITE.bookingHref,
  /** The same page in Google's embeddable form. */
  embedHref: `${SITE.bookingHref}?gv=true`,
  minutes: 30,
  price: "USD 100",
  with: FOUNDER.name,
  via: "Google Meet",
  /**
   * When the site's own booking calendar offers slots (src/lib/booking). Copied
   * from the founder's Google appointment page: Monday to Saturday, first call
   * 10:00 and last call 17:00, Dubai time. Busy times in his calendar are removed.
   */
  schedule: {
    timeZone: "Asia/Dubai",
    /** Dubai has no daylight saving time, so its offset from UTC never changes. */
    utcOffsetHours: 4,
    /** 0 = Sunday … 6 = Saturday. */
    days: [1, 2, 3, 4, 5, 6],
    firstStart: "10:00",
    lastStart: "17:00",
    /** Earliest bookable slot, counted from now. */
    minNoticeHours: 4,
    /** How far ahead visitors can book. */
    horizonDays: 30,
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
      "Alaa Marzouk, 17+ years in global migration and an immigrant to Brazil himself, has guided hundreds of families and investors to approval.",
    lead: "Our founder leads your case.",
    body: "Alaa Marzouk moved to Brazil as an immigrant in 2014, has spent more than 17 years in the field and has personally guided hundreds of families and investors to approval. Your file is reviewed by the person whose name is on the door.",
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
