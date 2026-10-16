import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import { SEO } from "@/content/pages";
import { SITE } from "@/content/site";
import { SiteNav } from "@/components/layout/site-nav";
import { EndCta } from "@/components/layout/end-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { MotionProvider } from "@/components/motion/motion-provider";

// Not preloaded: on 2G/3G and Data Saver the site uses system fonts and never downloads it.
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SEO.home.title, template: "%s" },
  description: SEO.home.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en",
    title: SEO.home.title,
    description: SEO.home.description,
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f4f1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="relative min-h-dvh bg-canvas text-ink">
        <div id="nav-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-12" />
        <a
          href="#main"
          className="fixed start-4 top-4 z-[70] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white transition-transform duration-300 focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <EndCta />
        <SiteFooter />
        <WhatsappFab />
        <ChatLauncher />
        <MotionProvider />
      </body>
    </html>
  );
}
