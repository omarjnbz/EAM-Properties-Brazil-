"use client";

import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-xl bg-canvas px-4 py-3.5 text-[15px] text-ink ring-1 ring-transparent outline-none transition-[box-shadow,background-color] duration-300 ease-fluid placeholder:text-ink-3/60 hover:ring-ink/10 focus:bg-white focus:ring-2 focus:ring-navy/40";

export function Field({ label, htmlFor, hint, children, className }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink-2">
        {label}
        {hint && <span className="font-normal text-ink-3">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/** Native select with a custom caret. */
export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputClass, "appearance-none pe-11", className)}>
        {children}
      </select>
      <CaretDown weight="light" aria-hidden className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
    </div>
  );
}

/** Pill-style radio group (goal, language). */
export function PillChoice({
  name,
  legend,
  options,
  required,
  defaultValue,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-[13px] font-medium text-ink-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required && i === 0}
              defaultChecked={defaultValue === o.value}
              className="peer sr-only"
            />
            <span className="inline-flex items-center rounded-full bg-canvas px-4 py-2.5 text-[14px] text-ink-2 ring-1 ring-transparent transition-[background-color,color,box-shadow] duration-300 ease-fluid hover:ring-ink/15 peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-navy/50">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
