"use client";

import { Fragment, useEffect, useEffectEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { Copy as CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/csr/DotsThreeVertical";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { ListChecks } from "@phosphor-icons/react/dist/csr/ListChecks";
import { Microphone } from "@phosphor-icons/react/dist/csr/Microphone";
import { PaperPlaneRight } from "@phosphor-icons/react/dist/csr/PaperPlaneRight";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { Stop } from "@phosphor-icons/react/dist/csr/Stop";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { X } from "@phosphor-icons/react/dist/csr/X";
import type { Dictionary } from "@/content/i18n";
import { PLAN_VALUES, danielTopic } from "@/content/daniel";
import { SITE } from "@/content/site";
import { pathWithoutLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";
import { fill, type DanielRequest } from "@/components/daniel/bus";
import { HandoffCard, PlanButton, ProgramCard, parseReply, whatsappWith } from "@/components/daniel/cards";
import { AiChip, DanielMark, type DanielState } from "@/components/daniel/daniel-mark";
import { clearChat, loadChat, newId, saveChat, type ChatMessage, type Notes, type PlanAnswers, type PlanKey } from "@/components/daniel/memory";
import { NotesCard, answersLine } from "@/components/daniel/notes-card";
import { useDictation, useReadAloud } from "@/components/daniel/speech";

type Copy = Dictionary["chat"];

/** Links the model may produce: site pages and EAM Global's own contact channels only. */
function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href === SITE.emailHref || href === SITE.phoneHref || href.startsWith(SITE.whatsappHref.split("?")[0])) return href;
  return null;
}

/** Renders **bold**, [label](href) and bare site paths (/free-roadmap) inside one line of a reply. */
function Inline({ text, onNavigate, seePage }: { text: string; onNavigate: () => void; seePage: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|(?<=^|[\s(])\/[a-z][a-z0-9/-]*(?:#[a-z0-9-]+)?)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold)
      return (
        <strong key={i} className="font-semibold text-ink">
          <Inline text={bold[1]} onNavigate={onNavigate} seePage={seePage} />
        </strong>
      );
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    const link = md ? { label: md[1], href: md[2] } : /^\/[a-z]/.test(part) ? { label: seePage, href: part } : null;
    if (link) {
      const href = safeHref(link.href);
      if (!href) return <Fragment key={i}>{link.label}</Fragment>;
      const className = "font-medium text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy";
      return href.startsWith("/") ? (
        <AppLink key={i} href={href} onClick={onNavigate} className={className}>
          {link.label}
        </AppLink>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {link.label}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Paragraphs and "- " lists, the only block formatting Daniel is asked to use. */
function Reply({ text, onNavigate, seePage }: { text: string; onNavigate: () => void; seePage: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  // The model often writes non-breaking hyphens (U+2011), which would break page paths.
  for (const raw of text.replace(/‑/g, "-").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const item = line.match(/^[-*•]\s+(.*)$/);
    const list = !!item;
    const last = blocks.at(-1);
    if (last && last.list === list && list) last.lines.push(item![1]);
    else blocks.push({ list, lines: [list ? item![1] : line] });
  }
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) =>
        b.list ? (
          <ul key={i} className="flex list-disc flex-col gap-1 ps-5 marker:text-ink-3">
            {b.lines.map((l, j) => (
              <li key={j}>
                <Inline text={l} onNavigate={onNavigate} seePage={seePage} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines[0]} onNavigate={onNavigate} seePage={seePage} />
          </p>
        ),
      )}
    </div>
  );
}

/** Plain text of a reply, for reading aloud and for the transcript. */
function plainReply(content: string) {
  const { text, cards } = parseReply(content);
  const names = cards.flatMap((c) => ("country" in c ? [c.country] : []));
  const body = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => (href.startsWith("/") ? `${label} (${SITE.url}${href})` : label));
  return names.length ? `${body}\n[${names.join(", ")}]` : body;
}

const PLAN_ORDER: PlanKey[] = ["goal", "destination", "budget", "family", "timeline"];

/** The dictionary greeting for translated pages, else the English page topics, else the general one. */
function topicFor(copy: Copy, path: string) {
  if (path === "/") return copy.pages.home;
  if (path === "/contact") return copy.pages.contact;
  return danielTopic(path) ?? copy.pages.fallback;
}

export default function ChatPanel({
  copy,
  locale,
  open,
  instant,
  onClose,
  request,
}: {
  copy: Copy;
  locale: Locale;
  open: boolean;
  /** Opened from the keyboard: appear without animation. */
  instant?: boolean;
  onClose: () => void;
  request: (DanielRequest & { id: number }) | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notes, setNotes] = useState<Notes | null>(null);
  const [plan, setPlan] = useState<{ step: number; answers: PlanAnswers } | null>(null);
  const [restored, setRestored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const sheetRef = useRef<HTMLElement>(null);
  // Opened to answer something (a quick reply, a program button): skip the typed hello and get on with it.
  const [typeIntro] = useState(() => !request);
  const drag = useRef<{ id: number; y: number; t: number; dy: number } | null>(null);
  const path = pathWithoutLocale(usePathname() ?? "/");
  const topic = topicFor(copy, path);

  const dictation = useDictation(locale, (text) => setInput(text));
  const reading = useReadAloud(locale);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Daniel remembers the last conversation (this browser only, 30 days).
  const restore = useEffectEvent(() => {
    const saved = loadChat();
    if (saved && saved.messages.length > 0) {
      setMessages(saved.messages);
      setNotes(saved.notes);
      setRestored(true);
    }
    setLoaded(true);
  });
  useEffect(() => restore(), []);

  useEffect(() => {
    if (loaded && !busy) saveChat(messages, notes);
  }, [loaded, busy, messages, notes]);

  // Keyboard focus on open, on larger screens only (on phones it would throw up the keyboard over the answer).
  useEffect(() => {
    if (open && window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus();
    if (!open) setMenu(false);
  }, [open]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  // Follow the conversation; before it starts, stay at the top so Daniel's intro reads from the beginning.
  useEffect(() => {
    if (messages.length === 0 && !plan) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, plan, notes?.status]);

  // Requests from the rest of the site ("Ask Daniel" buttons, the homepage box, selected text).
  const handled = useRef(0);
  const onRequest = useEffectEvent((r: DanielRequest & { id: number }) => {
    if (r.plan) startPlan();
    else if (r.message) send(r.message);
  });
  useEffect(() => {
    if (!request || !loaded || handled.current === request.id) return;
    handled.current = request.id;
    onRequest(request);
  }, [request, loaded]);

  // On phones the panel covers the page, so following a link closes it.
  const onNavigate = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) onClose();
  };

  /** `before` goes in ahead of the question; `after` follows Daniel's reply once it has arrived. */
  async function send(text: string, before: ChatMessage[] = [], after: ChatMessage[] = []) {
    const content = text.trim();
    if (!content || busy) return;
    reading.stop();
    if (dictation.listening) dictation.stop();
    if (plan && before.length === 0) setPlan(null);

    const userMsg: ChatMessage = { id: newId(), role: "user", content };
    const reply: ChatMessage = { id: newId(), role: "assistant", content: "" };
    const history = [...messagesRef.current, ...before, userMsg];
    setMessages((all) => [...all, ...before, userMsg, reply]);
    setInput("");
    setBusy(true);

    const update = (fn: (m: ChatMessage & { role: "assistant" }) => ChatMessage) =>
      setMessages((all) => all.map((m) => (m.id === reply.id && m.role === "assistant" ? fn(m) : m)));

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m): m is ChatMessage & { role: "user" | "assistant" } => (m.role === "user" || m.role === "assistant") && !m.local && !("error" in m && m.error) && !!m.content)
            .map(({ role, content }) => ({ role, content })),
          page: path,
          locale,
          cards: true,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error || copy.error);
      }
      // The server may have passed a phone number or email from the chat to the team.
      const lead = res.headers.get("X-Lead");
      if (lead === "sent" || lead === "failed") update((m) => ({ ...m, lead }));
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        update((m) => ({ ...m, content: m.content + value }));
      }
      update((m) => (m.content.trim() ? m : { ...m, error: true, content: copy.noAnswer }));
      if (after.length) setMessages((all) => [...all, ...after]);
    } catch (err) {
      if (controller.signal.aborted) return;
      update((m) => ({ ...m, error: true, content: err instanceof Error ? err.message : copy.error }));
    } finally {
      setBusy(false);
    }
  }

  /* ---------------------------------------------------------------- Plan my move */
  const steps = copy.plan.steps;

  function startPlan() {
    if (busy) return;
    setMenu(false);
    setPlan({ step: 0, answers: notes?.answers ?? {} });
    setMessages((all) => [
      ...all,
      { id: newId(), role: "assistant", content: copy.plan.intro, local: true },
      { id: newId(), role: "assistant", content: steps[0].q, local: true },
    ]);
  }

  function answerPlan(optionKey: string, label: string) {
    if (!plan) return;
    const step = steps[plan.step];
    const answers = { ...plan.answers, [step.key]: optionKey };
    const answer: ChatMessage = { id: newId(), role: "user", content: label, local: true };
    const next = plan.step + 1;
    if (next < steps.length) {
      setPlan({ step: next, answers });
      setMessages((all) => [...all, answer, { id: newId(), role: "assistant", content: steps[next].q, local: true }]);
      return;
    }
    // Done: Daniel shortlists programs for these answers (the summary repeats the last
    // tap, so it replaces that bubble), then shows his notes, ready to send.
    setPlan(null);
    setNotes((n) => ({ answers, name: n?.name ?? "", whatsapp: n?.whatsapp ?? "", status: "idle" }));
    setMessages((all) => all.filter((m) => m.role !== "notes"));
    messagesRef.current = messagesRef.current.filter((m) => m.role !== "notes");
    send(fill(copy.plan.summary, { answers: answersLine(copy, answers) }), [], [
      { id: newId(), role: "assistant", content: copy.plan.noted, local: true },
      { id: newId(), role: "notes" },
    ]);
  }

  async function sendNotes() {
    if (!notes) return;
    const current = notes;
    setNotes({ ...current, status: "sending", error: undefined });
    const a = current.answers;
    const value = (k: PlanKey) => (a[k] ? (PLAN_VALUES[k][a[k]!] ?? a[k]!) : "");
    const recent = messagesRef.current
      .filter((m) => m.role === "user" && !m.local)
      .slice(-3)
      .map((m) => `"${m.role === "user" ? m.content.slice(0, 160) : ""}"`)
      .join(" ");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          name: current.name,
          whatsapp: current.whatsapp,
          goal: value("goal"),
          destination: value("destination"),
          budget: value("budget"),
          familySize: value("family"),
          language: locale,
          message: [`Timeline: ${value("timeline") || "not given"}.`, `Planned with Daniel (AI chat) on ${path}.`, recent && `Recent questions: ${recent}`]
            .filter(Boolean)
            .join(" "),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || copy.notes.error);
      setNotes({ ...current, status: "sent" });
    } catch (err) {
      setNotes({ ...current, status: "error", error: err instanceof Error ? err.message : copy.notes.error });
    }
  }

  /* ---------------------------------------------------------------- Conversation menu */
  function transcript() {
    return messagesRef.current
      .flatMap((m) => (m.role === "notes" || !m.content ? [] : [`${m.role === "user" ? copy.menu.you : copy.name}: ${m.role === "assistant" ? plainReply(m.content) : m.content}`]))
      .join("\n\n");
  }

  function newConversation() {
    abortRef.current?.abort();
    reading.stop();
    clearChat();
    setMessages([]);
    setNotes(null);
    setPlan(null);
    setRestored(false);
    setBusy(false);
    setMenu(false);
    inputRef.current?.focus();
  }

  async function copyTranscript() {
    try {
      await navigator.clipboard.writeText(transcript());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
    setMenu(false);
  }

  /* ---------------------------------------------------------------- Drag down to close (phones) */
  // The sheet's transform is set directly while dragging (no React state per move),
  // then CSS takes over: back up on a short drag, down and closed on a long or fast one.
  function onDragStart(e: React.PointerEvent) {
    if (drag.current || !window.matchMedia("(width < 48rem)").matches) return;
    if ((e.target as HTMLElement).closest("button, a, [role=menu]")) return;
    drag.current = { id: e.pointerId, y: e.clientY, t: Date.now(), dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    sheetRef.current?.setAttribute("data-dragging", "");
  }
  function onDragMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !sheetRef.current) return;
    const raw = e.clientY - d.y;
    // Past the top edge it resists: the further up, the less it moves.
    d.dy = raw > 0 ? raw : -Math.sqrt(-raw) * 2;
    sheetRef.current.style.transform = `translate3d(0, ${d.dy}px, 0)`;
  }
  function onDragEnd(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const velocity = d.dy / Math.max(1, Date.now() - d.t);
    const sheet = sheetRef.current;
    sheet?.removeAttribute("data-dragging");
    if (sheet) sheet.style.transform = "";
    if (d.dy > 120 || (d.dy > 24 && velocity > 0.11)) onClose();
  }

  const hasConversation = messages.some((m) => m.role === "user");
  const last = messages.at(-1);
  const markState: DanielState = dictation.listening
    ? "listening"
    : busy
      ? last?.role === "assistant" && last.content
        ? "speaking"
        : "thinking"
      : reading.speakingId
        ? "speaking"
        : input
          ? "listening"
          : "idle";

  return (
    <section
      ref={sheetRef}
      id="site-chat"
      data-lenis-prevent
      data-no-daniel
      role="dialog"
      aria-label={copy.dialogLabel}
      aria-hidden={!open}
      inert={!open}
      data-open={open ? "" : undefined}
      data-instant={instant ? "" : undefined}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        if (menu) setMenu(false);
        else onClose();
      }}
      className="daniel-ui daniel-sheet fixed inset-x-0 bottom-0 z-50 flex h-[min(88dvh,720px)] flex-col overflow-hidden rounded-t-[26px] bg-surface pb-[env(safe-area-inset-bottom)] text-ink shadow-[0_-20px_60px_-20px_rgba(11,27,47,0.45)] ring-1 ring-ink/[0.08] md:inset-x-auto md:bottom-[84px] md:end-6 md:h-[min(74vh,640px)] md:w-[400px] md:rounded-[24px] md:pb-0 md:shadow-[0_30px_80px_-20px_rgba(11,27,47,0.45)]"
    >
      {/* Header: Daniel's mark mirrors what he is doing. On phones it is also the handle that drags the sheet down. */}
      <header
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        className="relative flex touch-none select-none items-center gap-3 border-b border-line bg-gradient-to-b from-paper/60 to-surface px-4 pt-5 pb-3.5 md:touch-auto md:pt-3.5"
      >
        <span aria-hidden className="absolute start-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/15 md:hidden rtl:translate-x-1/2" />
        <DanielMark size={42} state={markState} live />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[15.5px] font-semibold tracking-[-0.01em]">
            {copy.name}
            <AiChip label={copy.ai} />
          </p>
          <p className="truncate text-[12.5px] text-ink-3" aria-live="polite">
            {busy ? copy.typing : copy.role}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-haspopup="menu"
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          {copied ? <CheckCircle weight="fill" className="size-4 text-leaf-deep" aria-hidden /> : <DotsThreeVertical weight="bold" className="size-4" aria-hidden />}
          <span className="sr-only">{copied ? copy.menu.copied : copy.menu.label}</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <X className="size-4" aria-hidden />
          <span className="sr-only">{copy.close}</span>
        </button>

        {menu && (
          <div role="menu" aria-label={copy.menu.label} className="daniel-rise absolute end-3 top-[calc(100%-4px)] z-10 flex w-64 flex-col rounded-2xl bg-surface p-1.5 shadow-[0_18px_40px_-16px_rgba(11,27,47,0.45)] ring-1 ring-ink/[0.08]">
            <MenuItem icon={<ListChecks className="size-4" aria-hidden />} onClick={startPlan} disabled={busy}>
              {copy.planChip}
            </MenuItem>
            <MenuItem icon={<ArrowCounterClockwise className="size-4" aria-hidden />} onClick={newConversation} disabled={!hasConversation}>
              {copy.menu.newChat}
            </MenuItem>
            <MenuItem icon={<CopyIcon className="size-4" aria-hidden />} onClick={copyTranscript} disabled={!hasConversation}>
              {copy.menu.copy}
            </MenuItem>
            <MenuItem
              icon={<EnvelopeSimple className="size-4" aria-hidden />}
              href={`mailto:?subject=${encodeURIComponent(copy.menu.emailSubject)}&body=${encodeURIComponent(hasConversation ? transcript().slice(0, 1800) : "")}`}
              disabled={!hasConversation}
              onClick={() => setMenu(false)}
            >
              {copy.menu.email}
            </MenuItem>
            <MenuItem
              icon={<WhatsappLogo className="size-4" aria-hidden />}
              href={whatsappWith(hasConversation ? transcript() : undefined)}
              external
              disabled={!hasConversation}
              onClick={() => setMenu(false)}
            >
              {copy.menu.whatsapp}
            </MenuItem>
          </div>
        )}
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite" onClick={() => menu && setMenu(false)}>
        <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed">
          <p className="mx-auto max-w-[19rem] text-center text-[11.5px] leading-snug text-ink-3">
            {copy.intro} {copy.privacy}
          </p>

          {/* First open: Daniel "types" his hello, then his question, then the quick replies (globals.css .daniel-seq). */}
          <div className="daniel-seq flex flex-col gap-3" data-play="">
            <DanielRow mark>
              <Bubble said t={restored || !typeIntro ? 0 : 650}>
                {restored ? copy.helloBack : copy.hello}
              </Bubble>
            </DanielRow>
            {!hasConversation && !plan && (
              <>
                <DanielRow>
                  <Bubble said t={1450}>
                    {topic.question}
                  </Bubble>
                </DanielRow>
                <div className="flex flex-wrap gap-2 ps-8" style={{ "--t": "1450ms" } as React.CSSProperties}>
                  {topic.chips.map((c, i) => (
                    <button
                      key={c.q}
                      type="button"
                      onClick={() => send(c.q)}
                      style={{ "--i": i } as React.CSSProperties}
                      className="daniel-chip touch-manipulation select-none rounded-full bg-surface px-3 py-1.5 text-start text-[13px] text-ink-2 ring-1 ring-line transition-[background-color,color,scale] duration-150 ease-expo hover:bg-paper hover:text-ink active:scale-[0.97]"
                    >
                      {c.q}
                    </button>
                  ))}
                  <span className="daniel-chip" style={{ "--i": topic.chips.length } as React.CSSProperties}>
                    <PlanButton label={copy.planChip} onPlan={startPlan} />
                  </span>
                </div>
              </>
            )}
          </div>

          {messages.map((m, i) => {
            if (m.role === "notes") {
              return notes ? (
                <div key={m.id} className="ps-8">
                  <NotesCard copy={copy} notes={notes} onChange={setNotes} onSend={sendNotes} onNavigate={onNavigate} />
                </div>
              ) : null;
            }
            if (m.role === "user") {
              return (
                <div key={m.id} dir="auto" className="daniel-rise ms-auto max-w-[86%] whitespace-pre-wrap rounded-2xl rounded-se-md bg-navy px-4 py-2.5 text-white">
                  {m.content}
                </div>
              );
            }
            const isLast = i === messages.length - 1;
            const streaming = busy && isLast;
            const { text, cards } = parseReply(m.content, streaming);
            const prev = messages[i - 1];
            return (
              <DanielRow key={m.id} mark={prev?.role !== "assistant"} state={isLast ? markState : "idle"} live={isLast && busy}>
                {(text || cards.length === 0) && (
                  <Bubble error={m.error}>
                    {text ? (
                      <Reply text={text} onNavigate={onNavigate} seePage={copy.seePage} />
                    ) : (
                      <span className="inline-flex gap-1 py-1" role="status" aria-label={copy.typing}>
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="size-1.5 animate-pulse rounded-full bg-ink-3" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </span>
                    )}
                  </Bubble>
                )}
                {!streaming &&
                  cards.map((c) =>
                    c.kind === "handoff" ? (
                      <HandoffCard key="handoff" copy={copy} onNavigate={onNavigate} whatsappText={notes ? fill(copy.notes.whatsappText, { answers: answersLine(copy, notes.answers) }) : undefined} />
                    ) : c.kind === "plan" ? (
                      plan || isLast ? <PlanButton key="plan" label={copy.planChip} onPlan={startPlan} /> : null
                    ) : (
                      <ProgramCard key={c.kind + c.country} marker={c} copy={copy} locale={locale} onNavigate={onNavigate} />
                    ),
                  )}
                {m.lead === "sent" && (
                  <span className="daniel-rise inline-flex items-center gap-1.5 self-start rounded-full bg-leaf-soft px-2.5 py-1 text-[12px] font-medium text-leaf-deep">
                    <CheckCircle weight="fill" className="size-3.5" aria-hidden />
                    {copy.leadSent}
                  </span>
                )}
                {!streaming && !m.local && !m.error && text && reading.supported && (
                  <button
                    type="button"
                    onClick={() => (reading.speakingId === m.id ? reading.stop() : reading.speak(m.id, plainReply(m.content)))}
                    aria-pressed={reading.speakingId === m.id}
                    className="inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[11.5px] text-ink-3 transition-colors hover:bg-paper hover:text-ink"
                  >
                    {reading.speakingId === m.id ? <Stop weight="fill" className="size-3" aria-hidden /> : <SpeakerHigh className="size-3.5" aria-hidden />}
                    {reading.speakingId === m.id ? copy.stopReading : copy.readAloud}
                  </button>
                )}
              </DanielRow>
            );
          })}

          {plan && !busy && (
            <div className="flex flex-wrap justify-end gap-2 ps-8" role="group" aria-label={steps[plan.step].q}>
              {steps[plan.step].options.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => answerPlan(o.key, o.label)}
                  style={{ "--d": i * 40 } as React.CSSProperties}
                  className={cn(
                    "daniel-rise rounded-full px-3.5 py-1.5 text-[13px] ring-1 transition-colors",
                    plan.answers[steps[plan.step].key as PlanKey] === o.key ? "bg-navy/10 text-navy-deep ring-navy/30" : "bg-surface text-ink-2 ring-navy/20 hover:bg-navy hover:text-white",
                  )}
                >
                  {o.label}
                </button>
              ))}
              <span className="sr-only">
                {plan.step + 1} / {PLAN_ORDER.length}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line px-3 pt-3 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className={cn(
            "flex items-end gap-1.5 rounded-2xl bg-paper px-3 py-2 ring-1 transition-shadow",
            dictation.listening ? "ring-navy/40 shadow-[0_0_0_4px_rgba(14,86,158,0.08)]" : "ring-transparent focus-within:ring-navy/30",
          )}
        >
          <label htmlFor="chat-input" className="sr-only">
            {copy.inputLabel}
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={1000}
            dir="auto"
            placeholder={dictation.listening ? copy.listening : copy.placeholder}
            className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[16px] leading-snug outline-none placeholder:text-ink-3 md:text-[14.5px]"
          />
          {dictation.supported && (
            <button
              type="button"
              onClick={() => (dictation.listening ? dictation.stop() : dictation.start())}
              aria-pressed={dictation.listening}
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
                dictation.listening ? "bg-navy/10 text-navy" : "text-ink-3 hover:bg-paper-2 hover:text-ink",
              )}
            >
              {dictation.listening ? <Stop weight="fill" className="size-3.5" aria-hidden /> : <Microphone className="size-[18px]" aria-hidden />}
              <span className="sr-only">{dictation.listening ? copy.micStop : copy.mic}</span>
            </button>
          )}
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-white transition-opacity disabled:opacity-35"
          >
            <PaperPlaneRight weight="fill" className="size-4 rtl:-scale-x-100" aria-hidden />
            <span className="sr-only">{copy.send}</span>
          </button>
        </form>
        <p className="mt-1.5 text-center text-[11px] leading-snug text-ink-3">{copy.disclaimer}</p>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-leaf-deep hover:underline"
        >
          <WhatsappLogo weight="fill" className="size-4" aria-hidden />
          {copy.human}
        </a>
      </div>
    </section>
  );
}

