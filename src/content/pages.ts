/** Page copy for every service, country and company page (English master). */

export type Faq = { q: string; a: string };

/* ------------------------------------------------------------------ SEO */
export const SEO = {
  home: {
    title: "EAM Global · Residence, Citizenship & Relocation from Dubai",
    description:
      "Residence, second passports and visas with a team that speaks your language and meets you on arrival. 24/7 response. No Win, No Fee.",
  },
  why: {
    title: "Why Families Choose EAM Global · 7 Differences",
    description:
      "Local language, founder-led cases, 24/7 human response, teams on the ground, door-to-door relocation, free roadmap, No Win No Fee.",
  },
  residence: {
    title: "Residence by Investment Programs 2026 · EAM Global",
    description:
      "Compare 35+ residence and golden visa programs from AED 400,000. Free written roadmap within 48 hours.",
  },
  citizenship: {
    title: "Citizenship by Investment Programs 2026 · EAM Global",
    description:
      "Second passports from USD 95,000, family included. Argentina's new program opens Q4 2026. Free roadmap.",
  },
  uae: {
    title: "UAE Golden Visa through Property · 2, 5 or 10 Years",
    description:
      "AED 400,000 to AED 2M routes explained by a Dubai-based team. From property to Emirates ID, handled with you.",
  },
  argentina: {
    title: "Argentina Citizenship by Investment 2026 · USD 350,000",
    description:
      "New program opening Q4 2026 plus residence routes today. Spanish-speaking team in Buenos Aires.",
  },
  brazil: {
    title: "Brazil Investor Visa & Pathway to Citizenship",
    description: "Investor and retiree residence in Brazil with Portuguese-speaking advisors on the ground.",
  },
  visit: {
    title: "Tourist & Visit Visas from Dubai · USA, UK, Schengen",
    description:
      "Visit visa files prepared the way consulates expect, in your language, with interview prep.",
  },
  legal: {
    title: "Legal Translation & Attestation in Dubai",
    description: "Certified translations and full attestation chain for visa, residence and company files.",
  },
  company: {
    title: "Company Formation in the UAE and Abroad",
    description:
      "Mainland, free zone and offshore setup with bank account support, plus companies for residence routes abroad.",
  },
  relocation: {
    title: "Door-to-Door Relocation · We Meet You at the Airport",
    description: "Airport pickup, housing, appointments and a local guide who speaks your language.",
  },
  roadmap: {
    title: "Get Your Free Step-by-Step Migration Roadmap",
    description:
      "A written plan for your nationality, family and budget within 48 hours. No payment, no obligation.",
  },
  testimonials: {
    title: "Client Videos · Real Approvals with EAM Global",
    description: "Watch our founder hand clients their approved visas and passports.",
  },
  contact: {
    title: "Contact EAM Global · 24/7 Response",
    description: "WhatsApp, call or message. A real advisor replies within 60 minutes, any hour.",
  },
  how: {
    title: "How It Works · Five Steps, One Team · EAM Global",
    description:
      "From your first message to keys in hand: free roadmap in 48 hours, fixed fees in writing, and a local team on arrival.",
  },
  faq: {
    title: "Questions & Answers · EAM Global",
    description:
      "Languages, response times, the free roadmap, No Win No Fee, offices and visit visas: straight answers from EAM Global.",
  },
} as const;

