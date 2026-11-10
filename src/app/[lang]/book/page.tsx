import type { Metadata } from "next";
import { languageAlternates } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { BookCall } from "@/components/booking/book-call";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    title: t.booking.metaTitle,
    description: t.booking.metaDescription,
    alternates: languageAlternates("/book", locale),
  };
}

/** Book a paid video call with the founder. The chat assistant and the contact page link here. */
export default async function BookPage() {
  const { t } = await getI18n();
  return <BookCall copy={t.booking} as="h1" id="calendar" className="pt-32 md:pt-40" />;
}
