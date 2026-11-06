import type { Locale } from "@/i18n/config";

/**
 * Program country and region names in Arabic and Portuguese, keyed by the
 * English name used in content/programs.ts. Links and form values keep using
 * the English name, so only what the visitor reads changes.
 */
const COUNTRIES = {
  "Antigua and Barbuda": { ar: "أنتيغوا وباربودا", pt: "Antígua e Barbuda" },
  Argentina: { ar: "الأرجنتين", pt: "Argentina" },
  Australia: { ar: "أستراليا", pt: "Austrália" },
  Austria: { ar: "النمسا", pt: "Áustria" },
  Bahrain: { ar: "البحرين", pt: "Bahrein" },
  Brazil: { ar: "البرازيل", pt: "Brasil" },
  Bulgaria: { ar: "بلغاريا", pt: "Bulgária" },
  Canada: { ar: "كندا", pt: "Canadá" },
  "Cayman Islands": { ar: "جزر كايمان", pt: "Ilhas Cayman" },
  "Costa Rica": { ar: "كوستاريكا", pt: "Costa Rica" },
  Cyprus: { ar: "قبرص", pt: "Chipre" },
  Dominica: { ar: "دومينيكا", pt: "Dominica" },
  "Dominican Republic": { ar: "جمهورية الدومينيكان", pt: "República Dominicana" },
  Egypt: { ar: "مصر", pt: "Egito" },
  Greece: { ar: "اليونان", pt: "Grécia" },
  Grenada: { ar: "غرينادا", pt: "Granada" },
  "Hong Kong": { ar: "هونغ كونغ", pt: "Hong Kong" },
  Hungary: { ar: "المجر", pt: "Hungria" },
  Italy: { ar: "إيطاليا", pt: "Itália" },
  Jersey: { ar: "جيرزي", pt: "Jersey" },
  Jordan: { ar: "الأردن", pt: "Jordânia" },
  Latvia: { ar: "لاتفيا", pt: "Letônia" },
  Luxembourg: { ar: "لوكسمبورغ", pt: "Luxemburgo" },
  Malaysia: { ar: "ماليزيا", pt: "Malásia" },
  Maldives: { ar: "جزر المالديف", pt: "Maldivas" },
  Malta: { ar: "مالطا", pt: "Malta" },
  Mauritius: { ar: "موريشيوس", pt: "Maurício" },
  Mexico: { ar: "المكسيك", pt: "México" },
  Monaco: { ar: "موناكو", pt: "Mônaco" },
  Montenegro: { ar: "الجبل الأسود", pt: "Montenegro" },
  Namibia: { ar: "ناميبيا", pt: "Namíbia" },
  "Nauru (Naoero)": { ar: "ناورو", pt: "Nauru" },
  "New Zealand": { ar: "نيوزيلندا", pt: "Nova Zelândia" },
  Panama: { ar: "بنما", pt: "Panamá" },
  Paraguay: { ar: "باراغواي", pt: "Paraguai" },
  Portugal: { ar: "البرتغال", pt: "Portugal" },
  "Saudi Arabia": { ar: "المملكة العربية السعودية", pt: "Arábia Saudita" },
  Serbia: { ar: "صربيا", pt: "Sérvia" },
  Singapore: { ar: "سنغافورة", pt: "Singapura" },
  "St. Kitts and Nevis": { ar: "سانت كيتس ونيفيس", pt: "São Cristóvão e Névis" },
  "St. Lucia": { ar: "سانت لوسيا", pt: "Santa Lúcia" },
  Switzerland: { ar: "سويسرا", pt: "Suíça" },
  "São Tomé and Príncipe": { ar: "ساو تومي وبرينسيبي", pt: "São Tomé e Príncipe" },
  Thailand: { ar: "تايلاند", pt: "Tailândia" },
  "The Bahamas": { ar: "جزر البهاما", pt: "Bahamas" },
  Türkiye: { ar: "تركيا", pt: "Turquia" },
  "United Arab Emirates": { ar: "الإمارات العربية المتحدة", pt: "Emirados Árabes Unidos" },
  "United Kingdom": { ar: "المملكة المتحدة", pt: "Reino Unido" },
  "United States": { ar: "الولايات المتحدة", pt: "Estados Unidos" },
  Uruguay: { ar: "الأوروغواي", pt: "Uruguai" },
} satisfies Record<string, Record<Exclude<Locale, "en">, string>>;

const REGIONS = {
  Europe: { ar: "أوروبا", pt: "Europa" },
  "Middle East": { ar: "الشرق الأوسط", pt: "Oriente Médio" },
  "The Americas": { ar: "الأمريكتان", pt: "Américas" },
  Americas: { ar: "الأمريكتان", pt: "Américas" },
  Caribbean: { ar: "الكاريبي", pt: "Caribe" },
  "Asia and Oceania": { ar: "آسيا وأوقيانوسيا", pt: "Ásia e Oceania" },
  Africa: { ar: "أفريقيا", pt: "África" },
  Oceania: { ar: "أوقيانوسيا", pt: "Oceania" },
} satisfies Record<string, Record<Exclude<Locale, "en">, string>>;

type Table = Record<string, Record<Exclude<Locale, "en">, string>>;
const lookup = (table: Table, name: string, locale: Locale) => (locale === "en" ? name : (table[name]?.[locale] ?? name));

/** A program country's name in the visitor's language (falls back to English). */
export const countryName = (name: string, locale: Locale) => lookup(COUNTRIES, name, locale);

/** A program region's name in the visitor's language (falls back to English). */
export const regionName = (name: string, locale: Locale) => lookup(REGIONS, name, locale);
