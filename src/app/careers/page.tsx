import type { Metadata } from "next";
import { PLACEHOLDER_PAGES } from "@/content/pages";
import { PlaceholderPage } from "@/components/page/placeholder-page";

export const metadata: Metadata = {
  title: "Careers · EAM Global",
  robots: { index: false },
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return <PlaceholderPage title={PLACEHOLDER_PAGES.careers.title} body={PLACEHOLDER_PAGES.careers.body} />;
}
