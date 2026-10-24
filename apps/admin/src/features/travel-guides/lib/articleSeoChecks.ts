import { ARTICLE_LIMITS as LIMIT } from "../constants";
import type { ArticleSection } from "../types";
import type { ArticleDraft } from "./articleDraft";

export type SeoCheck = { label: string; isDone: boolean };

const includesKeyword = (text: string, keyword: string) => Boolean(keyword) && text.toLowerCase().includes(keyword.toLowerCase());

/** The Google checklist (design: "Google (SEO)"). The German version's check comes with the German version. */
export const getArticleSeoChecks = (article: ArticleDraft & { hasCover: boolean; sections: ArticleSection[] }): SeoCheck[] => {
  const keyword = article.seoKeyword.trim();
  const descriptionLength = article.seoDescription.trim().length;
  return [
    { label: "Main keyword in the title", isDone: includesKeyword(article.title, keyword) },
    { label: "Main keyword in the Google title", isDone: includesKeyword(article.seoTitle, keyword) },
    { label: "Quick answer at the top", isDone: article.sections[0]?.type === "quick" },
    { label: "Questions and answers added", isDone: article.sections.some((section) => section.type === "faq" && section.items.some((item) => item.question.trim())) },
    { label: `Google title up to ${LIMIT.seoTitleRecommended} characters`, isDone: article.seoTitle.trim().length > 0 && article.seoTitle.trim().length <= LIMIT.seoTitleRecommended },
    { label: "Description 120–160 characters", isDone: descriptionLength >= 120 && descriptionLength <= LIMIT.seoDescriptionRecommended },
    { label: "The photo has a description", isDone: article.hasCover && article.coverAlt.trim().length > 0 },
    { label: "Links to a trek", isDone: article.mainTrekId !== null },
  ];
};
