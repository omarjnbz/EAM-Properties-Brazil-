"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import type { Dictionary } from "@/content/i18n";
import type { DestinationGroup } from "@/content/programs";
import { SITE } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { Field, PillChoice, Select, inputClass } from "./fields";

const GOALS = ["live", "passport", "visit", "business", "refused"] as const;

const LANGUAGES = [
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
  { value: "ar", label: "AR" },
  { value: "es", label: "ES" },
];

/** Submitted values stay in English whatever the page language; labels come from `copy.budgets`. */
const BUDGETS = ["Under USD 100,000", "USD 100,000 – 250,000", "USD 250,000 – 500,000", "USD 500,000 – 1M", "Over USD 1M", "Not sure yet"];

type Props = {
  variant?: "compact" | "full";
  className?: string;
  copy: Dictionary["forms"]["roadmap"];
  destinations: DestinationGroup[];
  locale: Locale;
};

type Status = "idle" | "sending" | "done" | "error";

/**
 * The main lead capture. "compact" is the homepage version; "full" adds the
 * fields from the Free Roadmap page. Submissions go to /api/enquiry.
 */
export function RoadmapForm({ variant = "compact", className, copy, destinations, locale }: Props) {
  const goals = GOALS.map((value) => ({ value, label: copy.goals[value] }));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const destinationRef = useRef<HTMLSelectElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const full = variant === "full";
  const id = (s: string) => `${variant}-${s}`;

  // Deep links such as /free-roadmap?destination=brazil or ?goal=refused preselect the form.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("destination");
    const select = destinationRef.current;
    if (value && select && Array.from(select.options).some((o) => o.value === value)) select.value = value;
    const goal = params.get("goal");
    if (goal && (GOALS as readonly string[]).includes(goal)) {
      const radio = formRef.current?.querySelector<HTMLInputElement>(`input[name="goal"][value="${goal}"]`);
      if (radio) radio.checked = true;
    }
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
      if (!res.ok || !json.ok) throw new Error(json.error || copy.error);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : copy.error);
    }
  }

  if (status === "done") {
    return (
      <div className={cn("flex flex-col items-start gap-5 p-8 md:p-10", className)} role="status">
        <span className="grid size-14 place-items-center rounded-full bg-leaf-soft text-leaf-deep">
          <CheckCircle weight="light" className="size-8" aria-hidden />
        </span>
        <h3 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em]">{copy.doneTitle}</h3>
        <p className="max-w-md text-[16px] leading-relaxed text-ink-3">{copy.confirmation}</p>
        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] font-medium text-leaf-deep">
          <WhatsappLogo className="size-5" aria-hidden /> {copy.doneWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={cn("flex flex-col gap-6 p-6 sm:p-8 md:p-10", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={full ? copy.fullName : copy.name} htmlFor={id("name")}>
          <input id={id("name")} name="name" required autoComplete="name" className={inputClass} placeholder={copy.namePlaceholder} />
        </Field>
        <Field label={copy.whatsapp} htmlFor={id("whatsapp")} hint={full ? copy.whatsappHint : undefined}>
          <input
            id={id("whatsapp")}
            name="whatsapp"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="\+?[0-9 \(\)\-]{8,}"
            dir="ltr"
            className={inputClass}
            placeholder="+971 5x xxx xxxx"
          />
        </Field>
        <Field label={copy.email} htmlFor={id("email")}>
          <input id={id("email")} name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} placeholder="you@example.com" />
        </Field>
        <Field label={copy.nationality} htmlFor={id("nationality")}>
          <input id={id("nationality")} name="nationality" required autoComplete="country-name" className={inputClass} placeholder={copy.nationalityPlaceholder} />
        </Field>
        {full && (
          <Field label={copy.currentCountry} htmlFor={id("current")}>
            <input id={id("current")} name="currentCountry" required className={inputClass} placeholder={copy.currentCountryPlaceholder} />
          </Field>
        )}
        <Field label={copy.destination} htmlFor={id("destination")} className={full ? undefined : "sm:col-span-2"}>
          <Select id={id("destination")} name="destination" required ref={destinationRef} defaultValue="">
            <option value="" disabled>
              {copy.chooseDestination}
            </option>
            <option value="not-sure">{copy.notSure}</option>
            {destinations.map((g) => (
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
            <Field label={copy.budget} htmlFor={id("budget")}>
              <Select id={id("budget")} name="budget" defaultValue="">
                <option value="" disabled>
                  {copy.chooseRange}
                </option>
                {BUDGETS.map((b, i) => (
                  <option key={b} value={b}>
                    {copy.budgets[i] ?? b}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={copy.familySize} htmlFor={id("family")}>
              <Select id={id("family")} name="familySize" defaultValue="">
                <option value="" disabled>
                  {copy.howMany}
                </option>
                {["1", "2", "3", "4", "5", "6+"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
          </>
        )}
      </div>

      <PillChoice name="goal" legend={copy.goal} options={goals} required />
      <PillChoice name="language" legend={copy.language} options={LANGUAGES} required defaultValue={locale} />

      {full && (
        <Field label={copy.message} htmlFor={id("message")} hint={copy.optional}>
          <textarea id={id("message")} name="message" rows={4} className={cn(inputClass, "resize-y")} placeholder={copy.messagePlaceholder} />
        </Field>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(62,105,11,0.7)] transition-[transform,background-color,opacity] duration-300 ease-fluid hover:bg-leaf-deep active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? copy.sending : copy.submit}
          <ArrowUpRight weight="bold" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </button>
        <p className="text-[12.5px] leading-snug text-ink-3">{copy.reassurance}</p>
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fbeee8] px-4 py-3 text-[14px] text-[#8d3b1c]">
          {error} {copy.errorWhatsapp} <bdi dir="ltr">{SITE.whatsappDisplay}</bdi>.
        </p>
      )}
    </form>
  );
}
