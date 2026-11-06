import type { PageDates } from "@ttn/site-data/pageDates";
import type { LegalBlock } from "@ttn/ui/lib/legalText";

export type LegalSlug = "terms" | "privacy" | "impressum" | "cookies";

export type LegalSection = {
  /** Anchor for "On this page", from the heading, e.g. "if-you-cancel". */
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

/** A legal page as saved in the admin's Pages › Legal pages, with the company details filled in. */
export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  intro: string;
  seo: { title: string; description: string };
  /** e.g. "26 October 2026"; "" until a date is set. */
  updated: string;
  dates?: PageDates;
  /** For the owner, shown only in development while the text is not checked by a lawyer. */
  ownerNote?: string;
  /** Text before the first numbered section. */
  lead: LegalBlock[];
  sections: LegalSection[];
};