/* ------------------------------------------------------------------ Why EAM Global */
export const WHY = {
  eyebrow: "Why EAM Global",
  headline: "The firm that stays after *the stamp*",
  intro:
    "Getting approved is the middle of your journey, not the end. We built EAM Global around the parts other firms leave to you: the language, the arrival, the first weeks, and the guarantee that you only pay when it works.",
  language: {
    title: "We speak your language",
    paragraphs: [
      "Most people who move to Brazil do not speak Portuguese. Most who move to Argentina or Paraguay do not speak Spanish. Most who move to Serbia do not speak Serbian. They arrive with an approval letter and spend their first months lost in paperwork they cannot read.",
      "Every EAM Global client is matched with an advisor who speaks their home language and the language of their destination. We translate, we explain, we attend the appointment with you.",
    ],
    languages: "Current team languages: {{English, Arabic, Portuguese, Spanish, Serbian, …}}.",
  },
  founder: {
    title: "Founder-led, with a record to show",
    badge: "Trusted authority",
    headline: "Expert immigration guidance you can *trust*",
    bio: "Alaa Marzouk, Senior Immigration Consultant and founder of EAM Global, has worked in global migration for more than 16 years. He holds a degree in Economics and Political Science from Cairo University (2009) and advises clients in Arabic, English, Portuguese and Spanish. In that time he has guided hundreds of families and investors to residence, visit visas and second citizenship, with a high approval rate built on preparing every file as if it will be scrutinised, because it will be.",
    credentials: [
      { value: "16+", label: "Years in global migration" },
      { value: "Cairo University", label: "Economics & Political Science (2009)" },
      { value: "Multilingual", label: "Arabic, English, Portuguese, Spanish" },
      { value: "High", label: "Approval rate" },
    ],
    note: "Your case is not passed down a chain. The founder reviews every roadmap and every submission, and meets clients in person at the Dubai office when their documents arrive. Many of those moments are on video in our Testimonials section.",
  },
  response: {
    title: "24/7 human response",
    body: "Send a message at 3 a.m. on a Friday and a real advisor replies within 60 minutes. Not a chatbot, not an auto-reply, not “we will contact you in two to three working days”.",
    channels:
      "Channels: WhatsApp (fastest), web form, email, phone. If you leave a message anywhere on this site, you are connected directly.",
  },
  presence: {
    title: "On the ground where you are going",
    intro: "EAM Global is headquartered in Dubai and has local teams or partner offices in:",
    practice:
      "What this means in practice: someone meets you at the airport, knows which government office opens when, which bank accepts new residents, and which school has places.",
  },
  door: {
    title: "Door-to-Door Package",
    intro: "One fee, one plan, one point of contact, from your first message to your first month living abroad.",
  },
  roadmap: {
    title: "Your free roadmap",
    body: "Before you pay a single dirham, you receive a written plan for your exact situation: which program fits, every document you need and where to get it, how long each stage takes, and what it costs in total, including government fees.",
  },
  guarantee: {
    title: "No Win, No Fee: our guarantee",
    promise: "If your application is refused, EAM Global refunds its professional fees.",
    refunded: "EAM Global's consultation, preparation and processing fees for that application.",
    notRefunded:
      "Fees paid to governments, embassies and official bodies; third-party costs such as translations, attestations, courier, medical tests and property-related costs; any amount already spent on your behalf at your written request.",
    conditions:
      "The client provided complete and truthful information and documents; the refusal was not caused by the client's own actions, criminal record or withdrawal; the guarantee covers programs listed on this site and is confirmed in writing in the client agreement.",
  },
};

