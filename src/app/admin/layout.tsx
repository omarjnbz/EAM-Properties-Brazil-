import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "../globals.css";

// The site's own typeface, so the admin reads as part of EAM Global.
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

/**
 * The admin panel's own root layout: outside app/[lang], so the English rewrite
 * never touches /admin, and without the site's navigation, chat or analytics.
 */
export const metadata: Metadata = {
  title: "Admin · EAM Global",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { themeColor: "#f4f4f1", colorScheme: "light" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-dvh bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
