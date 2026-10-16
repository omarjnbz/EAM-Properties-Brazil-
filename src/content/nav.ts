import { CITIZENSHIP_PROGRAMS, CITIZENSHIP_REGIONS, RESIDENCE_REGIONS, citizenshipHref, residenceHref } from "./programs";

export type NavLink = { label: string; href: string; badge?: string; description?: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  pinned?: NavLink[];
  columns: NavColumn[];
  footer?: NavLink;
};

const residenceColumns: NavColumn[] = [
  { title: "Europe", links: RESIDENCE_REGIONS[0].programs.map((p) => ({ label: p.country, href: residenceHref(p), badge: p.localTeam ? "Local team" : undefined })) },
  {
    title: "Middle East & Africa",
    links: [...RESIDENCE_REGIONS[1].programs, ...RESIDENCE_REGIONS[5].programs].map((p) => ({ label: p.country, href: residenceHref(p) })),
  },
  {
    title: "The Americas",
    links: RESIDENCE_REGIONS[2].programs.map((p) => ({ label: p.country, href: residenceHref(p), badge: p.localTeam ? "Local team" : undefined })),
  },
  {
    title: "Caribbean, Asia & Oceania",
    links: [...RESIDENCE_REGIONS[3].programs, ...RESIDENCE_REGIONS[4].programs].map((p) => ({ label: p.country, href: residenceHref(p) })),
  },
];

const citizenshipColumns: NavColumn[] = CITIZENSHIP_REGIONS.map((region) => ({
  title: region,
  links: CITIZENSHIP_PROGRAMS.filter((p) => p.region === region).map((p) => ({
    label: p.country,
    href: citizenshipHref(p),
    badge: p.isNew ? "New 2026" : undefined,
  })),
}));

export const NAV: NavItem[] = [
  {
    label: "Residence",
    href: "/residence-by-investment",
    pinned: [
      { label: "UAE Golden Visa", href: "/uae-golden-visa", badge: "Home office", description: "2, 5 or 10 years through property" },
      { label: "Brazil", href: "/residence-by-investment/brazil", badge: "Local team", description: "Investor residence, pathway to citizenship" },
    ],
    columns: residenceColumns,
    footer: { label: "Compare every residence program", href: "/residence-by-investment" },
  },
  {
    label: "Citizenship",
    href: "/citizenship-by-investment",
    pinned: [
      { label: "Argentina", href: "/citizenship-by-investment/argentina", badge: "New 2026", description: "USD 350,000 route, local team in Buenos Aires" },
    ],
    columns: citizenshipColumns,
    footer: { label: "Compare every citizenship program", href: "/citizenship-by-investment" },
  },
  {
    label: "Visas & Documents",
    href: "/visit-visas",
    columns: [
      {
        title: "Visas & documents",
        links: [
          { label: "Refused before?", href: "/refused-visa", description: "We review your refusal and help you reapply" },
          { label: "Tourist & Visit Visas", href: "/visit-visas", description: "USA, UK, Schengen, Canada, Australia, UAE" },
          { label: "Legal Translation", href: "/legal-translation-attestation", description: "Ministry of Justice-approved translators" },
          { label: "Attestation & Document Clearing", href: "/legal-translation-attestation#attestation", description: "Notary, MOFA, embassy, apostille" },
        ],
      },
    ],
  },
  {
    label: "Business",
    href: "/company-formation",
    columns: [
      {
        title: "Business",
        links: [
          { label: "Company Formation", href: "/company-formation", description: "UAE mainland, free zone and abroad" },
          { label: "UAE mainland & free zone", href: "/company-formation#uae", description: "Licence, office and visa quota" },
          { label: "Companies abroad", href: "/company-formation#abroad", description: "Serbia, Paraguay, Brazil" },
          { label: "Bank account support", href: "/company-formation#banking", description: "Corporate account introductions" },
        ],
      },
    ],
  },
  {
    label: "Relocation",
    href: "/relocation",
    columns: [
      {
        title: "Relocation",
        links: [
          { label: "Door-to-Door Package", href: "/relocation", description: "From the airport to your first month" },
          { label: "Travel & Tours", href: "/relocation#travel", description: "Visa, flights and hotel packages" },
          { label: "Education & Schools", href: "/relocation#schools", description: "School visits and enrolment guidance" },
          { label: "Property", href: "/relocation#property", description: "Housing, tenancy and property routes" },
        ],
      },
    ],
  },
  {
    label: "Why EAM Global",
    href: "/why-eam-global",
    columns: [
      {
        title: "Why EAM Global",
        links: [
          { label: "The seven USPs", href: "/why-eam-global#pillars", description: "What changes when you work with us" },
          { label: "Founder", href: "/why-eam-global#founder", description: "Alaa Marzouk, an immigrant to Brazil himself" },
          { label: "Our presence", href: "/why-eam-global#presence", description: "Dubai HQ and local teams" },
          { label: "No Win, No Fee", href: "/why-eam-global#guarantee", description: "Our guarantee, in plain language" },
          { label: "Testimonials", href: "/testimonials", description: "Real families, real approvals" },
          { label: "Free country guides", href: "/guides", description: "Brazil and Argentina, free to download" },
          { label: "Podcast", href: "/podcast", description: "Real moves, real families" },
        ],
      },
    ],
  },
];

export const FOOTER = {
  blurb: "We don't just get you the visa. We get you home.",
  facts: "Dubai HQ · Local teams in {{countries}} · Licence {{number}}",
  columns: [
    {
      title: "Services",
      links: [
        { label: "Residence by Investment", href: "/residence-by-investment" },
        { label: "Citizenship by Investment", href: "/citizenship-by-investment" },
        { label: "UAE Golden Visa", href: "/uae-golden-visa" },
        { label: "Tourist & Visit Visas", href: "/visit-visas" },
        { label: "Refused before? Reapply with us", href: "/refused-visa" },
        { label: "Legal Translation & Attestation", href: "/legal-translation-attestation" },
        { label: "Company Formation", href: "/company-formation" },
        { label: "Door-to-Door Relocation", href: "/relocation" },
        { label: "Travel & Tours", href: "/relocation#travel" },
      ],
    },
    {
      title: "Destinations",
      links: [
        { label: "UAE", href: "/uae-golden-visa" },
        { label: "Argentina", href: "/citizenship-by-investment/argentina" },
        { label: "Brazil", href: "/residence-by-investment/brazil" },
        { label: "Paraguay", href: "/residence-by-investment#paraguay" },
        { label: "Serbia", href: "/residence-by-investment#serbia" },
        { label: "Portugal", href: "/residence-by-investment#portugal" },
        { label: "Greece", href: "/residence-by-investment#greece" },
        { label: "Caribbean", href: "/citizenship-by-investment#caribbean" },
        { label: "All countries", href: "/residence-by-investment" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Why EAM Global", href: "/why-eam-global" },
        { label: "Founder", href: "/why-eam-global#founder" },
        { label: "Our Presence", href: "/why-eam-global#presence" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Free country guides", href: "/guides" },
        { label: "Podcast", href: "/podcast" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "FAQ", href: "/faq" },
        { label: "Free Roadmap", href: "/free-roadmap" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "No Win, No Fee terms", href: "/why-eam-global#guarantee" },
  ],
};
