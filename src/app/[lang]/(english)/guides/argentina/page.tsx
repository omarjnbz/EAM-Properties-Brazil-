import type { Metadata } from "next";
import { GUIDES } from "@/content/guides";
import { SEO } from "@/content/pages";
import { GuidePage } from "@/components/guides/guide-page";

export const metadata: Metadata = {
  title: SEO.guideArgentina.title,
  description: SEO.guideArgentina.description,
  alternates: { canonical: "/guides/argentina" },
};

export default function GuideArgentinaPage() {
  return <GuidePage guide={GUIDES.argentina} />;
}