/* ------------------------------------------------------------------ Residence by Investment */
export const RESIDENCE = {
  eyebrow: "Residence by Investment",
  headline: "Live where you choose. Keep the passport *you have*.",
  intro:
    "A residence permit gives you and your family the legal right to live, and usually work and study, in a new country while you remain a citizen of your own. Many programs ask for very little time in-country, several open the door to Europe's Schengen Area, and most can lead to permanent residence or citizenship after a number of years. EAM Global handles the application and, unlike most firms, the arrival.",
  who: "Families seeking a stable second home, business owners who want a European or Gulf base, parents planning their children's education, and anyone who wants a Plan B without giving up their current nationality.",
  gains: [
    "A legal home in a second country, renewable and in many cases permanent",
    "Visa-free movement across Schengen if the permit is issued by a member state",
    "Access to local healthcare, schools and universities",
    "A route to citizenship in most programs, typically after 5 to 10 years",
    "A favourable tax position, depending on where you actually live",
    "Property that doubles as an investment and a residence qualification",
  ],
  directoryNote:
    "Figures are the minimum qualifying amount as publicly listed in October 2026 and change frequently; your free roadmap confirms the current figure. “Local team” marks countries where EAM Global has people on the ground.",
  how: [
    "Free roadmap: we match you to two or three programs and show the full cost of each.",
    "Fixed fee agreed in writing, with the No Win, No Fee guarantee.",
    "We collect, translate and attest every document.",
    "We file with the authority and track the case.",
    "Our local team meets you on arrival and completes biometrics, ID card and bank account with you.",
    "We handle renewals and add family members later.",
  ],
  faqs: [
    {
      q: "Do I have to live there?",
      a: "It depends. Portugal asks for about a week a year, Greece and Hungary for nothing, the US EB-5 for genuine residence. Your roadmap states the exact rule.",
    },
    { q: "Can my family come?", a: "Spouse and dependent children are included in nearly every program; parents in many." },
    {
      q: "Will I pay tax there?",
      a: "Holding a permit does not make you tax resident. Spending roughly 183 days a year does. We refer you to a tax adviser before you decide.",
    },
    {
      q: "What if I sell the property?",
      a: "Most programs require you to keep the investment for the life of the permit or a set period, often five years.",
    },
    {
      q: "How long does it take?",
      a: "From three months to eighteen, depending on the country and how complete your file is. Our roadmap gives a realistic range, not a sales number.",
    },
  ] as Faq[],
};

/* ------------------------------------------------------------------ Citizenship by Investment */
export const CITIZENSHIP = {
  eyebrow: "Citizenship by Investment",
  headline: "A second passport for your family, in months rather than *decades*",
  intro:
    "Citizenship by investment lets you become a full citizen of another country through a government-approved contribution, property purchase or bond, usually without living there first. You keep your current nationality where your home country allows it, your children and often your parents are included, and the citizenship passes to future generations. EAM Global guides the application, and our local teams in Argentina and elsewhere handle the parts that happen on the ground.",
  who: "Families who want more travel freedom, business owners who need a second base, and anyone who wants their children's future secured in a stable country regardless of what happens at home.",
  gains: [
    "A second passport with broader visa-free travel",
    "The right to live, work and study in your new country",
    "Citizenship for your spouse, children and often parents, passed on to the next generation",
    "A safeguard if conditions at home deteriorate",
    "Access to a different tax and banking environment",
  ],
  argentina: {
    eyebrow: "New program · Local team ready",
    title: "Argentina: new program, local team *ready*",
    body: "Argentina announced its citizenship by investment program on 2 October 2026, with applications expected to open in the last quarter of 2026. Two routes are planned: a non-refundable contribution of USD 350,000 to the national treasury, or a USD 800,000 subscription to a dedicated government bond. Applicants will pass checks on identity, source of funds, criminal record, reputation and immigration history, in line with OECD and FATF standards.",
    why: "Why it matters: an Argentine passport offers visa-free travel to roughly 170 destinations and freedom of movement across the MERCOSUR bloc. EAM Global already has Spanish-speaking people in Buenos Aires, so you are not waiting for a firm to open an office after the program launches.",
    button: "Register interest in Argentina",
  },
  directoryNote:
    "Minimum qualifying amounts as publicly listed in October 2026. Visa-free counts are approximate and change as treaties change.",
  how: [
    "Free roadmap comparing two or three programs on cost, passport strength and timeline.",
    "Pre-screening of your file before any government fee is paid, so you know your odds honestly.",
    "Document collection, translation and attestation handled in Dubai.",
    "Submission through the licensed channel and case tracking.",
    "Oath, passport collection and any required visit arranged and accompanied by our team.",
    "Guarantee: if the application is refused, our fees are returned.",
  ],
  faqs: [
    {
      q: "Is this legal?",
      a: "Yes. Each program is created by national law and run by a government unit. Strict background checks are part of the process.",
    },
    {
      q: "How long does it take?",
      a: "Caribbean programs typically take four to eight months; others can take over a year. We quote a range, not a promise.",
    },
    {
      q: "Can I keep my current passport?",
      a: "Most programs allow dual citizenship. Whether your home country allows it is a separate question we check for you first.",
    },
    {
      q: "Do I have to visit?",
      a: "Most Caribbean programs require no visit; some are introducing short stays. Malta requires genuine residence.",
    },
    {
      q: "Can it be taken away?",
      a: "Only in rare cases, such as fraud in the application or serious crime. Honest applications are not at risk.",
    },
    {
      q: "What is the cheapest route?",
      a: "São Tomé and Príncipe and Nauru start around USD 95,000 to 120,000. Cheapest is not always best; passport strength and reputation matter.",
    },
  ] as Faq[],
};

