import type { Metadata } from "next";
import { GUIDES } from "@/content/guides";
import { SEO } from "@/content/pages";
import { GuidePage } from "@/components/guides/guide-page";

export const metadata: Metadata = {
  title: SEO.guideBrazil.title,
  description: SEO.guideBrazil.description,
  alternates: { canonical: "/guides/brazil" },
};

export default function GuideBrazilPage() {
  return <GuidePage guide={GUIDES.brazil} />;
}
