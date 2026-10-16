"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { DESTINATION_OPTIONS } from "@/content/programs";
import { ROADMAP } from "@/content/pages";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { Field, PillChoice, Select, inputClass } from "./fields";

const GOALS = [
  { value: "live", label: "Live abroad" },
  { value: "passport", label: "Second passport" },
  { value: "visit", label: "Visit or travel" },
  { value: "business", label: "Business" },
];

const LANGUAGES = [
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
  { value: "ar", label: "AR" },
  { value: "es", label: "ES" },
];

const BUDGETS = ["Under USD 100,000", "USD 100,000 – 250,000", "USD 250,000 – 500,000", "USD 500,000 – 1M", "Over USD 1M", "Not sure yet"];

type Status = "idle" | "sending" | "done" | "error";

/**
 * The main lead capture. "compact" is the homepage version; "full" adds the
 * fields from the Free Roadmap page. Submissions go to /api/enquiry.
 */
export function RoadmapForm({ variant = "compact", className }: { variant?: "compact" | "full"; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const destinationRef = useRef<HTMLSelectElement>(null);
  const full = variant === "full";
  const id = (s: string) => `${variant}-${s}`;

  // Deep links such as /free-roadmap?destination=brazil preselect the destination.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("destination");
    const select = destinationRef.current;
    if (value && select && Array.from(select.options).some((o) => o.value === value)) select.value = value;
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "roadmap", ...data }),
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
      <div className={cn("flex flex-col items-start gap-5 p-8 md:p-10", className)} role="status">
        <span className="grid size-14 place-items-center rounded-full bg-leaf-soft text-leaf-deep">
          <CheckCircle weight="light" className="size-8" aria-hidden />
        </span>
        <h3 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em]">Your roadmap is on its way.</h3>
        <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{ROADMAP.confirmation}</p>
        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] font-medium text-leaf-deep">
          <WhatsappLogo className="size-5" aria-hidden /> Message us on WhatsApp now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-6 p-6 sm:p-8 md:p-10", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={full ? "Full name" : "Name"} htmlFor={id("name")}>
          <input id={id("name")} name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="WhatsApp number" htmlFor={id("whatsapp")} hint={full ? "with country code" : undefined}>
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
        <Field label="Email" htmlFor={id("email")}>
          <input id={id("email")} name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
        </Field>
        <Field label="Nationality" htmlFor={id("nationality")}>
          <input id={id("nationality")} name="nationality" required autoComplete="country-name" className={inputClass} placeholder="e.g. Egyptian" />
        </Field>
        {full && (
          <Field label="Current country" htmlFor={id("current")}>
            <input id={id("current")} name="currentCountry" required className={inputClass} placeholder="Where you live now" />
          </Field>
        )}
        <Field label="Destination" htmlFor={id("destination")} className={full ? undefined : "sm:col-span-2"}>
          <Select id={id("destination")} name="destination" required ref={destinationRef} defaultValue="">
            <option value="" disabled>
              Choose a destination
            </option>
            <option value="not-sure">Not sure yet</option>
            {DESTINATION_OPTIONS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
        {full && (
          <>
            <Field label="Approximate budget" htmlFor={id("budget")}>
              <Select id={id("budget")} name="budget" defaultValue="">
                <option value="" disabled>
                  Choose a range
                </option>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            </Field>
            <Field label="Family size" htmlFor={id("family")}>
              <Select id={id("family")} name="familySize" defaultValue="">
                <option value="" disabled>
                  How many people?
                </option>
                {["1", "2", "3", "4", "5", "6+"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
          </>
        )}
      </div>

      <PillChoice name="goal" legend="Goal" options={GOALS} required />
      <PillChoice name="language" legend="Preferred language" options={LANGUAGES} required defaultValue="en" />

      {full && (
        <Field label="Message" htmlFor={id("message")} hint="optional">
          <textarea id={id("message")} name="message" rows={4} className={cn(inputClass, "resize-y")} placeholder="Anything we should know about your family or timeline" />
        </Field>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(62,105,11,0.7)] transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-leaf-deep active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send me my roadmap"}
          <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </button>
        <p className="text-[12.5px] leading-snug text-ink-3">No payment, no obligation. An advisor replies on WhatsApp within 60 minutes.</p>
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
          {error} You can also message us on WhatsApp at {SITE.whatsappDisplay}.
        </p>
      )}
    </form>
  );
}
