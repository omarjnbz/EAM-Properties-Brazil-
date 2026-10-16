"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { cn } from "@/lib/cn";

/** A single accordion row with a smooth height animation (works in every browser). */
export function Disclosure({ title, children, defaultOpen = false, className }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={cn("rounded-[20px] bg-white shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-ink/[0.05]", className)}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start md:px-6 md:py-5">
          <span className="text-[16px] font-medium leading-snug tracking-[-0.02em]">{title}</span>
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-canvas transition-transform duration-500 ease-fluid", open && "rotate-45")}>
            <Plus weight="bold" className="size-3.5" aria-hidden />
          </span>
        </button>
      </h3>
      <div id={id} className={cn("grid transition-[grid-template-rows] duration-500 ease-fluid", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className={cn("px-5 pb-5 text-[15px] leading-relaxed text-ink-3 transition-[opacity,filter] duration-500 md:px-6", open ? "opacity-100 blur-0" : "opacity-0 blur-sm")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
