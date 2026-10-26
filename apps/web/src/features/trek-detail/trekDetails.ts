import type { TrekSummary } from "@/features/treks/types";

/**
 * The popular treks the home page and the header menu link to: only those with a page, since a card or menu link
 * that opens a 404 is worse than none.
 */
export const popularTreksWithPage = (treks: readonly TrekSummary[]) => treks.filter((trek) => trek.isPopular && trek.hasPage);
