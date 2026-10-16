import type { Metadata } from "next";
import { PLACEHOLDER_PAGES } from "@/content/pages";
import { PlaceholderPage } from "@/components/page/placeholder-page";

export const metadata: Metadata = {
  title: "Terms · EAM Global",
  robots: { index: false },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PlaceholderPage title={PLACEHOLDER_PAGES.terms.title} body={PLACEHOLDER_PAGES.terms.body} />;
}
