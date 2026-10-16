import logo from "@/assets/brand/eam-global-logo.png";
import { SEO } from "@/content/pages";
import { FOUNDER, PRESENCE, SITE, SOCIAL } from "@/content/site";
import { TESTIMONIALS } from "@/content/testimonials";
import { plain } from "@/components/ui/rich";

/**
 * Structured data for search engines (schema.org JSON-LD). Only confirmed facts
 * go in: anything still in {{braces}} on the site (address, licence, team
 * cities) is left out until the client confirms it.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const abs = (path: string) => new URL(path, SITE.url).toString();
const ORG_ID = `${SITE.url}/#organization`;
const confirmed = (s: string) => !s.includes("{{");

/** The business: name, contact channels, languages, founder and the countries it serves. */
export function OrganizationJsonLd() {
  const sameAs = SOCIAL.flatMap((s) => (s.url ? [s.url] : []));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE.name,
        url: SITE.url,
        logo: abs(logo.src),
        image: abs(logo.src),
        description: SEO.home.description,
        slogan: "We don't just get you the visa. We get you home.",
        email: SITE.email,
        telephone: SITE.phoneHref.replace("tel:", ""),
        address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
        areaServed: PRESENCE.map((p) => ({ "@type": "Country", name: p.country })),
        knowsLanguage: ["en", "ar", "pt", "es"],
        founder: { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.role, knowsLanguage: [...FOUNDER.languages] },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: SITE.phoneHref.replace("tel:", ""),
            email: SITE.email,
            availableLanguage: ["English", "Arabic", "Portuguese", "Spanish"],
            hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
          },
        ],
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

/** Breadcrumb trail for an inner page. */
export function BreadcrumbJsonLd({ crumbs, path }: { crumbs: { label: string; href?: string }[]; path?: string }) {
  const items = [{ label: "Home", href: "/" }, ...crumbs].filter((c) => confirmed(c.label));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          ...(c.href ? { item: abs(c.href) } : i === items.length - 1 && path ? { item: abs(path) } : {}),
        })),
      }}
    />
  );
}

/** The client films that exist today, so they can appear in video search results. */
export function VideoJsonLd() {
  const films = TESTIMONIALS.filter((t) => t.video);
  if (!films.length) return null;
  return (
    <JsonLd
      data={films.map((t) => ({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${plain(t.client)} · ${t.program}`,
        description: `${plain(t.client)} on securing a ${t.program.toLowerCase()} with EAM Global, filmed at our ${t.place.toLowerCase()} with founder ${FOUNDER.name}.`,
        thumbnailUrl: [abs(t.video!.poster.src)],
        contentUrl: abs(t.video!.src),
        uploadDate: t.video!.uploadDate,
        duration: t.video!.isoDuration,
        inLanguage: t.video!.inLanguage,
        publisher: { "@id": ORG_ID },
      }))}
    />
  );
}
