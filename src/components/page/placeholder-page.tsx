import { Container, Section } from "@/components/ui/primitives";
import { Rich } from "@/components/ui/rich";
import { PageHero } from "./page-hero";

/** Legal and company pages whose content the client still has to supply. */
export function PlaceholderPage({ title, body }: { title: string; body: string }) {
  return (
    <>
      <PageHero eyebrow="EAM Global" title={title} crumbs={[{ label: title }]} ctas={false} />
      <Section tone="paper-2" className="pt-16 md:pt-20 lg:pt-24">
        <Container>
          <p className="max-w-2xl text-[18px] leading-relaxed text-ink-2">
            <Rich text={body} />
          </p>
        </Container>
      </Section>
    </>
  );
}
