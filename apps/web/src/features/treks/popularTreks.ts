import { treksBySlug } from "./treks";

/**
 * Popular treks, in the home page's order: the home "Treks trekkers book first" section shows all,
 * the header menu the first 4, the 404 page the first 3.
 */
export const POPULAR_TREKS = treksBySlug([
  "langtang-valley",
  "everest-base-camp",
  "annapurna-circuit",
  "manaslu-circuit",
  "annapurna-base-camp",
  "mardi-himal",
]);
