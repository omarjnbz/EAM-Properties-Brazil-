"use client";

import { cn } from "@/lib/cn";
import { openDaniel } from "./bus";
import { DanielMark } from "./daniel-mark";

/** A button anywhere on the site that opens Daniel already asking `question`. */
export function AskDanielButton({
  question,
  label,
  variant = "chip",
  className,
}: {
  question: string;
  label: string;
  variant?: "chip" | "link" | "solid";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openDaniel({ message: question })}
      className={cn(
        "group/ask inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium transition-[background-color,color,box-shadow] duration-300",
        variant === "chip" && "rounded-full bg-white py-0.5 ps-0.5 pe-2.5 text-[12px] text-navy-deep ring-1 ring-navy/15 hover:bg-navy hover:text-white hover:ring-navy",
        variant === "link" && "rounded-full py-0.5 ps-0.5 pe-2 text-[13.5px] text-navy hover:bg-navy/5",
        variant === "solid" && "rounded-full bg-navy py-1 ps-1 pe-4 text-[14px] text-white shadow-[0_10px_24px_-12px_rgba(14,86,158,0.8)] hover:bg-navy-deep",
        className,
      )}
    >
      <DanielMark size={variant === "solid" ? 30 : 20} />
      {label}
    </button>
  );
}
