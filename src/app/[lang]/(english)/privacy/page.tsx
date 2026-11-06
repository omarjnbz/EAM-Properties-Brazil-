import type { Metadata } from "next";
import { PLACEHOLDER_PAGES } from "@/content/pages";
import { PlaceholderPage } from "@/components/page/placeholder-page";

export const metadata: Metadata = {
  title: "Privacy · EAM Global",
  robots: { index: false },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PlaceholderPage title={PLACEHOLDER_PAGES.privacy.title} body={PLACEHOLDER_PAGES.privacy.body} />;
}
