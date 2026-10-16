import type { Metadata } from "next";
import { SEO, TESTIMONIALS_PAGE } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { Container, Section } from "@/components/ui/primitives";
import { PageHero } from "@/components/page/page-hero";
import { TestimonialLibrary } from "@/components/testimonials/testimonial-library";

export const metadata: Metadata = {
  title: SEO.testimonials.title,
  description: SEO.testimonials.description,
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow={TESTIMONIALS_PAGE.eyebrow} title={TESTIMONIALS_PAGE.headline} intro={TESTIMONIALS_PAGE.intro} crumbs={[{ label: "Testimonials" }]} />
      <Section tone="ink">
        <Container>
          <TestimonialLibrary items={TESTIMONIALS} />
        </Container>
      </Section>
    </>
  );
}
