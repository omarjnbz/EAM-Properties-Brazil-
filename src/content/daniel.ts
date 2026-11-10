/**
 * Daniel, EAM Global's AI guide: what he says first on each English-only page.
 *
 * Translated pages (the homepage, contact) take their greeting from the `chat`
 * dictionary instead, so Arabic and Portuguese visitors see their own language.
 * Every page listed here is English-only for now, so English copy is enough.
 *
 * `question` opens the after-hero greeting and the chat; each chip's `label`
 * shows in the greeting, its `q` is what Daniel is asked when it is tapped.
 */
export type DanielTopic = {
  question: string;
  chips: readonly { label: string; q: string }[];
};

export const DANIEL_TOPICS: Record<string, DanielTopic> = {
  "/residence-by-investment": {
    question: "Comparing residence programs? Tell me your budget and I'll narrow it down.",
    chips: [
      { label: "Schengen access", q: "Which residence programs include Schengen?" },
      { label: "Lowest budgets", q: "Which residence programs have the lowest minimum investment?" },
      { label: "No minimum stay", q: "Which residence programs have no minimum stay?" },
    ],
  },
  "/residence-by-investment/brazil": {
    question: "Looking at Brazil? I can walk you through the routes in a minute.",
    chips: [
      { label: "Investor visa", q: "How does the Brazil investor residence route work?" },
      { label: "My family", q: "Can my spouse and children get Brazilian residence with me?" },
      { label: "Citizenship later", q: "How does Brazilian residence lead to citizenship?" },
    ],
  },
  "/citizenship-by-investment": {
    question: "Thinking about a second passport? I can compare them for you.",
    chips: [
      { label: "Most affordable", q: "Which citizenship by investment programs are the most affordable?" },
      { label: "Most visa-free", q: "Which second passports give the most visa-free travel?" },
      { label: "No residence", q: "Which citizenship programs need no residence at all?" },
    ],
  },
  "/citizenship-by-investment/argentina": {
    question: "Curious about Argentina's new program? Ask me what's known so far.",
    chips: [
      { label: "The new program", q: "How will Argentina's citizenship by investment program work?" },
      { label: "Residence first", q: "Can I get residence in Argentina before the citizenship program opens?" },
      { label: "Visa-free travel", q: "How many countries can I visit visa-free with an Argentine passport?" },
    ],
  },
  "/uae-golden-visa": {
    question: "Planning a UAE Golden Visa? I can tell you which route fits your property.",
    chips: [
      { label: "AED 400,000 route", q: "What do I get with the AED 400,000 UAE Golden Visa route?" },
      { label: "10-year visa", q: "How do I qualify for the 10-year UAE Golden Visa?" },
      { label: "My family", q: "Can my family join me on a UAE Golden Visa?" },
    ],
  },
  "/visit-visas": {
    question: "Need a visit visa? Tell me where, and I'll tell you what we prepare.",
    chips: [
      { label: "USA", q: "How do you help with a US visit visa?" },
      { label: "Schengen", q: "How do you help with a Schengen visit visa?" },
      { label: "UK", q: "How do you help with a UK visit visa?" },
    ],
  },
  "/refused-visa": {
    question: "Refused before? Tell me what happened. Many of our approvals started there.",
    chips: [
      { label: "Why was I refused?", q: "How do you find out why my visa was refused?" },
      { label: "Reapply", q: "How do you help me reapply after a refusal?" },
      { label: "Which passport?", q: "Do you help people with any passport after a refusal?" },
    ],
  },
  "/company-formation": {
    question: "Starting a company? I can explain mainland, free zone and offshore.",
    chips: [
      { label: "Mainland or free zone", q: "What's the difference between a UAE mainland and a free zone company?" },
      { label: "Abroad", q: "Can you set up a company for me outside the UAE?" },
      { label: "Residence too", q: "Does a company give me residence?" },
    ],
  },
  "/relocation": {
    question: "Moving the whole family? I can show you what door-to-door covers.",
    chips: [
      { label: "What's included", q: "What does the door-to-door relocation package include?" },
      { label: "Schools and housing", q: "Do you help with housing and schools when we arrive?" },
      { label: "Pricing", q: "How is door-to-door relocation priced?" },
    ],
  },
  "/legal-translation-attestation": {
    question: "Got documents to translate or attest? Tell me which ones.",
    chips: [
      { label: "Attestation", q: "How does document attestation work?" },
      { label: "Legal translation", q: "Which documents do you translate?" },
      { label: "How long", q: "How long do translation and attestation take?" },
    ],
  },
  "/free-roadmap": {
    question: "Questions before you send the form? Ask me first.",
    chips: [
      { label: "What's in it", q: "What will my free roadmap include?" },
      { label: "Is it really free", q: "Is the roadmap really free, with no obligation?" },
      { label: "How fast", q: "How fast will I get my roadmap?" },
    ],
  },
  "/faq": {
    question: "Didn't find your question? Ask me in your own words.",
    chips: [
      { label: "No Win, No Fee", q: "What does No Win, No Fee cover?" },
      { label: "Response time", q: "How fast does a real advisor reply?" },
      { label: "How to start", q: "How do I start with EAM Global?" },
    ],
  },
  "/how-it-works": {
    question: "Want the steps for your own case? I can map them out.",
    chips: [
      { label: "First step", q: "What happens in the first step?" },
      { label: "Timeline", q: "How long does the whole process take?" },
      { label: "Paying", q: "When do I pay anything?" },
    ],
  },
  "/why-eam-global": {
    question: "Wondering why families choose EAM Global? Ask me anything.",
    chips: [
      { label: "The founder", q: "Who is Alaa Marzouk?" },
      { label: "The guarantee", q: "What does No Win, No Fee cover?" },
      { label: "Local teams", q: "Where do you have local teams?" },
    ],
  },
  "/testimonials": {
    question: "Seen a story like yours? I can tell you how we handled it.",
    chips: [
      { label: "Visit visas", q: "How did you help the family in the US visit visa story?" },
      { label: "Refused before", q: "Can you help me if I was refused before?" },
      { label: "Start", q: "How do I start with EAM Global?" },
    ],
  },
  "/guides": {
    question: "Reading a guide? I can answer what it doesn't cover.",
    chips: [
      { label: "Brazil", q: "Can I get residence in Brazil?" },
      { label: "Argentina", q: "How will Argentina's citizenship by investment program work?" },
      { label: "Free roadmap", q: "What will my free roadmap include?" },
    ],
  },
};

