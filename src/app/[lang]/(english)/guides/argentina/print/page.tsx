import type { Metadata } from "next";
import { GUIDES } from "@/content/guides";
import { GuidePrint } from "@/components/guides/guide-print";

/** Print layout for the downloadable PDF (rendered by `npm run guides:pdf`). */
export const metadata: Metadata = {
  title: `${GUIDES.argentina.title} · ${GUIDES.argentina.edition}`,
  robots: { index: false, follow: false },
};

export default function GuideArgentinaPrintPage() {
  return <GuidePrint guide={GUIDES.argentina} />;
}
