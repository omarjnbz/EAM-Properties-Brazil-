import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Sans } from "next/font/google";
import "../globals.css";
import { BOOT_SCRIPT } from "@/lib/boot-script";
import { SITE } from "@/content/site";
import { buildNav } from "@/content/nav";
import { countryName, regionName } from "@/content/i18n/countries";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/cn";
import { SiteNav } from "@/components/layout/site-nav";
import { EndCta } from "@/components/layout/end-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { MotionProvider } from "@/components/motion/motion-provider";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { SiteAnalytics } from "@/components/analytics/site-analytics";

// Not preloaded: on 2G/3G and Data Saver the site uses system fonts and never downloads it.
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

// Arabic pages only (the class is set on <html lang="ar">), so English and Portuguese never download it.
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

/** English, Arabic and Portuguese are all prerendered; English is served at unprefixed URLs (next.config.ts). */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.home.title, template: "%s" },
    description: t.meta.home.description,
    applicationName: SITE.name,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META[locale].ogLocale,
      title: t.meta.home.title,
      description: t.meta.home.description,
      // app/opengraph-image.jpg sits above the [lang] root layout, so it is linked by hand.
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: `${SITE.name}: ${t.footer.blurb}` }],
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f4f1",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, t } = await getI18n();
  const meta = LOCALE_META[locale];
  const { text: navText, ...navCopy } = t.nav;
  const nav = buildNav(
    navText,
    (c) => countryName(c, locale),
    (r) => regionName(r, locale),
  );

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={cn(sans.variable, locale === "ar" && arabic.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="relative min-h-dvh bg-canvas text-ink">
        <div id="nav-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-12" />
        <a
          href="#main"
          className="fixed start-4 top-4 z-[70] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white transition-transform duration-300 focus:translate-y-0"
        >
          {t.common.skipToContent}
        </a>
        <SiteNav locale={locale} nav={nav} copy={{ nav: navCopy, common: t.common, language: t.language }} />
        <main id="main">{children}</main>
        <EndCta />
        <SiteFooter />
        <WhatsappFab />
        {/* Hidden until the Groq key is set on Vercel; without it every question gets "not configured yet". */}
        {process.env.GROQ_API_KEY ? <ChatLauncher copy={t.chat} /> : null}
        <MotionProvider />
        <OrganizationJsonLd />
        <SiteAnalytics />
      </body>
    </html>
  );
}