/** One of Daniel's turns: his small mark at the start of a run, then bubbles and cards. */
function DanielRow({ children, mark, state = "idle", live }: { children: React.ReactNode; mark?: boolean; state?: DanielState; live?: boolean }) {
  return (
    <div className="daniel-rise flex items-start gap-2">
      {mark ? <DanielMark size={24} state={state} live={live} className="mt-1" /> : <span aria-hidden className="w-6 shrink-0" />}
      <div className="flex min-w-0 max-w-[86%] flex-col gap-2">{children}</div>
    </div>
  );
}

/** A chat bubble. `said` bubbles take part in the typing sequence: dots until `t` ms, then the words. */
function Bubble({ children, error, said, t }: { children: React.ReactNode; error?: boolean; said?: boolean; t?: number }) {
  return (
    <div
      dir="auto"
      style={said ? ({ "--t": `${t ?? 0}ms`, "--dots-x": "1rem" } as React.CSSProperties) : undefined}
      className={cn("rounded-2xl rounded-ss-md px-4 py-2.5", error ? "bg-sun-soft text-ink" : "bg-paper text-ink-2", said && "daniel-said")}
    >
      {said ? (
        <>
          <span className="daniel-typing" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="daniel-said-text block">{children}</span>
        </>
      ) : (
        children
      )}
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  href,
  external,
  disabled,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  disabled?: boolean;
}) {
  const cls = cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-start text-[13.5px] text-ink-2 transition-colors hover:bg-paper hover:text-ink",
    disabled && "pointer-events-none opacity-40",
  );
  if (href) {
    return (
      <a role="menuitem" href={href} onClick={onClick} aria-disabled={disabled} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button role="menuitem" type="button" onClick={onClick} disabled={disabled} className={cls}>
      {icon}
      {children}
    </button>
  );
}
