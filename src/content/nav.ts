import { CITIZENSHIP_PROGRAMS, CITIZENSHIP_REGIONS, RESIDENCE_REGIONS, citizenshipHref, residenceHref } from "./programs";
import { PODCAST_LIVE } from "./podcast";

export type NavLink = { label: string; href: string; badge?: string; badgeNew?: boolean; description?: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  pinned?: NavLink[];
  columns: NavColumn[];
  footer?: NavLink;
};

type Label = { label: string; description: string };

/**
 * Every word in the main menu. Links, order and the program lists live in
 * buildNav below; each language only supplies these strings (see content/i18n).
 */
export type NavText = {
  menus: { residence: string; citizenship: string; visas: string; business: string; relocation: string; why: string };
  badges: { localTeam: string; homeOffice: string; new2026: string };
  residence: { uae: Label; brazil: Label; columns: { europe: string; middleEastAfrica: string; americas: string; caribbeanAsiaOceania: string }; footer: string };
  citizenship: { argentina: Label; footer: string };
  visas: { refused: Label; visit: Label; translation: Label; attestation: Label };
  business: { formation: Label; uae: Label; abroad: Label; banking: Label };
  relocation: { door: Label; travel: Label; schools: Label; property: Label };
  why: { pillars: Label; founder: Label; presence: Label; guarantee: Label; testimonials: Label; guides: Label; podcast: Label };
};

export const NAV_TEXT_EN: NavText = {
  menus: { residence: "Residence", citizenship: "Citizenship", visas: "Visas & Documents", business: "Business", relocation: "Relocation", why: "Why EAM Global" },
  badges: { localTeam: "Local team", homeOffice: "Home office", new2026: "New 2026" },
  residence: {
    uae: { label: "UAE Golden Visa", description: "2, 5 or 10 years through property" },
    brazil: { label: "Brazil", description: "Investor residence, pathway to citizenship" },
    columns: { europe: "Europe", middleEastAfrica: "Middle East & Africa", americas: "The Americas", caribbeanAsiaOceania: "Caribbean, Asia & Oceania" },
    footer: "Compare every residence program",
  },
  citizenship: {
    argentina: { label: "Argentina", description: "USD 350,000 route, local team in Buenos Aires" },
    footer: "Compare every citizenship program",
  },
  visas: {
    refused: { label: "Refused before?", description: "We review your refusal and help you reapply" },
    visit: { label: "Tourist & Visit Visas", description: "USA, UK, Schengen, Canada, Australia, UAE" },
    translation: { label: "Legal Translation", description: "Ministry of Justice-approved translators" },
    attestation: { label: "Attestation & Document Clearing", description: "Notary, MOFA, embassy, apostille" },
  },
  business: {
    formation: { label: "Company Formation", description: "UAE mainland, free zone and abroad" },
    uae: { label: "UAE mainland & free zone", description: "Licence, office and visa quota" },
    abroad: { label: "Companies abroad", description: "Serbia, Paraguay, Brazil" },
    banking: { label: "Bank account support", description: "Corporate account introductions" },
  },
  relocation: {
    door: { label: "Door-to-Door Package", description: "From the airport to your first month" },
    travel: { label: "Travel & Tours", description: "Visa, flights and hotel packages" },
    schools: { label: "Education & Schools", description: "School visits and enrolment guidance" },
    property: { label: "Property", description: "Housing, tenancy and property routes" },
  },
  why: {
    pillars: { label: "The seven USPs", description: "What changes when you work with us" },
    founder: { label: "Founder", description: "Alaa Marzouk, an immigrant to Brazil himself" },
    presence: { label: "Our presence", description: "Dubai HQ and local teams" },
    guarantee: { label: "No Win, No Fee", description: "Our guarantee, in plain language" },
    testimonials: { label: "Testimonials", description: "Real families, real approvals" },
    guides: { label: "Free country guides", description: "Brazil and Argentina, free to download" },
    podcast: { label: "Podcast", description: "Real moves, real families" },
  },
};

const same = (s: string) => s;
const link = (l: Label, href: string): NavLink => ({ label: l.label, description: l.description, href });

