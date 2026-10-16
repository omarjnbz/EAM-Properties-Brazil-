"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { Field, PillChoice, inputClass } from "./fields";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
];

/** Short contact form: Name · WhatsApp · Language · Message. */
export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...data }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className={cn("flex flex-col items-start gap-4 p-8 md:p-10", className)} role="status">
        <CheckCircle weight="light" className="size-10 text-leaf-deep" aria-hidden />
        <h3 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em]">Message received.</h3>
        <p className="text-[16px] text-ink-3">A real advisor will reply on WhatsApp within 60 minutes, whatever the hour.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-5 p-6 sm:p-8 md:p-10", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="c-name">
          <input id="c-name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="WhatsApp" htmlFor="c-whatsapp">
          <input id="c-whatsapp" name="whatsapp" type="tel" inputMode="tel" required autoComplete="tel" pattern="\+?[0-9 \(\)\-]{8,}" className={inputClass} placeholder="+971 5x xxx xxxx" />
        </Field>
      </div>
      <PillChoice name="language" legend="Language" options={LANGUAGES} required defaultValue="en" />
      <Field label="Message" htmlFor="c-message">
        <textarea id="c-message" name="message" rows={4} required className={cn(inputClass, "resize-y")} placeholder="How can we help?" />
      </Field>
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 text-[15px] font-medium text-white transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-leaf-deep active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Message us"}
          <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </button>
        <p className="text-[12.5px] text-ink-3">WhatsApp is fastest: {SITE.whatsappDisplay}</p>
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
          {error}
        </p>
      )}
    </form>
  );
}
