import { capitalize, formatCountWord } from "@/lib/format";

import type { SitePageTop } from "./types";

/** Counts the list pages' texts can name: "{regions} trekking regions" stays true when a region is added. */
export type PageCounts = { regions: number; treks: number };

const TOKEN = /\{(regions|treks)\}/g;

/**
 * "{regions} trekking regions…" → "Nine trekking regions…": the count as a word (nine, 12), capitalised at the start
 * of a sentence. A count of zero is no fact worth showing: the token is left out, with its space.
 */
export const fillPageCounts = (text: string, counts: PageCounts): string =>
  text
    .replace(TOKEN, (_, key: keyof PageCounts, offset: number) => {
      const count = counts[key];
      if (count <= 0) return "";
      const word = formatCountWord(count);
      const isSentenceStart = offset === 0 || /[.!?:]\s*$/.test(text.slice(0, offset));
      return isSentenceStart ? capitalize(word) : word;
    })
    .replace(/ {2,}/g, " ")
    .replace(/^ | $/g, "")
    .replace(/^\w/, (first) => first.toUpperCase());

/** A list page's top and Google result with the counts filled in. */
export const withPageCounts = (top: SitePageTop, counts: PageCounts): SitePageTop => {
  const fill = (text: string) => fillPageCounts(text, counts);
  return {
    ...top,
    eyebrow: fill(top.eyebrow),
    heading: fill(top.heading),
    intro: fill(top.intro),
    seo: { title: fill(top.seo.title), description: fill(top.seo.description), keyword: top.seo.keyword },
  };
};
