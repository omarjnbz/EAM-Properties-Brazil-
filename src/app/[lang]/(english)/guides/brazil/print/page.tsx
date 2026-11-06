import type { Metadata } from "next";
import { GUIDES } from "@/content/guides";
import { GuidePrint } from "@/components/guides/guide-print";

/** Print layout for the downloadable PDF (rendered by `npm run guides:pdf`). */
export const metadata: Metadata = {
  title: `${GUIDES.brazil.title} · ${GUIDES.brazil.edition}`,
  robots: { index: false, follow: false },
};

export default function GuideBrazilPrintPage() {
  return <GuidePrint guide={GUIDES.brazil} />;
}
