import { ARTICLE_TOPIC_VALUES } from "../constants";
import { readArticleForm } from "../schemas/articleSchema";
import type { ArticleTopic, ArticleValues } from "../types";

/** What the photo tags, the web address and the Google checks follow while the form is being typed. */
export type ArticleDraft = Pick<
  ArticleValues,
  "title" | "intro" | "topic" | "siteRegionId" | "mainTrekId" | "photoTrekId" | "highlightTag" | "coverAlt" | "seoKeyword" | "seoTitle" | "seoDescription"
>;

const isTopic = (value: string): value is ArticleTopic => (ARTICLE_TOPIC_VALUES as readonly string[]).includes(value);

/** The form as typed so far, read leniently (never used to save). */
export const draftFromArticleForm = (formData: FormData): ArticleDraft => {
  const raw = readArticleForm(formData);
  return {
    title: raw.title.trim(),
    intro: raw.intro.trim(),
    topic: isTopic(raw.topic) ? raw.topic : "best-time",
    siteRegionId: raw.siteRegionId || null,
    mainTrekId: raw.mainTrekId || null,
    photoTrekId: raw.photoTrekId || null,
    highlightTag: raw.highlightTag.trim(),
    coverAlt: raw.coverAlt.trim(),
    seoKeyword: raw.seoKeyword.trim(),
    seoTitle: raw.seoTitle.trim(),
    seoDescription: raw.seoDescription.trim(),
  };
};
