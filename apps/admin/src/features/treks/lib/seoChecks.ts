import { TREK_LIMITS as LIMIT } from "../constants";
import type { TrekValues } from "../types";

export type SeoCheck = { label: string; isDone: boolean };

export type SeoCheckInput = Pick<TrekValues, "seoKeyword" | "seoTitle" | "seoDescription" | "slug" | "groupPrices" | "faqs">;

/** Words every trek's address and keyword share, so they don't count when matching the keyword to the address. */
const GENERIC_WORDS = new Set(["trek", "treks", "trekking", "nepal", "the", "and", "of", "in", "to"]);

const keywordWords = (keyword: string) =>
  keyword
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !GENERIC_WORDS.has(word));

/** "langtang valley trek" is in "langtang-valley": every word that tells treks apart is in the address. */
const isKeywordInSlug = (keyword: string, slug: string) => {
  const words = keywordWords(keyword);
  const parts = new Set(slug.split("-"));
  return words.length > 0 && words.every((word) => parts.has(word));
};

/** The editor's Google checklist (design: "How the trek shows on Google"). Answers only what the page itself controls. */
export const getSeoChecks = ({ seoKeyword, seoTitle, seoDescription, slug, groupPrices, faqs }: SeoCheckInput): SeoCheck[] => {
  const keyword = seoKeyword.trim().toLowerCase();
  const title = seoTitle.trim();
  const description = seoDescription.trim().length;
  const questions = faqs.reduce((count, topic) => count + topic.items.length, 0);

  return [
    { label: "Main keyword in the Google title", isDone: Boolean(keyword) && title.toLowerCase().includes(keyword) },
    { label: "Main keyword in the web address", isDone: isKeywordInSlug(keyword, slug) },
    { label: `Google title up to ${LIMIT.seoTitleRecommended} characters`, isDone: title.length > 0 && title.length <= LIMIT.seoTitleRecommended },
    {
      label: `Description ${LIMIT.seoDescriptionMin}–${LIMIT.seoDescriptionRecommended} characters`,
      isDone: description >= LIMIT.seoDescriptionMin && description <= LIMIT.seoDescriptionRecommended,
    },
    { label: "Price in the title (gets more clicks)", isDone: /\$\s?\d/.test(title) },
    { label: "Prices added as trip data for Google", isDone: groupPrices.length > 0 },
    { label: questions ? `${questions} questions added as FAQ data` : "Questions added as FAQ data", isDone: questions > 0 },
  ];
};