/** Guide sub-pages share the guides topic. */
export function danielTopic(path: string): DanielTopic | null {
  const clean = path.replace(/\/+$/, "") || "/";
  return DANIEL_TOPICS[clean] ?? (clean.startsWith("/guides/") ? DANIEL_TOPICS["/guides"] : null);
}

/** Pages where Daniel never pops up on his own: forms that convert, and print layouts. */
export function danielQuietPage(path: string) {
  return path === "/free-roadmap" || path.endsWith("/print");
}

/**
 * English values for the "Plan my move" answers, for the lead sent to the
 * team. They match what the roadmap form submits, whatever the page language.
 */
export const PLAN_VALUES: Record<string, Record<string, string>> = {
  goal: { live: "live", passport: "passport", visit: "visit", business: "business", refused: "refused" },
  destination: {
    brazil: "brazil",
    uae: "uae",
    portugal: "portugal",
    argentina: "argentina",
    caribbean: "caribbean",
    europe: "Europe (other)",
    unsure: "Not sure yet",
  },
  budget: {
    b1: "Under USD 100,000",
    b2: "USD 100,000 – 250,000",
    b3: "USD 250,000 – 500,000",
    b4: "USD 500,000 – 1M",
    b5: "Over USD 1M",
    b6: "Not sure yet",
  },
  family: { "1": "1", "2": "2", "3-4": "3-4", "5+": "5+" },
  timeline: { "3m": "Within 3 months", "6m": "In 3 to 6 months", "12m": "In 6 to 12 months", exploring: "Just exploring" },
};
