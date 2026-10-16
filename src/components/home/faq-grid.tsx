import { FAQS, type Faq } from "@/content/pages";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Rich, plain } from "@/components/ui/rich";
import { Disclosure } from "@/components/ui/disclosure";

/** Two columns of independent questions, with FAQ structured data. */
export function FaqGrid({ faqs = FAQS, title = "Questions families ask *before they start*", intro = "Straight answers on who we are, how fast we reply, the free roadmap and what No Win, No Fee really covers." }: { faqs?: readonly Faq[]; title?: string; intro?: string }) {
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
  };
  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow="FAQ" title={title} className="lg:col-span-7" />
          <Reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2" delay={120}>
            <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{intro}</p>
            <Button href="/contact" variant="ink">
              Contact us
            </Button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-2.5 md:mt-16 md:grid-cols-2">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2.5">
              {col.map((f, i) => (
                <Reveal key={f.q} delay={i * 60}>
                  <Disclosure title={f.q} defaultOpen={ci === 0 && i === 0}>
                    <Rich text={f.a} />
                  </Disclosure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Section>
  );
}
