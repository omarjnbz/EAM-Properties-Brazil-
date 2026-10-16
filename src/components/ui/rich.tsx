import { Fragment } from "react";
import { cn } from "@/lib/cn";

const TOKEN = /(\{\{[^}]+\}\}|\*[^*]+\*)/g;

type Part = { kind: "text" | "em" | "ph"; value: string };

export function parseRich(text: string): Part[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith("{{") && p.endsWith("}}")) return { kind: "ph", value: p.slice(2, -2) };
      if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) return { kind: "em", value: p.slice(1, -1) };
      return { kind: "text", value: p };
    });
}

/** Strips inline markup for plain-text contexts (meta tags, aria labels). */
export const plain = (text: string) => parseRich(text).map((p) => p.value).join("");

/** A value the client still has to confirm. Highlighted so it never ships unnoticed. */
export function Ph({ children }: { children: React.ReactNode }) {
  return (
    <span className="ph" title="Placeholder: confirm before launch">
      {children}
    </span>
  );
}

/** Renders inline markup: {{placeholder}} and *emphasis*. */
export function Rich({ text, emClassName }: { text: string; emClassName?: string }) {
  return (
    <>
      {parseRich(text).map((p, i) => {
        if (p.kind === "ph") return <Ph key={i}>{p.value}</Ph>;
        if (p.kind === "em")
          return (
            <em key={i} className={cn("not-italic", emClassName)}>
              {p.value}
            </em>
          );
        return <Fragment key={i}>{p.value}</Fragment>;
      })}
    </>
  );
}
