"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import type { Dictionary } from "@/content/i18n";
import { danielQuietPage } from "@/content/daniel";
import { pathWithoutLocale, splitLocale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { DANIEL_EVENT, fill, takeDanielQueue, type DanielRequest } from "@/components/daniel/bus";
import { AiChip, DanielMark } from "@/components/daniel/daniel-mark";
import { lastQuestion, markTeaserSeen, teaserSeen } from "@/components/daniel/memory";
import { SelectionAsk } from "@/components/daniel/selection-ask";

const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(loadPanel, { ssr: false });
const DanielTeaser = dynamic(() => import("@/components/daniel/teaser"), { ssr: false });

/** How long the greeting waits on screen before it tucks itself away. */
const TEASER_MS = 25_000;
/** On phones the greeting follows the launcher's pop-in, once it has landed. */
const TEASER_DELAY_PHONE = 900;

const noSubscribe = () => () => {};
const shortcutKey = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K");
const isPhone = () => window.matchMedia("(width < 48rem)").matches;
/** The visitor is filling in a form or using an embedded page (the booking calendar). */
const busyWithForm = () => !!document.activeElement?.closest("input, textarea, select, iframe, [contenteditable]");

/**
 * Daniel's home on every page: one "Ask Daniel" launcher, his greeting bubble,
 * "Ask Daniel" over selected text, and the ⌘K / "/" shortcut.
 *
 * Phones: the launcher stays out of the hero (which already has two actions)
 * and pops in once the visitor scrolls on (on the homepage, as his introduction
 * box leaves the screen), then the greeting grows out of it. The chat opens as
 * a bottom sheet over a dimmed page. WhatsApp lives in the hero, the menu and
 * the chat itself, not here.
 *
 * The chat panel and the greeting download only when needed, so Daniel never
 * weighs on the first page load (or on 2G/3G visitors who never open him).
 * Any part of the site opens him with openDaniel() (components/daniel/bus.ts).
 */
export function ChatLauncher({ copy }: { copy: Dictionary["chat"] }) {
  const pathname = usePathname() ?? "/";
  const locale = splitLocale(pathname).locale;
  const path = pathWithoutLocale(pathname);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  /** Phones: the launcher has popped in (always visible from tablet width up). */
  const [shown, setShown] = useState(false);
  /** Opened or closed from the keyboard: no animation for a shortcut. */
  const [instant, setInstant] = useState(false);
  const [request, setRequest] = useState<(DanielRequest & { id: number }) | null>(null);
  // The greeting belongs to the page it was shown on; leaving that page closes it.
  const [teaser, setTeaser] = useState<{ returning: string | null; path: string } | null>(null);
  const teaserTimer = useRef(0);
  /** The launcher's mark "speaks" while the greeting types out of it. */
  const [speaking, setSpeaking] = useState(false);
  const shortcut = useSyncExternalStore(noSubscribe, shortcutKey, () => null);

  function show(req: DanielRequest = {}, fromKeyboard = false) {
    loadPanel();
    window.clearTimeout(teaserTimer.current);
    setMounted(true);
    setOpen(true);
    setShown(true);
    setInstant(fromKeyboard);
    setTeaser(null);
    markTeaserSeen();
    if (req.message || req.plan) setRequest({ ...req, id: Date.now() });
  }

  function close(fromKeyboard = false) {
    setInstant(fromKeyboard);
    setOpen(false);
  }

  // openDaniel() from anywhere on the site, including taps made before hydration.
  const onOpen = useEffectEvent((req: DanielRequest) => show(req));
  useEffect(() => {
    const listener = (e: Event) => onOpen((e as CustomEvent<DanielRequest>).detail ?? {});
    window.addEventListener(DANIEL_EVENT, listener);
    // Taps made before hydration: replay the last one once the launcher is ready.
    const queued = takeDanielQueue();
    const replay = queued.length ? window.setTimeout(() => onOpen(queued.at(-1)!), 0) : 0;
    return () => {
      window.removeEventListener(DANIEL_EVENT, listener);
      window.clearTimeout(replay);
    };
  }, []);

  // ⌘K / Ctrl+K anywhere, or "/" when not typing, opens (or closes) Daniel, instantly.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const typing = !!target?.closest("input, textarea, select, [contenteditable]");
    const combo = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
    const slash = e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;
    if (!combo && !slash) return;
    e.preventDefault();
    if (open) {
      if (combo) close(true);
      else document.getElementById("chat-input")?.focus();
    } else show({}, true);
  });
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // Scrolled past the hero (or past Daniel's homepage box): pop the launcher in,
  // then, once per session, let the greeting grow out of it.
  const onScrolled = useEffectEvent(() => {
    const anchor = document.querySelector("[data-daniel-anchor]");
    const passed = anchor ? anchor.getBoundingClientRect().bottom < window.innerHeight * 0.4 : window.scrollY > window.innerHeight * 0.45;
    if (!passed) return false;
    setShown(true);
    if (!open && !mounted && !teaserSeen() && !danielQuietPage(path) && !busyWithForm()) {
      markTeaserSeen();
      const returning = lastQuestion();
      teaserTimer.current = window.setTimeout(() => setTeaser({ returning, path }), isPhone() ? TEASER_DELAY_PHONE : 0);
    }
    return true;
  });
  useEffect(() => {
    let done = false;
    let frame = 0;
    const check = () => {
      frame = 0;
      done = onScrolled();
      if (done) window.removeEventListener("scroll", listener);
    };
    const listener = () => {
      if (!done && !frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", listener, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", listener);
      cancelAnimationFrame(frame);
    };
  }, [path]);

  // The greeting never sits on top of a form: it tucks away as soon as the visitor
  // taps into a field, or into an embedded page (focus moving into an iframe blurs the window).
  useEffect(() => {
    if (!teaser) return;
    const away = () => window.setTimeout(() => busyWithForm() && setTeaser(null), 0);
    document.addEventListener("focusin", away);
    window.addEventListener("blur", away);
    return () => {
      document.removeEventListener("focusin", away);
      window.removeEventListener("blur", away);
    };
  }, [teaser]);

  useEffect(() => {
    if (!teaser) return;
    const timer = window.setTimeout(() => setTeaser(null), TEASER_MS);
    const talk = window.setTimeout(() => setSpeaking(true), 0);
    const hush = window.setTimeout(() => setSpeaking(false), 1300);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(talk);
      window.clearTimeout(hush);
      setSpeaking(false);
    };
  }, [teaser]);

  // Phones: while the sheet is up, the page behind it doesn't scroll.
  useEffect(() => {
    if (!open || !isPhone()) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, [open]);

  const hint = shortcut ? fill(copy.shortcutHint, { key: shortcut }) : undefined;

  return (
    <div className="daniel-ui">
      <button
        type="button"
        onPointerEnter={loadPanel}
        onPointerDown={loadPanel}
        onFocus={loadPanel}
        onClick={() => (open ? close() : show())}
        aria-expanded={open}
        aria-controls="site-chat"
        aria-keyshortcuts="Meta+K Control+K /"
        title={hint}
        data-shown={shown ? "" : undefined}
        className={cn(
          "daniel-fab group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-30 inline-flex touch-manipulation select-none items-center gap-2.5 rounded-full bg-ink py-1.5 ps-1.5 pe-4 text-[14.5px] font-medium text-white shadow-[0_18px_40px_-14px_rgba(11,27,47,0.6)] ring-1 ring-white/10 active:scale-[0.97] md:bottom-6 md:end-6 md:text-[14px]",
          open && "max-md:pointer-events-none max-md:opacity-0",
        )}
      >
        <span className="relative">
          <DanielMark size={38} state={speaking && !open ? "speaking" : "idle"} live />
          <span aria-hidden className="daniel-fab__ping" />
        </span>
        <span>{open ? copy.close : copy.open}</span>
        {!open && <AiChip label={copy.ai} tone="dark" />}
        {!open && shortcut && (
          <kbd className="hidden rounded-md bg-white/10 px-1.5 py-0.5 font-sans text-[11px] text-white/60 ring-1 ring-white/10 lg:inline-block">{shortcut}</kbd>
        )}
      </button>

      {teaser && teaser.path === path && !open && (
        <DanielTeaser
          copy={copy}
          path={path}
          returning={teaser.returning}
          onAsk={(q) => show({ message: q })}
          onPlan={() => show({ plan: true })}
          onContinue={() => show()}
          onDismiss={() => setTeaser(null)}
        />
      )}

      <SelectionAsk label={copy.ask.selection} template={copy.ask.selectionQuestion} onAsk={(q) => show({ message: q })} />

      {mounted && (
        <>
          {/* Phones: the page dims behind the sheet; a tap on it closes the chat. */}
          <div aria-hidden data-open={open ? "" : undefined} onClick={() => close()} className="daniel-backdrop fixed inset-0 z-40 bg-ink/45 md:hidden" />
          <ChatPanel copy={copy} locale={locale} open={open} instant={instant} onClose={() => close()} request={request} />
        </>
      )}
    </div>
  );
}