/** The main menu in one language. `country` and `region` translate program country and region names. */
export function buildNav(t: NavText, country: (name: string) => string = same, region: (name: string) => string = same): NavItem[] {
  const b = t.badges;
  const residenceColumns: NavColumn[] = [
    {
      title: t.residence.columns.europe,
      links: RESIDENCE_REGIONS[0].programs.map((p) => ({ label: country(p.country), href: residenceHref(p), badge: p.localTeam ? b.localTeam : undefined })),
    },
    {
      title: t.residence.columns.middleEastAfrica,
      links: [...RESIDENCE_REGIONS[1].programs, ...RESIDENCE_REGIONS[5].programs].map((p) => ({ label: country(p.country), href: residenceHref(p) })),
    },
    {
      title: t.residence.columns.americas,
      links: RESIDENCE_REGIONS[2].programs.map((p) => ({ label: country(p.country), href: residenceHref(p), badge: p.localTeam ? b.localTeam : undefined })),
    },
    {
      title: t.residence.columns.caribbeanAsiaOceania,
      links: [...RESIDENCE_REGIONS[3].programs, ...RESIDENCE_REGIONS[4].programs].map((p) => ({ label: country(p.country), href: residenceHref(p) })),
    },
  ];

  const citizenshipColumns: NavColumn[] = CITIZENSHIP_REGIONS.map((r) => ({
    title: region(r),
    links: CITIZENSHIP_PROGRAMS.filter((p) => p.region === r).map((p) => ({
      label: country(p.country),
      href: citizenshipHref(p),
      badge: p.isNew ? b.new2026 : undefined,
      badgeNew: p.isNew || undefined,
    })),
  }));

  return [
    {
      label: t.menus.residence,
      href: "/residence-by-investment",
      pinned: [
        { ...link(t.residence.uae, "/uae-golden-visa"), badge: b.homeOffice },
        { ...link(t.residence.brazil, "/residence-by-investment/brazil"), badge: b.localTeam },
      ],
      columns: residenceColumns,
      footer: { label: t.residence.footer, href: "/residence-by-investment" },
    },
    {
      label: t.menus.citizenship,
      href: "/citizenship-by-investment",
      pinned: [{ ...link(t.citizenship.argentina, "/citizenship-by-investment/argentina"), badge: b.new2026, badgeNew: true }],
      columns: citizenshipColumns,
      footer: { label: t.citizenship.footer, href: "/citizenship-by-investment" },
    },
    {
      label: t.menus.visas,
      href: "/visit-visas",
      columns: [
        {
          title: t.menus.visas,
          links: [
            link(t.visas.refused, "/refused-visa"),
            link(t.visas.visit, "/visit-visas"),
            link(t.visas.translation, "/legal-translation-attestation"),
            link(t.visas.attestation, "/legal-translation-attestation#attestation"),
          ],
        },
      ],
    },
    {
      label: t.menus.business,
      href: "/company-formation",
      columns: [
        {
          title: t.menus.business,
          links: [
            link(t.business.formation, "/company-formation"),
            link(t.business.uae, "/company-formation#uae"),
            link(t.business.abroad, "/company-formation#abroad"),
            link(t.business.banking, "/company-formation#banking"),
          ],
        },
      ],
    },
    {
      label: t.menus.relocation,
      href: "/relocation",
      columns: [
        {
          title: t.menus.relocation,
          links: [
            link(t.relocation.door, "/relocation"),
            link(t.relocation.travel, "/relocation#travel"),
            link(t.relocation.schools, "/relocation#schools"),
            link(t.relocation.property, "/relocation#property"),
          ],
        },
      ],
    },
    {
      label: t.menus.why,
      href: "/why-eam-global",
      columns: [
        {
          title: t.menus.why,
          links: [
            link(t.why.pillars, "/why-eam-global#pillars"),
            link(t.why.founder, "/why-eam-global#founder"),
            link(t.why.presence, "/why-eam-global#presence"),
            link(t.why.guarantee, "/why-eam-global#guarantee"),
            link(t.why.testimonials, "/testimonials"),
            link(t.why.guides, "/guides"),
            ...(PODCAST_LIVE ? [link(t.why.podcast, "/podcast")] : []),
          ],
        },
      ],
    },
  ];
}

/** The English main menu. */
export const NAV: NavItem[] = buildNav(NAV_TEXT_EN);

