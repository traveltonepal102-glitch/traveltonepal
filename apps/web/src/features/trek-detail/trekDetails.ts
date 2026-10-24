import { TREKS } from "@/features/treks/treks";
import type { TrekSummary } from "@/features/treks/types";

import { LANGTANG_VALLEY } from "./content/langtangValley";
import type { TrekDetail, TrekDetailContent } from "./types";

/** Treks that have a full page so far. Each needs a matching summary in TREKS (same slug). */
const TREK_DETAIL_CONTENT: readonly TrekDetailContent[] = [LANGTANG_VALLEY];

/** Slugs to prerender at build time. */
export const TREK_DETAIL_SLUGS: readonly string[] = TREK_DETAIL_CONTENT.map((content) => content.slug);

/** True when the trek has its own page (cards link there; others offer a WhatsApp inquiry instead). */
export const hasTrekPage = (slug: string) => TREK_DETAIL_SLUGS.includes(slug);

/**
 * The popular treks the home page and the header menu link to. Until the trek page reads the database, only
 * those with a page: a card or menu link that opens a 404 is worse than none.
 */
export const popularTreksWithPage = (treks: readonly TrekSummary[]) => treks.filter((trek) => trek.isPopular && hasTrekPage(trek.slug));

/** The summary (cards, filters) and the page content joined, or undefined when the trek has no page. */
export const getTrekDetail = (slug: string): TrekDetail | undefined => {
  const summary = TREKS.find((trek) => trek.slug === slug);
  const content = TREK_DETAIL_CONTENT.find((item) => item.slug === slug);
  if (!summary || !content) return undefined;
  return { ...summary, ...content };
};
