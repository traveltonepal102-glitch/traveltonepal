import type { IconName } from "@ttn/ui/icon";

export type LegalSlug = "terms" | "privacy" | "impressum" | "cookies";

export type LegalSection = {
  /** Anchor for "On this page", e.g. "cancellation". */
  id: string;
  heading: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  table?: { head: readonly string[]; rows: readonly (readonly string[])[] };
};

export type LegalDoc = {
  slug: LegalSlug;
  /** Short name in the side menu, e.g. "Terms and booking". */
  label: string;
  title: string;
  icon: IconName;
  /** e.g. "[DATE]" until the owner publishes the final text. */
  updated: string;
  intro: string;
  /** For the owner, shown only in `pnpm dev`: what to check before going live. */
  ownerNote?: string;
  sections: readonly LegalSection[];
};
