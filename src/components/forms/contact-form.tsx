"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import type { Dictionary } from "@/content/i18n";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { Field, PillChoice, inputClass } from "./fields";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
];

/** Short contact form: Name · WhatsApp · Language · Message. */
export function ContactForm({ className, copy, locale }: { className?: string; copy: Dictionary["forms"]["contact"]; locale: Locale }) {
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
      if (!res.ok || !json.ok) throw new Error(json.error || copy.error);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : copy.error);
    }
  }

  if (status === "done") {
    return (
      <div className={cn("flex flex-col items-start gap-4 p-8 md:p-10", className)} role="status">
        <CheckCircle weight="light" className="size-10 text-leaf-deep" aria-hidden />
        <h3 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em]">{copy.doneTitle}</h3>
        <p className="text-[16px] text-ink-3">{copy.doneBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-5 p-6 sm:p-8 md:p-10", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.name} htmlFor="c-name">
          <input id="c-name" name="name" required autoComplete="name" className={inputClass} placeholder={copy.namePlaceholder} />
        </Field>
        <Field label={copy.whatsapp} htmlFor="c-whatsapp">
          <input id="c-whatsapp" name="whatsapp" type="tel" inputMode="tel" required autoComplete="tel" pattern="\+?[0-9 \(\)\-]{8,}" dir="ltr" className={inputClass} placeholder="+971 5x xxx xxxx" />
        </Field>
      </div>
      <PillChoice name="language" legend={copy.language} options={LANGUAGES} required defaultValue={locale} />
      <Field label={copy.message} htmlFor="c-message">
        <textarea id="c-message" name="message" rows={4} required className={cn(inputClass, "resize-y")} placeholder={copy.messagePlaceholder} />
      </Field>
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 text-[15px] font-medium text-white transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-leaf-deep active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? copy.sending : copy.submit}
          <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </button>
        <p className="text-[12.5px] text-ink-3">
          {copy.fastest} <bdi dir="ltr">{SITE.whatsappDisplay}</bdi>
        </p>
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
          {error}
        </p>
      )}
    </form>
  );
}
