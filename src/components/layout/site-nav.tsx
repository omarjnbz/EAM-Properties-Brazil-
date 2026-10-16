"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { Phone } from "@phosphor-icons/react/dist/csr/Phone";
import logo from "@/assets/brand/eam-global-logo.png";
import { NAV, type NavItem } from "@/content/nav";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";
import { setScrollLocked } from "@/components/motion/motion-provider";

/** Pages that open on a full-bleed dark photo, where the bar starts white-on-image. */
const DARK_HERO = new Set(["/"]);

const afterPaint = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

/**
 * Navigation bar that starts full width and transparent, then condenses into a
 * floating white pill once the page scrolls. Menus mount on first use, so their
 * 100+ links never weigh down the initial HTML on slow connections.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openState, setOpenState] = useState<{ label: string; path: string } | null>(null);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const [panelsMounted, setPanelsMounted] = useState(false);
  const [mobileMounted, setMobileMounted] = useState(false);
  const open = openState && openState.path === pathname ? openState.label : null;
  const mobileOpen = mobilePath === pathname;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const onImage = DARK_HERO.has(pathname) && !scrolled && !mobileOpen;

  // Condense once the page has scrolled a little (the sentinel lives in the layout).
  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const openMenu = useCallback(
    (label: string) => {
      clearTimeout(closeTimer.current);
      if (!panelsMounted) {
        setPanelsMounted(true);
        afterPaint(() => setOpenState({ label, path: pathname }));
        return;
      }
      setOpenState({ label, path: pathname });
    },
    [pathname, panelsMounted],
  );
  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenState(null), 160);
  }, []);

  const toggleMobile = () => {
    if (!mobileMounted) {
      setMobileMounted(true);
      afterPaint(() => setMobilePath(pathname));
      return;
    }
    setMobilePath(mobileOpen ? null : pathname);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenState(null);
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenState(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobilePath(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      setScrollLocked(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const condensed = scrolled || mobileOpen;

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 md:pt-4"
      onMouseLeave={scheduleClose}
      onPointerEnter={() => setPanelsMounted(true)}
      onFocusCapture={() => setPanelsMounted(true)}
    >
      <div className="relative w-full max-w-[1240px]">
        <nav
          aria-label="Main"
          className={cn(
            "relative z-[2] mx-auto flex items-center gap-2 rounded-full transition-[max-width,background-color,box-shadow,padding] duration-500 ease-fluid",
            condensed
              ? "max-w-[1100px] bg-white/92 py-1.5 ps-4 pe-1.5 shadow-[0_1px_2px_rgba(11,27,47,0.06),0_18px_40px_-20px_rgba(11,27,47,0.28)] ring-1 ring-ink/[0.06] backdrop-blur-xl"
              : "max-w-[1240px] bg-transparent py-2 ps-2 pe-2 md:ps-4",
          )}
        >
          <AppLink
            href="/"
            className={cn("me-1 flex shrink-0 items-center rounded-full transition-[background-color,padding] duration-500 ease-fluid", onImage ? "bg-white/95 px-3 py-1" : "px-0 py-0")}
            aria-label="EAM Global home"
          >
            <Image src={logo} alt="EAM Global" width={104} height={41} loading="eager" className="h-8 w-auto md:h-9" />
          </AppLink>

          <ul className="hidden flex-1 items-center justify-center gap-0.5 xl:flex">
            {NAV.map((item) => (
              <li key={item.label} onMouseEnter={() => openMenu(item.label)}>
                <button
                  type="button"
                  aria-expanded={open === item.label}
                  aria-controls={panelsMounted ? `menu-${slug(item.label)}` : undefined}
                  onClick={() => (open === item.label ? setOpenState(null) : openMenu(item.label))}
                  onFocus={() => open && open !== item.label && openMenu(item.label)}
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[14px] font-medium transition-colors duration-300 xl:px-3",
                    onImage ? "text-white/85 hover:text-white" : "text-ink-2 hover:text-ink",
                    open === item.label && (onImage ? "bg-white/15 text-white" : "bg-ink/[0.05] text-ink"),
                  )}
                >
                  {item.label}
                  <CaretDown weight="bold" aria-hidden className={cn("size-3 opacity-60 transition-transform duration-300", open === item.label && "rotate-180")} />
                </button>
              </li>
            ))}
          </ul>

          <div className="ms-auto flex items-center gap-1.5 xl:ms-0">
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp: a real advisor replies within 60 minutes"
              title="Reply in 60 min"
              className={cn(
                "hidden h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[13px] font-medium transition-colors duration-300 sm:inline-flex",
                onImage ? "text-white/90 hover:bg-white/10" : "text-ink-2 hover:bg-ink/[0.05]",
              )}
            >
              <WhatsappLogo weight="regular" className="size-[18px]" aria-hidden />
              <span className={cn("hidden", !condensed && "xl:inline")}>Reply in 60 min</span>
            </a>
            <AppLink
              href="/free-roadmap"
              className="inline-flex h-10 items-center whitespace-nowrap rounded-full bg-leaf px-4 text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(62,105,11,0.7)] transition-[background-color,transform] duration-300 hover:bg-leaf-deep active:scale-[0.97]"
            >
              Free Roadmap
            </AppLink>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobileMounted ? "mobile-menu" : undefined}
              onClick={toggleMobile}
              className={cn("grid size-10 place-items-center rounded-full xl:hidden", onImage ? "bg-white/15 text-white" : "bg-ink text-white")}
            >
              <span className="relative block h-3 w-[18px]">
                <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-transform duration-500 ease-fluid", mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
                <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-transform duration-500 ease-fluid", mobileOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0")} />
              </span>
            </button>
          </div>
        </nav>

        {panelsMounted && NAV.map((item) => <MenuPanel key={item.label} item={item} open={open === item.label} onEnter={() => openMenu(item.label)} />)}
      </div>

      {mobileMounted && <MobileMenu open={mobileOpen} onClose={() => setMobilePath(null)} />}
    </header>
  );
}

/* ------------------------------------------------------------------ Desktop dropdown */
function MenuPanel({ item, open, onEnter }: { item: NavItem; open: boolean; onEnter: () => void }) {
  const mega = item.columns.length > 1;
  return (
    <div
      id={`menu-${slug(item.label)}`}
      onMouseEnter={onEnter}
      className={cn(
        "absolute start-1/2 top-full z-[2] hidden -translate-x-1/2 pt-3 xl:block rtl:translate-x-1/2",
        mega ? "w-[min(1010px,calc(100vw-3rem))]" : "w-[560px]",
        open ? "visible" : "invisible",
      )}
    >
      <div
        className={cn(
          "rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.06),0_30px_70px_-30px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06] transition-[opacity,transform,filter] duration-500 ease-fluid",
          open ? "translate-y-0 opacity-100 blur-0" : "-translate-y-1.5 opacity-0 blur-[2px]",
        )}
      >
        <div className={cn("grid gap-8", item.pinned ? "grid-cols-[240px_1fr]" : "grid-cols-1")}>
          {item.pinned && (
            <div className="flex flex-col gap-2">
              {item.pinned.map((p) => (
                <AppLink key={p.href} href={p.href} className="group rounded-2xl bg-canvas p-4 transition-colors duration-300 hover:bg-paper-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[16px] font-semibold tracking-[-0.02em]">{p.label}</span>
                    <ArrowUpRight weight="bold" className="size-3.5 text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </div>
                  {p.badge && <span className="mt-2 inline-block rounded-full bg-leaf-soft px-2 py-0.5 text-[11px] font-medium text-leaf-deep">{p.badge}</span>}
                  {p.description && <p className="mt-2 text-[13px] leading-snug text-ink-3">{p.description}</p>}
                </AppLink>
              ))}
            </div>
          )}
          <div className={cn(mega ? cn("grid gap-x-8 gap-y-2", item.columns.length === 4 ? "grid-cols-4" : "grid-cols-3") : "grid grid-cols-2 gap-x-4 gap-y-1")}>
            {item.columns.map((col) =>
              mega ? (
                <div key={col.title} className="mb-3">
                  <div className="mb-2 text-[12px] font-medium text-ink-3">{col.title}</div>
                  <ul className="flex flex-col">
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <AppLink href={l.href} className="flex items-center gap-2 py-[5px] text-[14px] text-ink-2 transition-colors duration-200 hover:text-ink">
                          {l.label}
                          {l.badge && (
                            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", l.badge.startsWith("New") ? "bg-sun-soft text-[#7a5a0c]" : "bg-leaf-soft text-leaf-deep")}>{l.badge}</span>
                          )}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                col.links.map((l) => (
                  <AppLink key={l.href + l.label} href={l.href} className="group rounded-2xl p-3 transition-colors duration-200 hover:bg-canvas">
                    <span className="block text-[14.5px] font-medium text-ink">{l.label}</span>
                    {l.description && <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{l.description}</span>}
                  </AppLink>
                ))
              ),
            )}
          </div>
        </div>
        {item.footer && (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-[12.5px] text-ink-3">Figures as publicly listed, October 2026. Your free roadmap confirms the current figure.</span>
            <AppLink href={item.footer.href} className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
              {item.footer.label}
              <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </AppLink>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Mobile overlay */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      id="mobile-menu"
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-[1] flex flex-col overflow-y-auto bg-canvas/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 ease-fluid xl:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="flex min-h-full flex-col px-5 pb-10 pt-24">
        <ul className="flex flex-col">
          {NAV.map((item, i) => (
            <li
              key={item.label}
              className={cn("border-b border-line transition-[opacity,transform,filter] duration-700 ease-fluid", open ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm")}
              style={{ transitionDelay: open ? `${60 + i * 50}ms` : "0ms" }}
            >
              <details className="group/acc">
                <summary className="flex cursor-pointer items-center justify-between py-4 text-[1.6rem] font-medium tracking-[-0.03em]">
                  {item.label}
                  <CaretDown weight="bold" className="size-4 text-ink-3 transition-transform duration-500 ease-fluid group-open/acc:rotate-180" aria-hidden />
                </summary>
                <div className="flex flex-col gap-1 pb-5">
                  {item.pinned?.map((p) => (
                    <AppLink key={p.href} href={p.href} onClick={onClose} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[15px] font-medium shadow-[0_1px_2px_rgba(11,27,47,0.06)]">
                      {p.label}
                      {p.badge && <span className="text-[11px] font-medium text-leaf-deep">{p.badge}</span>}
                    </AppLink>
                  ))}
                  <AppLink href={item.href} onClick={onClose} className="px-4 py-2.5 text-[15px] text-ink-2">
                    Overview
                  </AppLink>
                  {item.columns.length === 1 &&
                    item.columns[0].links.map((l) => (
                      <AppLink key={l.href + l.label} href={l.href} onClick={onClose} className="px-4 py-2.5 text-[15px] text-ink-2">
                        {l.label}
                      </AppLink>
                    ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
        <div
          className={cn("mt-8 flex flex-col gap-3 transition-[opacity,transform] duration-700 ease-fluid", open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}
          style={{ transitionDelay: open ? "380ms" : "0ms" }}
        >
          <AppLink href="/free-roadmap" onClick={onClose} className="flex h-12 items-center justify-center rounded-full bg-leaf text-[15px] font-medium text-white">
            Get your free roadmap
          </AppLink>
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white">
            <WhatsappLogo className="size-[18px]" aria-hidden /> Talk to an advisor now · 24/7
          </a>
          <div className="mt-4 flex items-center justify-between text-[14px] text-ink-3">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2">
              <Phone className="size-4" aria-hidden /> {SITE.phoneDisplay}
            </a>
            <span className="text-[12px] font-medium tracking-[0.06em]">EN · PT · AR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