/* ------------------------------------------------------------------ UAE Golden Visa */
export const UAE = {
  eyebrow: "UAE Golden Visa",
  headline: "Long-term UAE residence through property, handled from our *Dubai office*",
  intro:
    "The UAE Golden Visa gives investors, entrepreneurs and skilled professionals a renewable residence of two, five or ten years, with no sponsor and no minimum time in the country. For property investors it is the most direct route, and EAM Global is based where the process happens. We walk with you from property selection to Emirates ID.",
  routes: [
    { route: "Standard purchase", value: "AED 400,000", approx: "about USD 110,000", who: "Investors aged 18+", length: "2 years" },
    { route: "Standard purchase", value: "AED 1,000,000", approx: "about USD 280,000", who: "Investors aged 55+", length: "5 years" },
    { route: "Standard purchase", value: "AED 2,000,000", approx: "about USD 550,000", who: "Investors aged 18+", length: "10 years" },
    { route: "Mortgaged purchase", value: "AED 2,000,000", approx: "with financing from approved local banks", who: "Any age", length: "10 years" },
    { route: "Off-plan purchase", value: "AED 2,000,000", approx: "across one or more units from approved developers", who: "Any age", length: "10 years" },
  ],
  routesNote:
    "The property must be held for the full visa period. Figures verified October 2026; confirm in your roadmap.",
  why: [
    "No personal income tax, no capital gains tax, no wealth tax",
    "Spouse and unmarried children of any age added without extra investment",
    "No minimum stay: living abroad does not cancel the visa",
    "A business hub between Africa, Asia and Europe with world-class schools and hospitals",
    "Strong property market with rental yields that often cover holding costs",
  ],
  process: [
    { title: "Free roadmap", body: "We confirm which route fits your age, budget and timeline." },
    { title: "Property", body: "We introduce vetted developers and agents, or review a property you have already chosen." },
    { title: "Title deed and valuation", body: "We obtain the documents the immigration authority requires." },
    { title: "Application", body: "Filed by us through the official channel." },
    { title: "Entry permit", body: "On initial approval you receive a six-month multiple-entry visa." },
    { title: "In Dubai", body: "We accompany you to the medical test and Emirates ID biometrics." },
    { title: "Visa issued", body: "Residence stamped, ID card delivered, and we help open a bank account." },
  ],
  timeline: "Typical timeline from complete file to issued visa: {{X}} weeks.",
  beyond:
    "The Golden Visa also covers entrepreneurs, specialised talent, scientists, outstanding students and certain professionals. If you are not buying property, your roadmap tells you which category fits.",
  faqs: [
    {
      q: "Can I get UAE citizenship this way?",
      a: "No. Citizenship follows a separate and restrictive process. The Golden Visa is long-term residence.",
    },
    { q: "Do I have to live in Dubai?", a: "No. There is no minimum stay requirement." },
    { q: "Can I work?", a: "Yes. The Golden Visa allows you to work and to sponsor family and domestic staff." },
    {
      q: "Is off-plan property risky?",
      a: "It carries project-completion risk. We only introduce developers on the approved list and explain escrow protection.",
    },
    {
      q: "What does EAM Global charge?",
      a: "A fixed fee agreed in writing before any payment, covered by No Win, No Fee.",
    },
  ] as Faq[],
};

