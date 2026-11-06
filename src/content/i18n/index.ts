import type { Locale } from "@/i18n/config";
import { ar } from "./ar";
import { en } from "./en";
import { pt } from "./pt";

/** Fields that are identifiers, not copy: they must match English exactly. */
type Kept = "key" | "code";

/** The English dictionary's shape with every piece of copy loosened to `string`. */
export type Localized<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Localized<U>[]
    : T extends object
      ? { [K in keyof T]: K extends Kept ? T[K] : Localized<T[K]> }
      : T;

export type Dictionary = Localized<typeof en>;

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ar, pt };
