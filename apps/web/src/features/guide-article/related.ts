import { pickGuidesBySlug, sortNewestFirst } from "@/features/guides/guideLists";
import type { TravelGuide } from "@/features/guides/types";

export const RELATED_COUNT = 3;

type RelatedTo = Pick<TravelGuide, "slug" | "topic" | "regionSlugs"> & { relatedSlugs?: readonly string[] };

/**
 * "Related guides": the article's own picks first, then the closest others (same region, then same
 * topic, newest first within each), never the article itself.
 */
export const pickRelatedGuides = (article: RelatedTo, guides: readonly TravelGuide[], count = RELATED_COUNT) => {
  const others = guides.filter((guide) => guide.slug !== article.slug);
  const picked = pickGuidesBySlug(others, article.relatedSlugs ?? []);

  const closeness = (guide: TravelGuide) =>
    (guide.regionSlugs.some((region) => article.regionSlugs.includes(region)) ? 2 : 0) + (guide.topic === article.topic ? 1 : 0);
  // Stable sort: equally close guides keep their newest-first order.
  const rest = sortNewestFirst(others.filter((guide) => !picked.includes(guide))).sort((a, b) => closeness(b) - closeness(a));

  return [...picked, ...rest].slice(0, count);
};
