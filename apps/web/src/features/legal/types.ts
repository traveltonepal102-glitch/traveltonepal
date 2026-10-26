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
  title: string;
  /** e.g. "[DATE]" until the owner publishes the final text. */
  updated: string;
  intro: string;
  /** For the owner, shown only in `pnpm dev`: what to check before going live. */
  ownerNote?: string;
  sections: readonly LegalSection[];
};
