import type { HomeGuide } from "@/features/home/types";

const RELATED_COUNT = 3;

type RelatedTo = { slug: string; topic: string; regionSlugs: readonly string[]; relatedSlugs: readonly string[] };

/** "Keep reading": the blog's own picks first, then the closest others (same region, then same topic, keeping the list's order within each), never itself. */
export const pickRelatedBlogs = (blog: RelatedTo, guides: readonly HomeGuide[], count = RELATED_COUNT) => {
  const others = guides.filter((guide) => guide.slug !== blog.slug);
  const picked = blog.relatedSlugs.flatMap((slug) => others.find((guide) => guide.slug === slug) ?? []);
  const closeness = (guide: HomeGuide) => (guide.regionSlugs.some((region) => blog.regionSlugs.includes(region)) ? 2 : 0) + (guide.topic === blog.topic ? 1 : 0);
  const rest = others.filter((guide) => !picked.includes(guide)).toSorted((a, b) => closeness(b) - closeness(a));
  return [...picked, ...rest].slice(0, count);
};
