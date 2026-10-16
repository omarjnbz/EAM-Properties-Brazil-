"use client";

import { useMemo, useState } from "react";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { plain } from "@/components/ui/rich";
import { TestimonialGrid } from "./testimonial-grid";

/** Full video library, filterable by program and language. */
export function TestimonialLibrary({ items }: { items: Testimonial[] }) {
  const programs = useMemo(() => ["All programs", ...new Set(items.map((t) => t.program))], [items]);
  const languages = useMemo(() => ["All languages", ...new Set(items.map((t) => plain(t.language)).filter((l) => l !== "Language"))], [items]);
  const [program, setProgram] = useState(programs[0]);
  const [language, setLanguage] = useState(languages[0]);

  const visible = items.filter(
    (t) => (program === programs[0] || t.program === program) && (language === languages[0] || plain(t.language) === language),
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Filter label="Program" options={programs} value={program} onChange={setProgram} />
        <Filter label="Language" options={languages} value={language} onChange={setLanguage} />
      </div>
      {visible.length ? (
        <TestimonialGrid key={`${program}-${language}`} items={visible} variant="library" />
      ) : (
        <p className="text-paper/60">No videos match these filters yet.</p>
      )}
    </div>
  );
}

function Filter({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="me-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full px-4 py-2 text-[13.5px] ring-1 transition-colors duration-300 ease-fluid",
            value === o ? "bg-paper text-ink ring-paper" : "bg-white/[0.04] text-paper/75 ring-white/15 hover:bg-white/10",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
