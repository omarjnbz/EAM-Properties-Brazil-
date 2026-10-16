/**
 * Program directories. Minimum qualifying amounts as publicly listed in
 * October 2026. Thresholds change often: re-verify every figure against official
 * sources before launch. The free roadmap always confirms the current figure.
 */

export type ResidenceProgram = {
  country: string;
  amount: string;
  rights: string;
  schengen?: boolean;
  note?: string;
  localTeam?: boolean;
  homeOffice?: boolean;
  href?: string;
};

export type ResidenceRegion = {
  id: string;
  name: string;
  hasSchengen?: boolean;
  programs: ResidenceProgram[];
  closed?: { intro: string; items: string[]; note: string };
};

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const RESIDENCE_REGIONS: ResidenceRegion[] = [
  {
    id: "europe",
    name: "Europe",
    hasSchengen: true,
    programs: [
      { country: "Austria", amount: "EUR 50,000 in funds plus German A1 and housing", rights: "Live, study", schengen: true, note: "Quota-based" },
      { country: "Bulgaria", amount: "EUR 512,000", rights: "Live, work, study", schengen: true, note: "No minimum stay" },
      { country: "Cyprus", amount: "EUR 300,000", rights: "Live, study", schengen: false, note: "One visit every two years" },
      { country: "Greece", amount: "EUR 250,000", rights: "Live, study", schengen: true, note: "No minimum stay" },
      { country: "Hungary", amount: "EUR 250,000", rights: "Live, work, study", schengen: true, note: "No minimum stay" },
      { country: "Italy", amount: "EUR 250,000", rights: "Live, work, study", schengen: true, note: "Two investor routes" },
      { country: "Jersey", amount: "GBP 1.75M property plus GBP 250,000 annual tax", rights: "Live, work, study", schengen: false },
      { country: "Latvia", amount: "EUR 60,000", rights: "Live, work, study", schengen: true, note: "Lowest entry in the EU" },
      { country: "Luxembourg", amount: "EUR 500,000", rights: "Live, work, study", schengen: true },
      { country: "Malta", amount: "EUR 169,000", rights: "Live, work, study", schengen: true, note: "Permanent from day one" },
      { country: "Monaco", amount: "No set minimum; proof of means", rights: "Live, work, study", schengen: true },
      { country: "Montenegro", amount: "No set minimum", rights: "Live, work, study", schengen: false },
      { country: "Portugal", amount: "EUR 250,000", rights: "Live, work, study", schengen: true, note: "About 7 days a year in-country" },
      { country: "Serbia", amount: "About EUR 6,000 a year via company route", rights: "Live, work, study", schengen: false, note: "Local team", localTeam: true },
      { country: "Switzerland", amount: "CHF 250,000 annual lump-sum tax", rights: "Live, study", schengen: true },
      { country: "United Kingdom", amount: "Innovative scaling business", rights: "Live, work, study", schengen: false, note: "Innovator Founder route" },
    ],
    closed: {
      intro: "Closed to new applicants",
      items: ["Ireland (Dec 2023)", "Netherlands (Mar 2024)", "Spain (Apr 2025)"],
      note: "We keep these listed so clients searching for them learn the alternatives.",
    },
  },
  {
    id: "middle-east",
    name: "Middle East",
    programs: [
      {
        country: "United Arab Emirates",
        amount: "AED 400,000 (2-yr) · AED 1M (5-yr, 55+) · AED 2M (10-yr)",
        rights: "Live, work, study",
        note: "Home office; see UAE Golden Visa page",
        homeOffice: true,
        href: "/uae-golden-visa",
      },
      { country: "Bahrain", amount: "BHD 130,000", rights: "Live, work, study" },
      { country: "Saudi Arabia", amount: "SAR 100,000 a year or SAR 800,000 once", rights: "Live, work, study", note: "Premium Residency" },
    ],
  },
  {
    id: "americas",
    name: "The Americas",
    programs: [
      {
        country: "Argentina",
        amount: "USD 1,500 monthly passive income",
        rights: "Live",
        note: "Local team; new citizenship program also available",
        localTeam: true,
        href: "/citizenship-by-investment/argentina",
      },
      {
        country: "Brazil",
        amount: "{{BRL amount, investor visa}}",
        rights: "Live, work, study",
        note: "Local team; pathway to citizenship",
        localTeam: true,
        href: "/residence-by-investment/brazil",
      },
      { country: "Paraguay", amount: "USD 150,000", rights: "Live, work, study", note: "Local team", localTeam: true },
      { country: "Uruguay", amount: "USD 1,000 monthly income", rights: "Live, work, study" },
      { country: "Panama", amount: "USD 100,000", rights: "Live, work, study" },
      { country: "Costa Rica", amount: "USD 150,000", rights: "Live, study" },
      { country: "Mexico", amount: "USD 280,000", rights: "Live, work, study" },
      { country: "Canada", amount: "CAD 1.2M (Quebec investor)", rights: "Live, work, study", note: "Start-up visa paused Jan 2026" },
      { country: "United States", amount: "USD 800,000 (EB-5)", rights: "Live, work, study", note: "Green Card; 10 jobs created" },
    ],
  },
  {
    id: "caribbean",
    name: "Caribbean",
    programs: [
      { country: "Dominican Republic", amount: "USD 200,000", rights: "Live, work, study" },
      { country: "The Bahamas", amount: "USD 1M", rights: "Live" },
      { country: "Cayman Islands", amount: "USD 1.2M or 10% of a local business", rights: "Live" },
    ],
  },
  {
    id: "asia-oceania",
    name: "Asia and Oceania",
    programs: [
      { country: "Thailand", amount: "THB 650,000", rights: "Live", note: "Long-term visa" },
      { country: "Malaysia", amount: "MYR 1M", rights: "Live, work, study" },
      { country: "Hong Kong", amount: "HKD 30M", rights: "Live, work, study" },
      { country: "Singapore", amount: "SGD 10M", rights: "Live, work, study" },
      { country: "Maldives", amount: "Opening H2 2026", rights: "Live" },
      { country: "Australia", amount: "No set contribution", rights: "Live, work, study", note: "Talent-based" },
      { country: "New Zealand", amount: "NZD 5M", rights: "Live, work, study" },
    ],
  },
  {
    id: "africa",
    name: "Africa",
    programs: [
      { country: "Mauritius", amount: "USD 375,000", rights: "Live, work, study" },
      { country: "Namibia", amount: "Under government review", rights: "—" },
    ],
  },
];

