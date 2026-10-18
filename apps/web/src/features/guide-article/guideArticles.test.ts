import { describe, expect, it } from "vitest";

import { pickGuidesBySlug } from "@/features/guides/guideLists";
import { TRAVEL_GUIDES } from "@/features/guides/travelGuides";

import { GUIDE_ARTICLE_SLUGS, articleToc, getGuideArticle } from "./guideArticles";

describe("getGuideArticle", () => {
  it("joins the guide, its content, its trek and the region's months", () => {
    const article = getGuideArticle("best-time-to-trek-langtang");

    expect(article?.title).toBe("Best time to trek Langtang: a month-by-month guide");
    expect(article?.trek?.slug).toBe("langtang-valley");
    expect(article?.months).toHaveLength(12);
  });

  it("is undefined for a guide without a page", () => {
    expect(getGuideArticle("nepal-visa-for-trekkers")).toBeUndefined();
    expect(getGuideArticle("no-such-guide")).toBeUndefined();
  });
});

describe("every article", () => {
  const articles = GUIDE_ARTICLE_SLUGS.map((slug) => ({ slug, article: getGuideArticle(slug) }));

  it.each(articles)("$slug has a guide, and its trek and region exist", ({ article }) => {
    expect(article).toBeDefined();
    if (article?.trekSlug) expect(article.trek).toBeDefined();
    if (article?.regionSlug) expect(article.months).toHaveLength(12);
  });

  it.each(articles)("$slug picks related guides that exist and are not itself", ({ slug, article }) => {
    const slugs = article?.relatedSlugs ?? [];
    expect(slugs).not.toContain(slug);
    expect(pickGuidesBySlug(TRAVEL_GUIDES, slugs)).toHaveLength(slugs.length);
  });

  it.each(articles)("$slug has unique section ids and 12-month tables", ({ article }) => {
    if (!article) return;
    const ids = articleToc(article).map((link) => link.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const block of article.sections.flatMap((section) => section.blocks)) {
      if (block.type === "month-table") expect(block.months).toHaveLength(12);
      if (block.type === "season-strip" || block.type === "month-table") expect(article.months).toBeDefined();
      if (block.type === "trek-card") expect(article.trek).toBeDefined();
    }
  });
});

describe("articleToc", () => {
  it("lists the quick answer, the sections and the FAQ", () => {
    const article = getGuideArticle("best-time-to-trek-langtang");
    expect(article && articleToc(article).map((link) => link.label)).toEqual([
      "Quick answer",
      "Seasons at a glance",
      "Autumn",
      "Spring",
      "Winter",
      "Monsoon",
      "Month by month",
      "FAQ",
    ]);
  });
});
