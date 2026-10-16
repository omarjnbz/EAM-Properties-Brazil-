import Image, { type StaticImageData } from "next/image";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";
import { Button, Container, Eyebrow } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/split-heading";
import { Rich } from "@/components/ui/rich";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  /** Right-hand photo (preferred) ... */
  image?: StaticImageData;
  imageAlt?: string;
  imagePosition?: string;
  /** Small caption chip over the photo. */
  imageCaption?: string;
  /** ... or any custom aside. */
  aside?: React.ReactNode;
  ctas?: boolean;
  primary?: { label: string; href: string };
  children?: React.ReactNode;
  className?: string;
};

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

/** Inner-page hero: breadcrumb, title and calls to action, with a photo beside them. */
export function PageHero({ eyebrow, title, intro, crumbs, image, imageAlt = "", imagePosition, imageCaption, aside, ctas = true, primary, children, className }: Props) {
  const side = image ? (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper-2 sm:aspect-[5/4] lg:aspect-[4/5]">
      <div className="load-zoom absolute inset-0">
        <Image src={image} alt={imageAlt} fill preload placeholder="blur" sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" style={{ objectPosition: imagePosition ?? "50% 50%" }} />
      </div>
      {imageCaption && (
        <span className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-[13.5px] font-medium backdrop-blur-md">
          <Rich text={imageCaption} />
        </span>
      )}
    </div>
  ) : (
    aside
  );

  return (
    <section className={cn("relative overflow-hidden bg-canvas pb-16 pt-32 md:pb-24 md:pt-40", className)}>
      <Container className="relative">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="load-blur mb-8" style={d(0)}>
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
              <li>
                <AppLink href="/" className="transition-colors hover:text-ink">
                  Home
                </AppLink>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <CaretRight weight="bold" className="size-2.5" aria-hidden />
                  {c.href ? (
                    <AppLink href={c.href} className="transition-colors hover:text-ink">
                      {c.label}
                    </AppLink>
                  ) : (
                    <span aria-current="page" className="text-ink-2">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={cn("grid gap-12 lg:gap-14", side ? "lg:grid-cols-12 lg:items-center" : undefined)}>
          <div className={cn(side ? "lg:col-span-7" : "max-w-4xl")}>
            <div className="load-blur" style={d(80)}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <SplitHeading
              as="h1"
              trigger="load"
              delay={160}
              text={title}
              className="mt-6 text-[clamp(2.5rem,5.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.045em] text-balance"
              emClassName="text-ink-3/60"
            />
            {intro && (
              <p className="load-blur mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-3 text-pretty" style={d(520)}>
                <Rich text={intro} />
              </p>
            )}
            {children}
            {ctas && (
              <div className="load-blur mt-8 flex flex-wrap gap-3" style={d(640)}>
                <Button href={primary?.href ?? "/free-roadmap"} size="lg">
                  {primary?.label ?? SITE.cta.roadmap}
                </Button>
                <Button href={SITE.whatsappHref} variant="ghost" size="lg" icon="whatsapp">
                  {SITE.cta.talk}
                </Button>
              </div>
            )}
          </div>
          {side && (
            <div className="load-blur lg:col-span-5" style={d(360)}>
              {side}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
