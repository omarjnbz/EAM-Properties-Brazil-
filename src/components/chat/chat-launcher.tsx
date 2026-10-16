"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { cn } from "@/lib/cn";

const loadPanel = () => import("./chat-panel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

/**
 * Floating "Ask AI" button. The chat panel downloads on first hover or
 * tap, so it never weighs on the first page load (or on 2G/3G visitors who never
 * open it). On mobile it sits above the WhatsApp button.
 */
export function ChatLauncher() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        onClick={() => {
          setMounted(true);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls="site-chat"
        className={cn(
          "fixed bottom-[76px] end-4 z-30 inline-flex items-center gap-2 rounded-full bg-navy p-3 text-[13px] font-medium text-white shadow-[0_18px_40px_-14px_rgba(11,27,47,0.6)] ring-1 ring-white/10 transition-transform duration-500 ease-fluid active:scale-[0.97] md:bottom-6 md:end-6 md:py-2.5 md:ps-3 md:pe-4",
          open && "max-md:hidden",
        )}
      >
        <Sparkle weight="fill" className="size-6 md:size-5" aria-hidden />
        <span className="sr-only md:not-sr-only">{open ? "Close chat" : "Ask AI"}</span>
      </button>
      {mounted && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
