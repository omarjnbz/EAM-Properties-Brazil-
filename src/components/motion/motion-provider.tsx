"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type Lenis from "lenis";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Engine = { lenis: Lenis | null; gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let engine: Engine | null = null;
let booting: Promise<Engine | null> | null = null;
let lastPath: string | null = null;

const motionAllowed = () =>
  document.documentElement.getAttribute("data-net") !== "lite" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Touch screens (phones, tablets, Chrome's device mode) keep the browser's own
 * scrolling: momentum scroll is what feels native there, and JavaScript-driven
 * smooth scrolling plus scroll-scrubbed effects were most of the main-thread
 * work on a phone-sized, 3x-density screen (measured Nov 2026).
 */
const touchScreen = () => window.matchMedia("(pointer: coarse)").matches;

/** Loads GSAP once, on fast connections only, plus Lenis smooth scrolling where there's a mouse or trackpad. */
function boot(): Promise<Engine | null> {
  if (engine) return Promise.resolve(engine);
  if (booting) return booting;
  if (!motionAllowed()) return Promise.resolve(null);
  const smooth = !touchScreen();
  booting = Promise.all([smooth ? import("lenis") : null, import("gsap"), import("gsap/ScrollTrigger")]).then(([lenisMod, gsapMod, stMod]) => {
    const { gsap } = gsapMod;
    const { ScrollTrigger } = stMod;
    gsap.registerPlugin(ScrollTrigger);
    let lenis: Lenis | null = null;
    if (lenisMod) {
      lenis = new lenisMod.default({ lerp: 0.1, smoothWheel: true, anchors: { offset: -96 } });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    engine = { lenis, gsap, ScrollTrigger };
    return engine;
  });
  return booting;
}

/** Scroll-linked effects, declared with data attributes in server components. */
function setupEffects({ gsap, ScrollTrigger }: Engine) {
  // Phones: only the effects that carry meaning (stacked cards, progress lines).
  // Parallax, the hero fade and image zooms are decoration that costs a repaint per scroll frame.
  const decorative = !touchScreen();
  const ctx = gsap.context(() => {
    // Parallax: [data-parallax="12"] moves by 12% of its height across its section.
    if (decorative) gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const amount = Number(el.dataset.parallax || 10);
      const trigger = el.closest<HTMLElement>("[data-parallax-root]") ?? el;
      gsap.fromTo(
        el,
        { yPercent: 0 },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: true } },
      );
    });

    // Hero content drifts up and fades as the hero scrolls away.
    if (decorative) gsap.utils.toArray<HTMLElement>("[data-hero-fade]").forEach((el) => {
      const trigger = el.closest<HTMLElement>("[data-parallax-root]") ?? el;
      gsap.to(el, { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger, start: "top top", end: "60% top", scrub: true } });
    });

    // Stacked sticky cards: each card recedes as the next one slides over it.
    gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((stack) => {
      const cards = Array.from(stack.querySelectorAll<HTMLElement>("[data-stack-card]"));
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.firstElementChild, {
          scale: 0.92,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    });

    // Timeline progress lines fill as their list scrolls through the viewport.
    gsap.utils.toArray<HTMLElement>("[data-scrub-line]").forEach((el) => {
      const trigger = el.parentElement ?? el;
      gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger, start: "top 70%", end: "bottom 55%", scrub: true } });
    });

    // Images that settle from a slight zoom as they enter.
    if (decorative) gsap.utils.toArray<HTMLElement>("[data-zoom-in]").forEach((el) => {
      gsap.fromTo(el, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 60%", scrub: true } });
    });
  });
  ScrollTrigger.refresh();
  return () => ctx.revert();
}

/**
 * Smooth scrolling (Lenis) and scroll-linked effects (GSAP ScrollTrigger).
 * Never loads on 2G/3G/Data Saver or for visitors who prefer reduced motion,
 * so the site stays fully usable, and light, without it.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const isRouteChange = lastPath !== null && lastPath !== pathname;
    lastPath = pathname;
    boot().then((e) => {
      if (!e || cancelled) return;
      if (isRouteChange && !window.location.hash) {
        if (e.lenis) e.lenis.scrollTo(0, { immediate: true, force: true });
      }
      // Let the new route paint before measuring.
      requestAnimationFrame(() => {
        if (!cancelled) cleanup = setupEffects(e);
      });
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

/** Scroll to an element or position, smoothly when Lenis is running. */
export function scrollToTarget(target: string | number | HTMLElement) {
  if (engine?.lenis) {
    engine.lenis.scrollTo(target, { offset: -96 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Pause or resume smooth scrolling (for overlays such as the mobile menu). */
export function setScrollLocked(locked: boolean) {
  if (!engine?.lenis) return;
  if (locked) engine.lenis.stop();
  else engine.lenis.start();
}