/* ------------------------------------------------------------------ Visit visas */
export const VISIT = {
  eyebrow: "Tourist and Visit Visas",
  headline: "Visit visas done right *the first time*",
  intro:
    "A refused visit visa costs more than the fee: it sits on your record and makes the next application harder. Our team prepares your file the way consular officers want to see it, in your language, and tracks it until the decision.",
  destinations: ["United States", "United Kingdom", "Schengen countries", "Canada", "Australia", "UAE visit and transit visas", "{{others}}"],
  included: [
    "Eligibility check before you pay a government fee",
    "Document checklist tailored to your nationality and destination",
    "Form completion and appointment booking",
    "Cover letter, itinerary and sponsor documents prepared by us",
    "Interview preparation session for US and UK applications",
    "Case tracking and passport collection",
  ],
  turnaround: "Typical turnaround: {{X}} working days from complete file to submission.",
  proof: "Dr. Abdelhalim Shamout and family, USA visit visa, 2026 (video).",
};

/* ------------------------------------------------------------------ Legal translation & attestation */
export const LEGAL = {
  eyebrow: "Legal Translation and Attestation",
  headline: "Certified translations and attestations, accepted *the first time*",
  intro:
    "Almost every residence, citizenship or visa file is refused for the same small reason: a document translated by the wrong person or missing a stamp. We translate through Ministry of Justice-approved legal translators and handle the full attestation chain.",
  services: [
    { title: "Certified legal translation", body: "Arabic, English, Portuguese, Spanish, {{others}}" },
    { title: "Document attestation", body: "Notary, Ministry of Foreign Affairs, embassy, MOFA UAE" },
    { title: "Apostille", body: "For Hague Convention countries" },
    { title: "Personal certificates", body: "Degree, marriage, birth and police certificate attestation" },
    { title: "Commercial documents", body: "Commercial document attestation for company formation" },
  ],
  chain: ["Notary", "Ministry of Foreign Affairs", "Embassy", "MOFA UAE"],
  turnaround: "Turnaround: standard {{X}} working days; express available.",
};

/* ------------------------------------------------------------------ Company formation */
export const COMPANY = {
  eyebrow: "Company Formation",
  headline: "Your business base in the UAE or your new country, set up by *one team*",
  intro:
    "Many residence routes run through a company, and many clients want to trade from where they live. We form the company, obtain the licence and open the bank account, in the UAE or in the countries where we have teams.",
  options: [
    {
      option: "Mainland (DET) company",
      bestFor: "Trading with UAE market, government contracts",
      includes: "Trade licence, MOA, office lease support, visa quota",
    },
    {
      option: "Free zone company",
      bestFor: "100% ownership, international trade, holding structures",
      includes: "Licence, flexi-desk or office, residence visa for owner",
    },
    {
      option: "Offshore company",
      bestFor: "Asset holding, international invoicing",
      includes: "Registration, registered agent, bank introduction",
    },
  ],
  abroad: "Serbian company route for residence, Paraguayan and Brazilian company registration for investor visas, {{others}}.",
  also: ["Corporate bank account introductions", "VAT and corporate tax registration", "PRO services for staff visas"],
};

/* ------------------------------------------------------------------ Relocation */
export const RELOCATION = {
  eyebrow: "Travel, Tours and Door-to-Door Relocation",
  headline: "We meet you at the airport. We stay until *you're settled*.",
  intro:
    "The approval letter is the start of the hard part. Our relocation team handles the move itself: flights, hotel, pickup, every appointment, and a guide who knows the city and speaks your language.",
  includes: [
    "Flight and hotel booking, or temporary housing",
    "Airport pickup and city orientation",
    "Local SIM and transport setup",
    "Accompanied visits to immigration, medical, biometrics, tax and bank",
    "Housing search and tenancy support",
    "School visits and enrolment guidance",
    "Guided tours of neighbourhoods and the city for the family",
  ],
  travel:
    "Visa plus flights plus hotel packages for Dubai visitors, guided Dubai and UAE tours, and travel arrangements for clients visiting a destination before they commit.",
  pricing: "Fixed package price per family, agreed in the roadmap.",
  tiers: [
    { name: "Arrival", scope: "Airport to hotel plus one appointment", price: "{{Price}}" },
    { name: "Settled", scope: "Your first week", price: "{{Price}}" },
    { name: "Home", scope: "Your first month", price: "{{Price}}" },
  ],
  schools: [
    "School visits and enrolment guidance",
    "School enrolment guidance in your first month",
    "Access to local healthcare, schools and universities through your residence",
  ],
  property: [
    "Housing search and tenancy support",
    "Property that doubles as an investment and a residence qualification",
    "UAE Golden Visa property routes from AED 400,000",
    "Brazil investor visa (real estate) with our local partner",
  ],
};

