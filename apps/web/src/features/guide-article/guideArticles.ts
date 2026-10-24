import { TRAVEL_GUIDES } from "@/features/guides/travelGuides";
import { getRegionOverview } from "@/features/regions/overviews";
import { TREKS } from "@/features/treks/treks";
import { ROUTES, guidePath } from "@/lib/routes";

import { BEST_TIME_TO_TREK_LANGTANG } from "./content/bestTimeToTrekLangtang";
import type { GuideArticle, GuideArticleContent } from "./types";

/** Guides that have a full page so far. Each needs a matching guide in TRAVEL_GUIDES (same slug). */
const GUIDE_ARTICLE_CONTENT: readonly GuideArticleContent[] = [BEST_TIME_TO_TREK_LANGTANG];

/** Slugs to prerender at build time. */
export const GUIDE_ARTICLE_SLUGS: readonly string[] = GUIDE_ARTICLE_CONTENT.map((content) => content.slug);

/** True when the guide has a page, so links to it don't end on a 404. */
export const hasGuidePage = (slug: string) => GUIDE_ARTICLE_SLUGS.includes(slug);

/** The guide's page, or the travel guides list while it has none (like regionHref and trekHref). */
export const guideHref = (slug: string) => (hasGuidePage(slug) ? guidePath(slug) : ROUTES.guides);

/** The guide, its page content, its trek and its region's month ratings joined; undefined when there is no page. */
export const getGuideArticle = (slug: string): GuideArticle | undefined => {
  const guide = TRAVEL_GUIDES.find((item) => item.slug === slug);
  const content = GUIDE_ARTICLE_CONTENT.find((item) => item.slug === slug);
  if (!guide || !content) return undefined;

  return {
    ...guide,
    ...content,
    trek: TREKS.find((trek) => trek.slug === content.trekSlug),
    months: content.regionSlug ? getRegionOverview(content.regionSlug)?.months : undefined,
  };
};

export const QUICK_ANSWER_ID = "quick-answer";
export const FAQ_ID = "faq";

export type TocLink = { id: string; label: string };

/** "In this guide": the quick answer, each section and the FAQ (when there is one). */
export const articleToc = (article: GuideArticleContent): TocLink[] => [
  { id: QUICK_ANSWER_ID, label: "Quick answer" },
  ...article.sections.map((section) => ({ id: section.id, label: section.tocLabel })),
  ...(article.faqs.length ? [{ id: FAQ_ID, label: "FAQ" }] : []),
];
