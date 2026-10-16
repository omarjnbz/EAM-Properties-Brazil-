import type { ShapeKey } from "@/lib/geo-data";

export const HOME = {
  hero: {
    eyebrow: "Residence · Citizenship · Relocation",
    headline: "We don't just get you the visa. We get you *home*.",
    sub: "Residence, citizenship and relocation handled by people who speak your new country's language and stand beside you on the ground. Dubai HQ. Local teams in Latin America and Europe. A real advisor answers within 60 minutes, any hour.",
    primary: "Get my free roadmap",
    secondary: "Talk to an advisor now",
    trust: ["No Win, No Fee", "24/7 response", "Offices in {{5}} countries"],
  },

  goals: {
    eyebrow: "Start with your goal",
    title: "What are you *planning*?",
    tiles: [
      {
        key: "live",
        heading: "Live abroad",
        line: "Residence permits and golden visas in 35+ countries, from AED 400,000.",
        href: "/residence-by-investment",
        cta: "Residence",
      },
      {
        key: "passport",
        heading: "Hold a second passport",
        line: "Citizenship programs from USD 95,000, with family included.",
        href: "/citizenship-by-investment",
        cta: "Citizenship",
      },
      {
        key: "visit",
        heading: "Visit or travel",
        line: "Tourist and visit visas, legal translations and attestations, done fast.",
        href: "/visit-visas",
        cta: "Visas & Documents",
      },
      {
        key: "business",
        heading: "Build a business",
        line: "Company formation in the UAE and abroad, with bank account support.",
        href: "/company-formation",
        cta: "Business",
      },
    ],
  },

  pillars: {
    eyebrow: "Why families choose EAM Global",
    title: "Seven things the big firms *can't say*",
    intro: "Every migration firm lists the same programs. Here is what changes when you work with us.",
  },

  testimonials: {
    eyebrow: "Watch real clients",
    title: "Real families. Real *approvals*.",
    intro: "Our founder meets clients in person when their visa or permit arrives. These are their words, not ours.",
  },

  destinations: {
    eyebrow: "Featured destinations",
    title: "Where our clients are moving in *2026*",
    brazil: {
      eyebrow: "Local team · Brazil",
      title: "Brazil. Investor residence now, citizenship *later*.",
      line: "Portuguese-speaking advisors from day one.",
      routes: [
        { name: "Investor visa (business)", req: "{{BRL amount}} in a Brazilian company" },
        { name: "Investor visa (real estate)", req: "Property worth {{BRL amount}}, lower in the North and Northeast" },
        { name: "Retiree residence", req: "Monthly pension of {{USD amount}}" },
        { name: "Digital nomad visa", req: "Remote income of {{USD amount}} a month" },
      ],
      cities: [
        { city: "São Paulo", role: "is business" },
        { city: "Rio de Janeiro", role: "is lifestyle" },
        { city: "Florianópolis", role: "is where many newcomers settle" },
      ],
      cityLine: "Pick your city before your visa.",
      team: "Handles CPF registration, Polícia Federal appointment, bank account, and housing.",
      primary: "Explore Brazil",
      secondary: "Get my Brazil roadmap",
    },
    cards: [
      {
        key: "uae" as ShapeKey,
        country: "UAE",
        headline: "Golden Visa from AED 400,000",
        line: "2, 5 or 10-year residence through property. Our home market.",
        badge: "Home office",
        href: "/uae-golden-visa",
        coords: "25.20° N · 55.27° E",
        city: "Dubai",
        tone: "sand",
      },
      {
        key: "argentina" as ShapeKey,
        country: "Argentina",
        headline: "New citizenship program, Q4 2026",
        line: "USD 350,000 contribution route. One of the first firms with a team on the ground.",
        badge: "Local team",
        href: "/citizenship-by-investment/argentina",
        coords: "34.60° S · 58.38° W",
        city: "Buenos Aires",
        tone: "sky",
      },
      {
        key: "paraguay" as ShapeKey,
        country: "Paraguay",
        headline: "Residence from USD 150,000",
        line: "Low cost of living, straightforward process, Spanish-speaking support.",
        badge: "Local team",
        href: "/residence-by-investment#paraguay",
        coords: "25.26° S · 57.58° W",
        city: "Asunción",
        tone: "rose",
      },
      {
        key: "portugal" as ShapeKey,
        country: "Portugal",
        headline: "Golden Visa from EUR 250,000",
        line: "Schengen access with as little as 7 days a year in-country.",
        href: "/residence-by-investment#portugal",
        coords: "38.72° N · 9.14° W",
        city: "Lisbon",
        tone: "azulejo",
      },
      {
        key: "caribbean" as ShapeKey,
        country: "Caribbean",
        headline: "Passports from USD 200,000",
        line: "Five programs, no residence requirement, family included.",
        href: "/citizenship-by-investment#caribbean",
        coords: "15.30° N · 61.39° W",
        city: "Eastern Caribbean",
        tone: "lagoon",
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "From first message to *keys in hand*",
    steps: [
      { title: "Message us.", body: "Any channel, any hour. An advisor replies within 60 minutes.", time: "Within 60 minutes" },
      { title: "Receive your free roadmap.", body: "Within 48 hours you have a written plan with documents, timeline and total cost.", time: "Within 48 hours" },
      { title: "Choose your package.", body: "Pick the level of support you want. Fees are fixed before you pay.", time: "Same day" },
      { title: "We prepare and submit.", body: "Translations, attestations, forms and the government filing, handled by us.", time: "Program dependent" },
      { title: "You arrive. We are waiting.", body: "Airport, hotel, appointments, ID card, bank account, school: our local team is with you.", time: "First month" },
    ],
  },

  door: {
    eyebrow: "Door-to-door relocation",
    title: "The move, not just *the visa*",
    body: "Most firms stop at the approval letter. Our Door-to-Door Package starts there. We collect you at the airport, settle you into your hotel or home, accompany you to every appointment, translate every form, and stay until you are living, not just landed.",
    button: "See what's included",
  },

  founder: {
    eyebrow: "Founder note",
    title: "A word from Alaa Marzouk",
    quote:
      "I started EAM Global because I watched too many families pay for a program and then stand alone in a country where nobody spoke their language. That is not a service. Every client here gets my phone number, my team on the ground, and my promise: if we do not deliver, you do not pay our fee.",
    name: "Alaa Marzouk",
    role: "Founder and Senior Immigration Consultant, EAM Global",
  },

  form: {
    eyebrow: "Free roadmap",
    title: "Get your free step-by-step *roadmap*",
    line: "Tell us where you want to go. Within 48 hours you will have a written plan covering documents, timeline and costs. No payment, no obligation.",
    button: "Send me my roadmap",
  },
};

/** Door-to-Door stages (Why EAM Global, section 5). */
export const DOOR_STAGES = [
  {
    stage: "Before you travel",
    does: "Free roadmap, document checklist, translations and attestations, application filing, flight and hotel booking",
  },
  { stage: "Arrival", does: "Airport pickup, hotel or temporary housing check-in, local SIM card" },
  {
    stage: "First week",
    does: "Accompanied visits: immigration office, biometrics or medical, tax number, bank account",
  },
  {
    stage: "First month",
    does: "Residence card collection, housing search support, school enrolment guidance, driving licence conversion",
  },
  { stage: "After", does: "Renewals, adding family members, next-step citizenship planning" },
] as const;

/** What the written roadmap contains (Free Roadmap page). */
export const ROADMAP_CONTENTS = [
  { section: "Your options", detail: "The two or three programs that fit your goal, with a plain recommendation" },
  { section: "Requirements", detail: "Eligibility rules for your nationality and family situation" },
  { section: "Documents", detail: "Every document, where to obtain it, and which need translation or attestation" },
  { section: "Steps", detail: "Each stage in order, who does it (you, EAM Global, the government)" },
  { section: "Timeline", detail: "Realistic weeks or months per stage, with the factors that speed it up or slow it down" },
  { section: "Costs", detail: "Government fees, third-party costs and EAM Global's fixed fee, shown separately" },
  { section: "Guarantee", detail: "What No Win, No Fee covers for this program" },
] as const;

/**
 * Founder story (homepage "Our founder" and Why EAM Global). DRAFT: written from
 * the outline given on 2026-10-16; dates and specifics in {{braces}} await Alaa
 * Marzouk's confirmation.
 */
export const FOUNDER_STORY = {
  eyebrow: "Our founder",
  title: "He made this move himself, *long before he made it his work.*",
  intro:
    "Alaa Marzouk did not learn migration from a textbook. He lived it, as an Egyptian citizen starting a new life in Brazil, and that is why EAM Global works the way it does.",
  chapters: [
    {
      label: "Arrival",
      when: "{{Year}}",
      title: "An Egyptian citizen, landing in Brazil",
      body: "Alaa arrived in {{city}}, Brazil, with {{what he had when he arrived}}.",
    },
    {
      label: "The hard part",
      when: "{{How long it took}}",
      title: "No language. No map of the process.",
      body: "He didn't speak Portuguese and didn't know how the process worked. Every form, every office and every appointment took far longer than it should have.",
    },
    {
      label: "Learning it",
      when: "",
      title: "One appointment at a time",
      body: "He learned the language and the system the hard way. Today he advises clients in Arabic, English, Portuguese and Spanish.",
    },
    {
      label: "Today",
      when: "16+ years",
      title: "So no family has to stand alone",
      body: "With more than 16 years in global migration, he built EAM Global around everything he once had to work out on his own.",
    },
  ],
  credentials: [
    { value: "16+", label: "years in global migration" },
    { value: "4", label: "languages: Arabic, English, Portuguese, Spanish" },
    { value: "2009", label: "Cairo University, Economics & Political Science" },
  ],
} as const;