/* ------------------------------------------------------------------ Free roadmap */
export const ROADMAP = {
  eyebrow: "Free Roadmap",
  headline: "Your free, personal, step-by-step *roadmap*",
  intro:
    "Tell us where you want to go and what you want to achieve. Within 48 hours you receive a written plan built for your nationality, family and budget. Keep it, compare it, take it to another firm if you like. No payment, no obligation.",
  why: "Competitors offer a “free consultation” that is a sales call. Your roadmap is a written document you keep.",
  confirmation:
    "Thank you. An advisor will message you on WhatsApp within 60 minutes to confirm a few details, and your written roadmap will follow within 48 hours.",
};

/* ------------------------------------------------------------------ How it works */
export const HOW = {
  eyebrow: "How It Works",
  headline: "Five steps. One team. *No surprises*.",
  steps: [
    { step: "You message us", what: "Any channel, any hour. A real advisor replies and asks a few questions.", who: "You, your advisor", time: "Within 60 minutes" },
    { step: "Free roadmap", what: "Written plan: programs, documents, steps, timeline, full costs.", who: "EAM Global", time: "Within 48 hours" },
    { step: "Agreement", what: "Fixed fee in writing, No Win, No Fee terms, payment schedule.", who: "You, EAM Global", time: "Same day" },
    { step: "Preparation and filing", what: "Documents collected, translated, attested, filed. Case tracked and reported to you weekly.", who: "EAM Global", time: "Program dependent" },
    { step: "Arrival and settlement", what: "Local team meets you, completes every appointment with you, stays until you are settled.", who: "Local team, you", time: "First month" },
  ],
  after:
    "After step 5: renewals, adding family members, and planning the next step (permanent residence or citizenship) with the same advisor.",
};

/* ------------------------------------------------------------------ FAQ */
export const FAQS: Faq[] = [
  {
    q: "Who is EAM Global?",
    a: "A Dubai-headquartered migration and document-clearing firm with local teams in Latin America and Europe, founded by Alaa Marzouk in {{year}}. Licence {{number}}.",
  },
  {
    q: "Which languages do you work in?",
    a: "English, Arabic, Portuguese and Spanish at head office, plus the local language of each destination through our teams there.",
  },
  { q: "How fast will you answer?", a: "Within 60 minutes, 24 hours a day, 7 days a week, on WhatsApp, phone, email or the web form." },
  { q: "Is the roadmap really free?", a: "Yes. It is a written document you keep, with no obligation to proceed." },
  {
    q: "What does No Win, No Fee mean?",
    a: "If your application is refused, EAM Global refunds its professional fees. Government, embassy and third-party costs are not refundable. Full terms are in your agreement.",
  },
  {
    q: "Do you guarantee approval?",
    a: "No one can. Governments decide. We guarantee honest pre-screening so you know your chances before paying, and a refund of our fees if it does not work.",
  },
  { q: "Can I choose only part of the service?", a: "Yes. Packages range from application-only to the full Door-to-Door relocation." },
  { q: "Where are your offices?", a: "Dubai (head office), plus {{Brazil, Argentina, Paraguay, Serbia, …}}. See Our Presence." },
  {
    q: "Do you handle tourist visas as well?",
    a: "Yes. Visit visas for the USA, UK, Schengen, Canada, Australia and the UAE are a core service.",
  },
  { q: "How do I start?", a: "Send a message or request your free roadmap. Both buttons are on every page." },
];

