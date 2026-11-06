import type { Metadata } from "next";
import { FAQS, SEO } from "@/content/pages";
import { PageHero } from "@/components/page/page-hero";
import { FaqSection } from "@/components/page/blocks";

export const metadata: Metadata = {
  title: SEO.faq.title,
  description: SEO.faq.description,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Straight answers, before you *pay anything*"
        intro="Who we are, how fast we answer, what the roadmap and the guarantee really mean, and how to start."
        crumbs={[{ label: "FAQ" }]}
      />
      <FaqSection faqs={FAQS} title="Everything families *ask us*" eyebrow="Questions & answers" tone="paper-2" />
    </>
  );
}
