import type { Metadata } from "next";
import { BRAZIL, SEO } from "@/content/pages";
import brazilHouse from "@/assets/stock/brazil-house-stone.jpg";
import { BrazilMap } from "@/components/art/maps";
import { CountryPage } from "@/components/page/country-page";

export const metadata: Metadata = {
  title: SEO.brazil.title,
  description: SEO.brazil.description,
  alternates: { canonical: "/residence-by-investment/brazil" },
};

export default function BrazilPage() {
  return (
    <CountryPage
      data={{
        eyebrow: BRAZIL.eyebrow,
        headline: BRAZIL.headline,
        heroLine: BRAZIL.heroLine,
        crumbs: [{ label: "Residence by Investment", href: "/residence-by-investment" }, { label: "Brazil" }],
        heroImage: brazilHouse,
        heroImageAlt: "A modern house with palm trees in Praia do Forte, Bahia, Brazil",
        heroCaption: "Investor visa (real estate): property worth {{BRL amount}}",
        routesTitle: "Investor, retiree and *remote* routes",
        routesIntro: "Four ways to live in Brazil legally. Your free roadmap confirms which fits your family, your budget and your city.",
        routesNote: BRAZIL.routesNote,
        routes: BRAZIL.routes,
        gets: BRAZIL.gets,
        life: BRAZIL.life,
        lifeAside: <BrazilMap tone="ink" className="mx-auto max-w-[340px]" />,
        team: {
          who: BRAZIL.team.who,
          does: BRAZIL.team.does,
          city: "São Paulo",
          timeZone: "America/Sao_Paulo",
          languages: "Portuguese and English",
        },
        process: BRAZIL.process,
        costs: BRAZIL.costs,
        faqs: BRAZIL.faqs,
        testimonialIds: ["brazil-residence"],
        primaryCta: { label: "Get my Brazil roadmap", href: "/free-roadmap?destination=brazil" },
        wording:
          "A pathway to citizenship: Brazil grants residence first, and citizenship follows naturalisation after a period of residence. We plan that step with you at the right time.",
      }}
    />
  );
}
