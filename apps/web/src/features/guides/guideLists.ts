import type { GuideTopicId } from "./topics";
import type { TravelGuide } from "./types";

export type GuideHighlights = {
  featured: TravelGuide;
  /** The newest other guides, shown beside the featured one. */
  latest: TravelGuide[];
};

const LATEST_COUNT = 2;

export const sortNewestFirst = (guides: readonly TravelGuide[]) =>
  [...guides].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

/** The featured guide (the flagged one, else the newest) and the newest others. Null when there are no guides. */
export const pickGuideHighlights = (guides: readonly TravelGuide[]): GuideHighlights | null => {
  const newestFirst = sortNewestFirst(guides);
  const featured = newestFirst.find((guide) => guide.isFeatured) ?? newestFirst[0];
  if (!featured) return null;

  return { featured, latest: newestFirst.filter((guide) => guide !== featured).slice(0, LATEST_COUNT) };
};

/** How many guides each topic has (0 for a topic without guides). */
export const countGuidesByTopic = (guides: readonly TravelGuide[]) => {
  const counts = new Map<GuideTopicId, number>();
  for (const guide of guides) counts.set(guide.topic, (counts.get(guide.topic) ?? 0) + 1);
  return (topic: GuideTopicId) => counts.get(topic) ?? 0;
};

export type RegionOption = { slug: string; name: string };

/** The regions (in their given order) that have at least one guide, so no region link leads to an empty list. */
export const regionsWithGuides = (guides: readonly TravelGuide[], regions: readonly RegionOption[]): RegionOption[] =>
  regions
    .filter((region) => guides.some((guide) => guide.regionSlugs.includes(region.slug)))
    .map(({ slug, name }) => ({ slug, name }));

/** The guides for `slugs`, in that order; slugs without a guide are skipped. */
export const pickGuidesBySlug = (guides: readonly TravelGuide[], slugs: readonly string[]) => {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
};
