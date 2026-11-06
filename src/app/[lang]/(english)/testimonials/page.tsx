import type { Metadata } from "next";
import { SEO, TESTIMONIALS_PAGE } from "@/content/pages";
import { TESTIMONIALS } from "@/content/testimonials";
import { Container, Section } from "@/components/ui/primitives";
import { PageHero } from "@/components/page/page-hero";
import { TestimonialLibrary } from "@/components/testimonials/testimonial-library";
import { SocialLinks } from "@/components/ui/social-links";
import { VideoJsonLd } from "@/components/seo/json-ld";

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
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <p className="max-w-md text-[17px] font-medium leading-snug tracking-[-0.02em]">More client stories on our new channels.</p>
            <SocialLinks tone="dark" />
          </div>
        </Container>
        <VideoJsonLd />
      </Section>
    </>
  );
}