/** Every word in the footer link lists (each language supplies its own). */
export type FooterText = {
  titles: { services: string; destinations: string; company: string };
  services: {
    residence: string;
    citizenship: string;
    uae: string;
    visit: string;
    refused: string;
    translation: string;
    formation: string;
    relocation: string;
    travel: string;
  };
  destinations: { uae: string; argentina: string; brazil: string; paraguay: string; serbia: string; portugal: string; greece: string; caribbean: string; all: string };
  company: {
    why: string;
    founder: string;
    presence: string;
    testimonials: string;
    guides: string;
    podcast: string;
    how: string;
    faq: string;
    roadmap: string;
    contact: string;
    careers: string;
  };
  legal: { privacy: string; terms: string; guarantee: string };
};

export const FOOTER_TEXT_EN: FooterText = {
  titles: { services: "Services", destinations: "Destinations", company: "Company" },
  services: {
    residence: "Residence by Investment",
    citizenship: "Citizenship by Investment",
    uae: "UAE Golden Visa",
    visit: "Tourist & Visit Visas",
    refused: "Refused before? Reapply with us",
    translation: "Legal Translation & Attestation",
    formation: "Company Formation",
    relocation: "Door-to-Door Relocation",
    travel: "Travel & Tours",
  },
  destinations: {
    uae: "UAE",
    argentina: "Argentina",
    brazil: "Brazil",
    paraguay: "Paraguay",
    serbia: "Serbia",
    portugal: "Portugal",
    greece: "Greece",
    caribbean: "Caribbean",
    all: "All countries",
  },
  company: {
    why: "Why EAM Global",
    founder: "Founder",
    presence: "Our Presence",
    testimonials: "Testimonials",
    guides: "Free country guides",
    podcast: "Podcast",
    how: "How It Works",
    faq: "FAQ",
    roadmap: "Free Roadmap",
    contact: "Contact",
    careers: "Careers",
  },
  legal: { privacy: "Privacy", terms: "Terms", guarantee: "No Win, No Fee terms" },
};

/** Footer link lists in one language. */
export function buildFooter(t: FooterText) {
  const s = t.services;
  const d = t.destinations;
  const c = t.company;
  return {
    columns: [
      {
        title: t.titles.services,
        links: [
          { label: s.residence, href: "/residence-by-investment" },
          { label: s.citizenship, href: "/citizenship-by-investment" },
          { label: s.uae, href: "/uae-golden-visa" },
          { label: s.visit, href: "/visit-visas" },
          { label: s.refused, href: "/refused-visa" },
          { label: s.translation, href: "/legal-translation-attestation" },
          { label: s.formation, href: "/company-formation" },
          { label: s.relocation, href: "/relocation" },
          { label: s.travel, href: "/relocation#travel" },
        ],
      },
      {
        title: t.titles.destinations,
        links: [
          { label: d.uae, href: "/uae-golden-visa" },
          { label: d.argentina, href: "/citizenship-by-investment/argentina" },
          { label: d.brazil, href: "/residence-by-investment/brazil" },
          { label: d.paraguay, href: "/residence-by-investment#paraguay" },
          { label: d.serbia, href: "/residence-by-investment#serbia" },
          { label: d.portugal, href: "/residence-by-investment#portugal" },
          { label: d.greece, href: "/residence-by-investment#greece" },
          { label: d.caribbean, href: "/citizenship-by-investment#caribbean" },
          { label: d.all, href: "/residence-by-investment" },
        ],
      },
      {
        title: t.titles.company,
        links: [
          { label: c.why, href: "/why-eam-global" },
          { label: c.founder, href: "/why-eam-global#founder" },
          { label: c.presence, href: "/why-eam-global#presence" },
          { label: c.testimonials, href: "/testimonials" },
          { label: c.guides, href: "/guides" },
          ...(PODCAST_LIVE ? [{ label: c.podcast, href: "/podcast" }] : []),
          { label: c.how, href: "/how-it-works" },
          { label: c.faq, href: "/faq" },
          { label: c.roadmap, href: "/free-roadmap" },
          { label: c.contact, href: "/contact" },
          { label: c.careers, href: "/careers" },
        ],
      },
    ],
    legal: [
      { label: t.legal.privacy, href: "/privacy" },
      { label: t.legal.terms, href: "/terms" },
      { label: t.legal.guarantee, href: "/why-eam-global#guarantee" },
    ],
  };
}
