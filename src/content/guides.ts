/**
 * Free country guides (the newsletter lead magnet from the 2026-10-16 call).
 * Visitors leave name, email, contact number and job, then download the PDF.
 *
 * The PDFs are printed from /guides/<country>/print by `npm run guides:pdf`.
 * Facts are reused from the country pages so the site and the guides never
 * disagree; anything in {{braces}} still needs the client's confirmation.
 */
import { ARGENTINA, BRAZIL, CITIZENSHIP } from "./pages";

export type GuideKey = "brazil" | "argentina";

export type GuideSection =
  | { kind: "text"; title: string; paragraphs: readonly string[] }
  | { kind: "routes"; title: string; intro?: string; rows: readonly { route: string; requirement: string; outcome: string }[]; note?: string }
  | { kind: "steps"; title: string; intro?: string; steps: readonly { title: string; time?: string; body?: string }[] }
  | { kind: "checklist"; title: string; intro?: string; items: readonly string[]; note?: string }
  | { kind: "cities"; title: string; intro?: string; cities: readonly { name: string; line: string }[]; note?: string }
  | { kind: "costs"; title: string; intro?: string; rows: readonly { label: string; value: string }[] };

export type Guide = {
  key: GuideKey;
  country: string;
  title: string;
  edition: string;
  summary: string;
  pdf: string;
  fileName: string;
  team: string;
  sections: readonly GuideSection[];
};

const DOCS_NOTE = "Your free roadmap confirms the exact list for your nationality, family and route.";

export const GUIDES: Record<GuideKey, Guide> = {
  brazil: {
    key: "brazil",
    country: "Brazil",
    title: "Moving to Brazil",
    edition: "The EAM Global guide · 2026",
    summary: "From your visa to your first month: the routes, the documents, your arrival and choosing your city.",
    pdf: "/guides/eam-global-brazil-guide-2026.pdf",
    fileName: "EAM-Global-Brazil-Guide-2026.pdf",
    team: "Portuguese-speaking team from day one",
    sections: [
      {
        kind: "text",
        title: "Is Brazil right for you?",
        paragraphs: [
          "Brazil is a continent-sized country. São Paulo is business, Rio is lifestyle, and Florianópolis is where many newcomers settle. International schools and private hospitals are excellent in the large cities.",
          "Portuguese is spoken almost exclusively, and English is rare outside tourist areas. It is the first thing most newcomers underestimate, often from the moment they land at the airport.",
          "Brazil does not sell citizenship. It grants residence to investors and others, and citizenship follows naturalisation after a period of residence.",
        ],
      },
      {
        kind: "routes",
        title: "Your visa options",
        intro: "Four ways to live in Brazil legally. Thresholds change, so our Brazil team confirms the current figures in your roadmap.",
        rows: BRAZIL.routes,
      },
      {
        kind: "steps",
        title: "Step by step",
        intro: "From your first message to your residence card.",
        steps: BRAZIL.process,
      },
      {
        kind: "checklist",
        title: "The documents you'll typically need",
        intro: "Most files start with these:",
        items: [
          "A valid passport",
          "Birth certificate, and marriage certificate if your family moves with you",
          "Police certificate",
          "Proof of your route: the investment, the property, your pension or your remote income",
          "Certified translations into Portuguese, with attestation or an apostille",
        ],
        note: DOCS_NOTE,
      },
      {
        kind: "checklist",
        title: "Your first week",
        intro: "What our team does with you after you land:",
        items: [
          "Airport pickup and check-in at your hotel or temporary home",
          "A local SIM card",
          "CPF registration, your Brazilian tax number",
          "Your Polícia Federal appointment",
          "Opening a bank account",
          "Housing search and tenancy support",
        ],
      },
      {
        kind: "cities",
        title: "Choosing your city",
        intro: "Pick your city before your visa.",
        cities: [
          { name: "São Paulo", line: "Brazil's largest city and its business capital." },
          { name: "Rio de Janeiro", line: "Lifestyle: the coastline, the mountains and the city between them." },
          { name: "Florianópolis", line: "An island city in the south, where many newcomers settle." },
        ],
        note: "Your roadmap compares neighbourhoods, schools and costs for your family.",
      },
      {
        kind: "costs",
        title: "What it costs",
        intro: "Every cost shown separately, agreed before you pay.",
        rows: BRAZIL.costs,
      },
    ],
  },
  argentina: {
    key: "argentina",
    country: "Argentina",
    title: "Moving to Argentina",
    edition: "The EAM Global guide · 2026",
    summary: "Residence today and the new citizenship program: the routes, the documents, your first week in Buenos Aires and the costs.",
    pdf: "/guides/eam-global-argentina-guide-2026.pdf",
    fileName: "EAM-Global-Argentina-Guide-2026.pdf",
    team: "Spanish-speaking team in Buenos Aires",
    sections: [
      {
        kind: "text",
        title: "Is Argentina right for you?",
        paragraphs: [...ARGENTINA.life],
      },
      {
        kind: "routes",
        title: "Your options",
        intro: "Residence today, and direct citizenship once the new program opens.",
        rows: ARGENTINA.routes,
      },
      {
        kind: "text",
        title: "The new citizenship program",
        paragraphs: [CITIZENSHIP.argentina.body, CITIZENSHIP.argentina.why],
      },
      {
        kind: "steps",
        title: "Step by step",
        intro: "From your first message to settling in.",
        steps: ARGENTINA.process,
      },
      {
        kind: "checklist",
        title: "The documents you'll typically need",
        intro: "Most files start with these:",
        items: [
          "A valid passport",
          "Birth certificate, and marriage certificate if your family moves with you",
          "Police certificate",
          "Proof of your route: monthly income or pension, or the source of funds for the investment",
          "Certified translations into Spanish, with an apostille",
        ],
        note: DOCS_NOTE,
      },
      {
        kind: "checklist",
        title: "Your first week",
        intro: "What our Buenos Aires team does with you:",
        items: [
          "Pickup at Ezeiza airport",
          "Your appointment at Migraciones, the immigration office",
          "Registration with the tax authority",
          "Opening a bank account",
          "Housing search",
        ],
      },
      {
        kind: "cities",
        title: "Where to live",
        intro: "Our team is based in the capital.",
        cities: [{ name: "Buenos Aires", line: "A European-style capital at Latin American prices, with good, affordable private healthcare and international schools." }],
        note: "Prefer somewhere quieter? Your roadmap compares other cities for your family.",
      },
      {
        kind: "costs",
        title: "What it costs",
        intro: "Every cost shown separately, agreed before you pay.",
        rows: ARGENTINA.costs,
      },
    ],
  },
};

export const GUIDE_LIST = [GUIDES.brazil, GUIDES.argentina];

export const GUIDES_PAGE = {
  eyebrow: "Free country guides",
  headline: "Your move, step by step. *Free to download.*",
  intro:
    "Our own guides to the visa, your arrival, settling in and choosing a city, written by the team that made the move itself. Leave your details and the guide downloads straight away.",
  disclaimer:
    "Figures and requirements as publicly listed in October 2026. They change often, and your free roadmap confirms the current figures. This guide is general information, not legal advice.",
};
