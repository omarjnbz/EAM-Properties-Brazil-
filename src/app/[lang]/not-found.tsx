import type { Metadata } from "next";
import { Button, Container } from "@/components/ui/primitives";
import { Stamp } from "@/components/art/stamp";

export const metadata: Metadata = { title: "Page not found · EAM Global" };

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-32">
      <Container className="flex flex-col items-start gap-8">
        <Stamp id="not-found" ring="NOT FOUND • RETURN TO SENDER • EAM GLOBAL • " center="404" sub="NOT FOUND" rotate={-10} className="size-36 text-navy" />
        <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em]">
          This page has <em className="text-leaf-deep">moved abroad</em>.
        </h1>
        <p className="max-w-lg text-[17px] text-ink-3">The address you followed does not exist. Start again from the homepage or ask a real advisor on WhatsApp.</p>
        <Button href="/">Back to the homepage</Button>
      </Container>
    </section>
  );
}
