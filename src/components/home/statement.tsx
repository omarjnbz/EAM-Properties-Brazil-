import { Container } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";

/** The positioning in one breath, blurring into focus as it scrolls in. */
export function Statement() {
  return (
    <section aria-label="What makes EAM Global different" className="bg-canvas py-24 md:py-36">
      <Container className="max-w-[1000px]">
        <SplitHeading
          as="p"
          groupSize={4}
          text="*The big firms sell programs.* We sell the whole move: the language, the arrival, the first weeks, and the guarantee that you only pay our fee when it works."
          className="text-center text-[clamp(1.75rem,3.6vw,2.9rem)] font-medium leading-[1.18] tracking-[-0.035em] text-balance"
          emClassName="text-ink-3/60"
        />
      </Container>
    </section>
  );
}
