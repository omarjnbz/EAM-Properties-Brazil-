"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react/dist/csr/PaperPlaneRight";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";

type Message = { role: "user" | "assistant"; content: string; error?: boolean };

const SUGGESTIONS = [
  "How does the UAE Golden Visa work?",
  "Which residence programs include Schengen?",
  "Can I get residence in Brazil?",
  "What does No Win, No Fee cover?",
];

/** Links the model may produce: site pages and EAM Global's own contact channels only. */
function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href === SITE.emailHref || href === SITE.phoneHref || href.startsWith(SITE.whatsappHref.split("?")[0])) return href;
  return null;
}

/** Renders **bold**, [label](href) and bare site paths (/free-roadmap) inside one line of a reply. */
function Inline({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|(?<=^|[\s(])\/[a-z][a-z0-9/-]*(?:#[a-z0-9-]+)?)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold)
      return (
        <strong key={i} className="font-semibold text-ink">
          <Inline text={bold[1]} onNavigate={onNavigate} />
        </strong>
      );
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    const link = md ? { label: md[1], href: md[2] } : /^\/[a-z]/.test(part) ? { label: "see page", href: part } : null;
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

/** Paragraphs and "- " lists, the only block formatting the assistant is asked to use. */
function Reply({ text, onNavigate }: { text: string; onNavigate: () => void }) {
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
                <Inline text={l} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines[0]} onNavigate={onNavigate} />
          </p>
        ),
      )}
    </div>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // On phones the panel covers the page, so following a link closes it.
  const onNavigate = () => {
    if (!window.matchMedia("(min-width: 768px)").matches) onClose();
  };

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...messages.filter((m) => !m.error), { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const update = (fn: (m: Message) => Message) =>
      setMessages((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error || "Something went wrong.");
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        update((m) => ({ ...m, content: m.content + value }));
      }
      update((m) => (m.content ? m : { ...m, error: true, content: "Sorry, I couldn't answer that. Please message an advisor on WhatsApp." }));
    } catch (err) {
      if (controller.signal.aborted) return;
      update((m) => ({ ...m, error: true, content: err instanceof Error ? err.message : "Something went wrong." }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="site-chat"
      data-lenis-prevent
      role="dialog"
      aria-label={`${SITE.name} assistant`}
      hidden={!open}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      className="fixed inset-x-2 bottom-2 z-50 flex h-[min(82dvh,640px)] flex-col overflow-hidden rounded-[22px] bg-surface text-ink shadow-[0_30px_80px_-20px_rgba(11,27,47,0.45)] ring-1 ring-ink/[0.08] motion-safe:animate-[fade-in_0.25s_ease-out] md:inset-x-auto md:bottom-[84px] md:end-6 md:h-[min(70vh,600px)] md:w-[390px]"
    >
      <header className="flex items-start gap-3 border-b border-line px-5 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-white">
          <Sparkle weight="fill" className="size-[18px]" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold tracking-[-0.01em]">{SITE.name} AI</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">
            AI answers from our website. A real advisor replies within 60 minutes on WhatsApp.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <X className="size-4" aria-hidden />
          <span className="sr-only">Close chat</span>
        </button>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" aria-live="polite">
        <div className="flex flex-col gap-3 text-[14.5px] leading-relaxed">
          <div className="max-w-[88%] rounded-2xl rounded-ss-md bg-paper px-4 py-3 text-ink-2">
            Hello! Ask me about residence, citizenship, visas or relocation. I answer in your language: Olá, Hola, مرحبا.
          </div>
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full bg-surface px-3 py-1.5 text-start text-[13px] text-ink-2 ring-1 ring-line transition-colors hover:bg-paper hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} dir="auto" className="ms-auto max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-se-md bg-navy px-4 py-3 text-white">
                {m.content}
              </div>
            ) : (
              <div
                key={i}
                dir="auto"
                className={cn(
                  "max-w-[88%] rounded-2xl rounded-ss-md px-4 py-3",
                  m.error ? "bg-sun-soft text-ink" : "bg-paper text-ink-2",
                )}
              >
                {m.content ? (
                  <Reply text={m.content} onNavigate={onNavigate} />
                ) : (
                  <span className="inline-flex gap-1 py-1" aria-label="Typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="size-1.5 animate-pulse rounded-full bg-ink-3" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-line px-3 pt-3 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl bg-paper px-3 py-2 ring-1 ring-transparent focus-within:ring-navy/30"
        >
          <label htmlFor="chat-input" className="sr-only">
            Your question
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
            placeholder="Type your question…"
            className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent py-1 text-[16px] leading-snug outline-none placeholder:text-ink-3 md:text-[14.5px]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-white transition-opacity disabled:opacity-35"
          >
            <PaperPlaneRight weight="fill" className="size-4 rtl:-scale-x-100" aria-hidden />
            <span className="sr-only">Send</span>
          </button>
        </form>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-leaf-deep hover:underline"
        >
          <WhatsappLogo weight="fill" className="size-4" aria-hidden />
          Prefer a person? Message an advisor on WhatsApp
        </a>
      </div>
    </section>
  );
}
