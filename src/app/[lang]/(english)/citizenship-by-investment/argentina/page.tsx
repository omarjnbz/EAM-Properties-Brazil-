import type { Metadata } from "next";
import { ARGENTINA, SEO } from "@/content/pages";
import buenosAires from "@/assets/stock/buenos-aires-obelisco.jpg";
import { CountryPage } from "@/components/page/country-page";

export const metadata: Metadata = {
  title: SEO.argentina.title,
  description: SEO.argentina.description,
  alternates: { canonical: "/citizenship-by-investment/argentina" },
};

export default function ArgentinaPage() {
  return (
    <CountryPage
      data={{
        eyebrow: ARGENTINA.eyebrow,
        headline: ARGENTINA.headline,
        heroLine: ARGENTINA.heroLine,
        crumbs: [{ label: "Citizenship by Investment", href: "/citizenship-by-investment" }, { label: "Argentina" }],
        heroImage: buenosAires,
        heroImageAlt: "The Obelisco in Buenos Aires, Argentina",
        heroImagePosition: "50% 30%",
        heroCaption: "Citizenship from USD 350,000 · applications expected Q4 2026",
        routesTitle: "Residence today, *citizenship* next",
        routesIntro:
          "Applicants will pass checks on identity, source of funds, criminal record, reputation and immigration history, in line with OECD and FATF standards.",
        routes: ARGENTINA.routes,
        gets: ARGENTINA.gets,
        life: ARGENTINA.life,
        team: {
          who: ARGENTINA.team.who,
          does: ARGENTINA.team.does,
          city: "Buenos Aires",
          timeZone: "America/Argentina/Buenos_Aires",
          languages: "Spanish and English",
        },
        process: ARGENTINA.process,
        costs: ARGENTINA.costs,
        faqs: ARGENTINA.faqs,
        primaryCta: { label: "Register interest in Argentina", href: "/free-roadmap?destination=argentina" },
      }}
    />
  );
}