export type CitizenshipProgram = {
  region: string;
  country: string;
  amount: string;
  visaFree: string;
  residence: string;
  note?: string;
  isNew?: boolean;
  localTeam?: boolean;
  href?: string;
};

export const CITIZENSHIP_PROGRAMS: CitizenshipProgram[] = [
  {
    region: "Americas",
    country: "Argentina",
    amount: "USD 350,000 contribution or USD 800,000 bond",
    visaFree: "~170",
    residence: "Not expected",
    note: "Opens Q4 2026; local team",
    isNew: true,
    localTeam: true,
    href: "/citizenship-by-investment/argentina",
  },
  { region: "Caribbean", country: "Dominica", amount: "USD 200,000", visaFree: "140+", residence: "None", note: "Lowest Caribbean entry" },
  { region: "Caribbean", country: "Antigua and Barbuda", amount: "USD 230,000", visaFree: "150+", residence: "Short visit" },
  { region: "Caribbean", country: "Grenada", amount: "USD 235,000", visaFree: "140+", residence: "None", note: "Only Caribbean program with a US E-2 treaty" },
  { region: "Caribbean", country: "St. Lucia", amount: "USD 240,000", visaFree: "140+", residence: "None", note: "Property option available" },
  { region: "Caribbean", country: "St. Kitts and Nevis", amount: "USD 250,000", visaFree: "150+", residence: "None", note: "Oldest program, strongest Caribbean passport" },
  { region: "Europe", country: "Türkiye", amount: "USD 400,000 in property", visaFree: "110+", residence: "None", note: "Bridge between Europe and Asia" },
  { region: "Europe", country: "Austria", amount: "Substantial economic contribution", visaFree: "180+", residence: "Case by case", note: "Exceptional, not a standard program" },
  { region: "Europe", country: "Malta", amount: "Exceptional merit or service", visaFree: "180+", residence: "Yes", note: "Citizenship by merit, not investment" },
  { region: "Middle East", country: "Jordan", amount: "JOD 350,000", visaFree: "50+", residence: "None" },
  { region: "Africa", country: "Egypt", amount: "USD 250,000", visaFree: "50+", residence: "None" },
  { region: "Africa", country: "São Tomé and Príncipe", amount: "USD 95,000", visaFree: "60+", residence: "None", note: "Lowest entry worldwide" },
  { region: "Oceania", country: "Nauru (Naoero)", amount: "USD 120,000 (promotional USD 95,000)", visaFree: "80+", residence: "None", note: "Climate-resilience fund" },
];

export const CITIZENSHIP_EXPECTED =
  "Expected in 2026 and 2027: Botswana, St. Vincent and the Grenadines. We will add them when legislation is in force.";

export const CITIZENSHIP_REGIONS = ["Americas", "Caribbean", "Europe", "Middle East", "Africa", "Oceania"] as const;

/** Link for a program row: its own page if it has one, else its anchor in the directory. */
export const residenceHref = (p: ResidenceProgram) => p.href ?? `/residence-by-investment#${slugify(p.country)}`;
export const citizenshipHref = (p: CitizenshipProgram) => p.href ?? `/citizenship-by-investment#${slugify(p.country)}`;

/** Options for the destination dropdown in the roadmap forms. */
export const DESTINATION_OPTIONS: { group: string; options: { value: string; label: string }[] }[] = [
  {
    group: "Featured",
    options: [
      { value: "brazil", label: "Brazil · investor residence" },
      { value: "uae", label: "UAE · Golden Visa" },
      { value: "argentina", label: "Argentina · residence or citizenship" },
      { value: "paraguay", label: "Paraguay · residence" },
      { value: "portugal", label: "Portugal · Golden Visa" },
      { value: "caribbean", label: "Caribbean · second passport" },
    ],
  },
  ...RESIDENCE_REGIONS.map((r) => ({
    group: `Residence · ${r.name}`,
    options: r.programs.map((p) => ({ value: `res-${slugify(p.country)}`, label: p.country })),
  })),
  ...CITIZENSHIP_REGIONS.map((region) => ({
    group: `Citizenship · ${region}`,
    options: CITIZENSHIP_PROGRAMS.filter((p) => p.region === region).map((p) => ({
      value: `cit-${slugify(p.country)}`,
      label: p.country,
    })),
  })),
  {
    group: "Visas & documents",
    options: [
      { value: "visit-usa", label: "Visit visa · United States" },
      { value: "visit-uk", label: "Visit visa · United Kingdom" },
      { value: "visit-schengen", label: "Visit visa · Schengen" },
      { value: "visit-canada", label: "Visit visa · Canada" },
      { value: "visit-australia", label: "Visit visa · Australia" },
      { value: "visit-uae", label: "Visit or transit visa · UAE" },
    ],
  },
];
