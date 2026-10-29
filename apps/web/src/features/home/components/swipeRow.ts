/**
 * Phone-only horizontal swipe row (cards snap to the left gutter, no visible scrollbar).
 * Add the md-and-up grid classes next to it; `SWIPE_ROW_RESET` undoes the phone-only parts.
 */
export const SWIPE_ROW =
  "-mx-4 flex snap-x snap-mandatory scroll-pl-4 relative overflow-x-auto px-4 scrollbar-none [&::-webkit-scrollbar]:hidden";

export const SWIPE_ROW_RESET = "md:mx-0 md:overflow-visible md:px-0";

/** A card in the swipe row: 84% wide on phones so the next card peeks in. */
export const SWIPE_ITEM = "flex-[0_0_84%] snap-start";