/* ------------------------------------------------------------------ Contact */
export const CONTACT = {
  eyebrow: "Contact",
  headline: "Talk to a real person *now*",
  line: "Whatever the hour, whatever the language, an advisor replies within 60 minutes.",
};

/* ------------------------------------------------------------------ Country: Brazil */
export const BRAZIL = {
  eyebrow: "Brazil · Residence by Investment",
  headline: "Brazil. Investor residence now, citizenship *later*.",
  heroLine: "Portuguese-speaking team from day one.",
  minimum: "{{BRL amount}}",
  wording:
    "Brazil does not sell citizenship. It grants residence to investors and others, and citizenship follows naturalisation after a period of residence.",
  routesNote: "Thresholds change; our Brazil team confirms the current figures in your free roadmap.",
  routes: [
    {
      route: "Investor visa (business)",
      requirement: "Investment of {{BRL amount}} in a Brazilian company, or lower with job creation or innovation",
      outcome: "Residence; naturalisation after {{X}} years",
    },
    {
      route: "Investor visa (real estate)",
      requirement: "Purchase of property worth {{BRL amount}} ({{lower}} in the North and Northeast)",
      outcome: "Residence; naturalisation after {{X}} years",
    },
    { route: "Retiree residence", requirement: "Proof of monthly pension of {{USD amount}}", outcome: "Residence" },
    { route: "Digital nomad visa", requirement: "Remote income of {{USD amount}} a month", outcome: "One-year residence, renewable" },
  ],
  gets: [
    "The right to live, work and study",
    "Family included",
    "Access to Brazil's public and private healthcare",
    "A Brazilian passport after naturalisation with visa-free access to roughly 170 destinations",
  ],
  life: [
    "Brazil is a continent-sized country; São Paulo is business, Rio is lifestyle, Florianópolis is where many newcomers settle.",
    "Portuguese is spoken almost exclusively, and English is rare outside tourist areas.",
    "International schools and private hospitals are excellent in the large cities.",
    "Pick your city before your visa.",
  ],
  team: {
    who: "{{Name}}, based in {{city}}, Portuguese and English.",
    does: ["CPF registration", "Polícia Federal appointment", "Bank account", "Housing"],
  },
  process: [
    { title: "Free roadmap", time: "Within 48 hours" },
    { title: "Investment structuring with our local partner" },
    { title: "Consular or in-country filing" },
    { title: "Residence card (CRNM) collection with our team" },
    { title: "Naturalisation planning at the right time", time: "After {{X}} years" },
  ],
  costs: [
    { label: "Government and program fees", value: "As published" },
    { label: "Translations and attestations", value: "At cost" },
    { label: "EAM Global fixed fee", value: "{{AED/USD}}, covered by No Win, No Fee" },
  ],
  faqs: [
    {
      q: "Can I buy Brazilian citizenship?",
      a: "No. Brazil does not sell citizenship. It grants residence to investors and others, and citizenship follows naturalisation after a period of residence. We plan that step with you at the right time.",
    },
    {
      q: "Can I qualify through property?",
      a: "Yes. The real-estate investor visa is based on the purchase of property worth {{BRL amount}}, with a lower threshold in the North and Northeast. Our Brazil team confirms the current figure in your roadmap.",
    },
    {
      q: "Do I need to speak Portuguese?",
      a: "Portuguese is spoken almost exclusively, and English is rare outside tourist areas. That is exactly why our team speaks it for you, from the first appointment to the last.",
    },
    {
      q: "Which city should we choose?",
      a: "São Paulo is business, Rio is lifestyle, Florianópolis is where many newcomers settle. Pick your city before your visa; your roadmap compares them for your family.",
    },
    {
      q: "What does EAM Global charge?",
      a: "A fixed fee agreed in writing before you pay. Government fees are as published, translations and attestations at cost, and our fee is covered by No Win, No Fee.",
    },
  ] as Faq[],
};

