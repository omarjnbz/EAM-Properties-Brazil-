"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import type { Guide } from "@/content/guides";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { AppLink } from "@/components/ui/app-link";
import { Field, inputClass } from "@/components/forms/fields";

type Status = "idle" | "sending" | "done" | "error";

/**
 * The newsletter / guide form: name, email, contact number and job, then the
 * guide downloads. Submissions go to /api/enquiry with type "guide".
 */
export function GuideForm({ guide, className }: { guide: Guide; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const id = (s: string) => `guide-${guide.key}-${s}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "guide", guide: guide.key, ...data }),
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
      <div className={cn("flex flex-col items-start gap-5 p-7 md:p-9", className)} role="status">
        <span className="grid size-14 place-items-center rounded-full bg-leaf-soft text-leaf-deep">
          <CheckCircle weight="light" className="size-8" aria-hidden />
        </span>
        <div>
          <h3 className="text-[1.75rem] font-medium leading-tight tracking-[-0.03em]">Your guide is ready.</h3>
          <p className="mt-2 max-w-md text-[15.5px] leading-relaxed text-ink-3">
            {guide.title}, {guide.edition.replace("The EAM Global guide · ", "")} edition. Questions while you read? A real advisor replies within 60 minutes.
          </p>
        </div>
        <a
          href={guide.pdf}
          download={guide.fileName}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf px-6 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-leaf-deep"
        >
          <DownloadSimple weight="bold" className="size-4" aria-hidden /> Download the {guide.country} guide (PDF)
        </a>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <AppLink href="/free-roadmap" className="font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
            Get a free roadmap for your family
          </AppLink>
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="font-medium text-leaf-deep">
            Message us on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-5 p-6 sm:p-8 md:p-9", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor={id("name")}>
          <input id={id("name")} name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor={id("email")}>
          <input id={id("email")} name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </Field>
        <Field label="Contact number" htmlFor={id("whatsapp")} hint="WhatsApp, with country code">
          <input
            id={id("whatsapp")}
            name="whatsapp"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="\+?[0-9 \(\)\-]{8,}"
            className={inputClass}
            placeholder="+971 5x xxx xxxx"
          />
        </Field>
        <Field label="Job" htmlFor={id("job")}>
          <input id={id("job")} name="job" required autoComplete="organization-title" className={inputClass} placeholder="e.g. Engineer, business owner" />
        </Field>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-snug text-ink-3">
        <input type="checkbox" name="consent" value="yes" required className="mt-0.5 size-4 shrink-0 accent-[#4c7f0e]" />
        <span>
          Send me the guide and occasional updates from EAM Global. I can unsubscribe at any time. See our{" "}
          <AppLink href="/privacy" className="underline underline-offset-2">
            privacy policy
          </AppLink>
          .
        </span>
      </label>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(62,105,11,0.7)] transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-leaf-deep active:scale-[0.97] disabled:opacity-60"
        >
          <DownloadSimple weight="bold" className="size-4" aria-hidden />
          {status === "sending" ? "Preparing…" : `Get the free ${guide.country} guide`}
        </button>
        <p className="text-[12.5px] text-ink-3">Free PDF · no payment, no obligation</p>
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
          {error}
        </p>
      )}
    </form>
  );
}
