import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";

import { EMPTY_ARTICLE_VALUES } from "../constants";
import type { ArticleListItem } from "./articleListItem";
import { filterArticles, isScheduled, NO_ARTICLE_FILTERS } from "./articleListItem";
import { getArticleSeoChecks } from "./articleSeoChecks";

const TODAY = "2026-10-24";
const doc = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

const item = (id: string, overrides: Partial<ArticleListItem> = {}): ArticleListItem => ({
  id,
  title: id,
  topic: "best-time",
  status: "draft",
  siteRegionId: null,
  authorId: null,
  publishedOn: null,
  isFeatured: false,
  startHerePosition: null,
  updatedAt: "2026-10-24T00:00:00Z",
  cover: null,
  feedback: null,
  ...overrides,
});

const ARTICLES = [
  item("Best time to trek Langtang", { siteRegionId: "langtang", status: "published", publishedOn: "2026-10-12" }),
  item("Langtang permits and costs", { siteRegionId: "langtang", topic: "planning" }),
  item("Altitude sickness", { topic: "health", status: "published", publishedOn: "2027-01-05" }),
];
const titles = (articles: ArticleListItem[]) => articles.map((article) => article.title);

describe("filterArticles", () => {
  it("searches titles and filters by website, topic and status", () => {
    expect(titles(filterArticles(ARTICLES, { ...NO_ARTICLE_FILTERS, query: "LANGTANG" }))).toEqual(["Best time to trek Langtang", "Langtang permits and costs"]);
    expect(titles(filterArticles(ARTICLES, { ...NO_ARTICLE_FILTERS, site: "main" }))).toEqual(["Altitude sickness"]);
    expect(titles(filterArticles(ARTICLES, { ...NO_ARTICLE_FILTERS, site: "langtang", topic: "planning" }))).toEqual(["Langtang permits and costs"]);
    expect(titles(filterArticles(ARTICLES, { ...NO_ARTICLE_FILTERS, status: "published" }))).toHaveLength(2);
  });

  it("tells a published guide still waiting for its date", () => {
    expect(ARTICLES.map((article) => isScheduled(article, TODAY))).toEqual([false, false, true]);
  });
});

describe("getArticleSeoChecks", () => {
  const draft = { ...EMPTY_ARTICLE_VALUES, hasCover: false };
  const quick = { id: null, type: "quick" as const, body: doc("October and November.") };
  const faq = { id: null, type: "faq" as const, items: [{ question: "Can I trek in winter?", answer: doc("Yes.") }] };
  const done = (checks: ReturnType<typeof getArticleSeoChecks>) => checks.filter((check) => check.isDone).map((check) => check.label);

  it("ticks nothing for an empty guide", () => {
    expect(done(getArticleSeoChecks(draft))).toEqual([]);
  });

  it("ticks each check once its part is written", () => {
    const written = {
      ...draft,
      title: "Best Time to Trek Langtang: A Month-by-Month Guide",
      seoKeyword: "best time to trek langtang",
      seoTitle: "Best Time to Trek Langtang (Month by Month) | 2026",
      seoDescription: "x".repeat(140),
      hasCover: true,
      coverAlt: "Langtang in October",
      mainTrekId: "t1",
      sections: [quick, faq],
    };
    expect(done(getArticleSeoChecks(written))).toHaveLength(8);
    expect(done(getArticleSeoChecks({ ...written, sections: [faq, quick] }))).not.toContain("Quick answer at the top");
    expect(done(getArticleSeoChecks({ ...written, sections: [quick] }))).not.toContain("Questions and answers added");
    expect(done(getArticleSeoChecks({ ...written, seoTitle: `${written.seoTitle} and more words` }))).not.toContain("Google title up to 60 characters");
    expect(done(getArticleSeoChecks({ ...written, seoDescription: "Too short." }))).not.toContain("Description 120–160 characters");
  });
});
