import { buildDestinationOptions } from "@/content/programs";
import { countryName, regionName } from "@/content/i18n/countries";
import { getI18n } from "@/i18n/server";
import { RoadmapForm } from "./roadmap-form";

/** The roadmap form with its words and destination list in the page's language. */
export async function LocalizedRoadmapForm(props: { variant?: "compact" | "full"; className?: string }) {
  const { locale, t } = await getI18n();
  const destinations = buildDestinationOptions(
    t.forms.destinations,
    (c) => countryName(c, locale),
    (r) => regionName(r, locale),
  );
  return <RoadmapForm {...props} copy={t.forms.roadmap} destinations={destinations} locale={locale} />;
}
