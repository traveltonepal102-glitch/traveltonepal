import type { Photo } from "@/features/photos/types";

import type { ArticleStatus, ArticleTopic } from "../types";

/** A travel guide as the list shows it. */
export type ArticleListItem = {
  id: string;
  title: string;
  topic: ArticleTopic;
  status: ArticleStatus;
  /** Null: the main site. */
  siteRegionId: string | null;
  authorId: string | null;
  /** "YYYY-MM-DD" (Nepal). */
  publishedOn: string | null;
  isFeatured: boolean;
  startHerePosition: number | null;
  updatedAt: string;
  cover: Photo | null;
};

/** A travel guide as a region's "Before you go" list in the region editor shows it. */
export type RegionArticleItem = Pick<ArticleListItem, "id" | "title" | "topic" | "status" | "publishedOn" | "cover">;

/** "all" / a region's id / "main" for the main site. */
export type ArticleFilters = { query: string; site: string; topic: ArticleTopic | ""; status: ArticleStatus | "" };

export const NO_ARTICLE_FILTERS: ArticleFilters = { query: "", site: "all", topic: "", status: "" };

/** The guides matching the title search, website, topic and status, in the order given (most recently edited first). */
export const filterArticles = (articles: ArticleListItem[], { query, site, topic, status }: ArticleFilters) => {
  const words = query.trim().toLowerCase();
  return articles.filter(
    (article) =>
      (!words || article.title.toLowerCase().includes(words)) &&
      (site === "all" || (site === "main" ? article.siteRegionId === null : article.siteRegionId === site)) &&
      (!topic || article.topic === topic) &&
      (!status || article.status === status),
  );
};

/** A published guide whose date hasn't come yet (it goes live that day). `today`: "YYYY-MM-DD" in Nepal. */
export const isScheduled = (article: Pick<ArticleListItem, "status" | "publishedOn">, today: string) =>
  article.status === "published" && article.publishedOn !== null && article.publishedOn > today;