/* ------------------------------------------------------------------ Country: Argentina */
export const ARGENTINA = {
  eyebrow: "Argentina · Residence & Citizenship",
  headline: "Argentina. Residence today, citizenship from *Q4 2026*.",
  heroLine: "Spanish-speaking team in Buenos Aires.",
  routes: [
    {
      route: "Rentista / pensioner residence",
      requirement: "Proof of at least USD 1,500 monthly passive income or pension",
      outcome: "Temporary residence, renewable; citizenship possible after two years of residence under current law",
    },
    {
      route: "Citizenship by investment: contribution",
      requirement: "USD 350,000 non-refundable contribution to the national treasury",
      outcome: "Direct citizenship; program expected to open Q4 2026",
    },
    {
      route: "Citizenship by investment: bond",
      requirement: "USD 800,000 government bond created for the program",
      outcome: "Direct citizenship; program expected to open Q4 2026",
    },
  ],
  gets: [
    "The right to live and work",
    "Spouse and children included",
    "An Argentine passport with visa-free access to roughly 170 destinations",
    "Free movement across MERCOSUR (Brazil, Paraguay, Uruguay and associated states)",
  ],
  life: [
    "Buenos Aires is a European-style capital at Latin American prices.",
    "Spanish is essential for daily life, which is exactly why our team speaks it for you.",
    "Private healthcare and international schools are good and affordable.",
    "Winters are mild, summers hot.",
    "The economy is volatile; keep savings in hard currency.",
  ],
  team: {
    who: "{{Name}}, based in Buenos Aires, Spanish and English.",
    does: ["Meets you at Ezeiza airport", "Migraciones and the tax authority", "Bank account", "Housing"],
  },
  process: [
    { title: "Free roadmap", time: "2 days" },
    { title: "Document collection and translation", time: "2–4 weeks" },
    { title: "Filing", time: "Program dependent" },
    { title: "Decision", time: "{{X}} months" },
    { title: "Arrival and settlement with our team", time: "First month" },
  ],
  costs: [
    { label: "Government and program fees", value: "As published" },
    { label: "Translations and attestations", value: "At cost" },
    { label: "EAM Global fixed fee", value: "{{AED/USD}}, covered by No Win, No Fee" },
  ],
  faqs: [
    {
      q: "When does the citizenship program open?",
      a: "Argentina announced the program on 2 October 2026, with applications expected to open in the last quarter of 2026. Register interest and we will contact you as soon as filing opens.",
    },
    {
      q: "What are the two investment routes?",
      a: "A non-refundable contribution of USD 350,000 to the national treasury, or a USD 800,000 subscription to a dedicated government bond.",
    },
    {
      q: "Can I live in Argentina before then?",
      a: "Yes. The rentista or pensioner residence asks for proof of at least USD 1,500 monthly passive income or pension, and citizenship is possible after two years of residence under current law.",
    },
    {
      q: "What checks will applicants pass?",
      a: "Checks on identity, source of funds, criminal record, reputation and immigration history, in line with OECD and FATF standards. We pre-screen your file before any government fee is paid.",
    },
    {
      q: "Who helps us on the ground?",
      a: "Our Spanish-speaking team in Buenos Aires meets you at Ezeiza airport, accompanies you to Migraciones and the tax authority, and helps you open a bank account and find housing.",
    },
  ] as Faq[],
};

/* ------------------------------------------------------------------ Testimonials page */
export const TESTIMONIALS_PAGE = {
  eyebrow: "Testimonials",
  headline: "Real families. Real *approvals*.",
  intro:
    "Our founder meets clients in person when their visa or permit arrives. These are their words, not ours. Filter by program and language; every video carries captions in English and Portuguese.",
};

/* ------------------------------------------------------------------ Placeholder pages */
export const PLACEHOLDER_PAGES = {
  privacy: { title: "Privacy", body: "{{Privacy policy to be supplied by EAM Global before launch.}}" },
  terms: { title: "Terms", body: "{{Terms of service to be supplied by EAM Global before launch.}}" },
  careers: { title: "Careers", body: "{{Careers content to be supplied by EAM Global before launch.}}" },
} as const;
