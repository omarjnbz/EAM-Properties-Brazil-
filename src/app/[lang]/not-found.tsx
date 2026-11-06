import type { Metadata } from "next";
import { getDictionary } from "@/i18n/server";
import { Button, Container } from "@/components/ui/primitives";
import { Rich } from "@/components/ui/rich";
import { Stamp } from "@/components/art/stamp";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.notFound };
}

export default async function NotFound() {
  const t = await getDictionary();
  return (
    <section className="relative overflow-hidden py-32">
      <Container className="flex flex-col items-start gap-8">
        <Stamp id="not-found" ring="NOT FOUND • RETURN TO SENDER • EAM GLOBAL • " center="404" sub="NOT FOUND" rotate={-10} className="size-36 text-navy" />
        <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em]">
          <Rich text={t.notFound.title} emClassName="text-leaf-deep" />
        </h1>
        <p className="max-w-lg text-[17px] text-ink-3">{t.notFound.body}</p>
        <Button href="/">{t.notFound.back}</Button>
      </Container>
    </section>
  );
}
