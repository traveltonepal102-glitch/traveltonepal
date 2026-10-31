import { ROUTES } from "@/lib/routes";

import { sortNewestFirst } from "./guideLists";
import { GUIDE_TOPICS, getGuideTopic } from "./topics";
import type { GuideTopicId } from "./topics";
import type { TravelGuide } from "./types";

/** "All guides" list state. The URL is its source of truth (/travel-guides?q=permits&topic=planning&page=2). */
export type GuideFilters = {
  q: string;
  topic: GuideTopicId | null;
  /** A region slug. */
  region: string | null;
  page: number;
};

export const EMPTY_GUIDE_FILTERS: GuideFilters = {
  q: "",
  topic: null,
  region: null,
  page: 1,
};

export const GUIDES_PER_PAGE = 15;

/** Id of the "All guides" section, so links and the search can jump to it. */
export const ALL_GUIDES_ID = "all-guides";

const isTopicId = (value: string): value is GuideTopicId =>
  GUIDE_TOPICS.some((topic) => topic.id === value);

/** Reads the list state from the URL. Unknown values are dropped, so a bad link shows all guides. */
export const parseGuideFilters = (
  params: URLSearchParams,
  regionSlugs: readonly string[],
): GuideFilters => {
  const topic = params.get("topic") ?? "";
  const region = params.get("region") ?? "";
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") ?? "").trim(),
    topic: isTopicId(topic) ? topic : null,
    region: regionSlugs.includes(region) ? region : null,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
};

/** Writes the list state to a query string; defaults are left out so URLs stay short. */
export const serializeGuideFilters = (filters: GuideFilters): string => {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.topic) params.set("topic", filters.topic);
  if (filters.region) params.set("region", filters.region);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
};

/** Link to the "All guides" list with these filters, e.g. "/travel-guides?topic=health#all-guides". */
export const guideListHref = (filters: Partial<GuideFilters>) => {
  const query = serializeGuideFilters({ ...EMPTY_GUIDE_FILTERS, ...filters });
  return `${ROUTES.guides}${query ? `?${query}` : ""}#${ALL_GUIDES_ID}`;
};

const searchableText = (guide: TravelGuide) =>
  [guide.title, guide.excerpt, getGuideTopic(guide.topic).title]
    .join(" ")
    .toLowerCase();

/** Guides in the topic and region whose text has every word of the search, newest first. */
export const filterGuides = (
  guides: readonly TravelGuide[],
  { q, topic, region }: Omit<GuideFilters, "page">,
) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return sortNewestFirst(
    guides.filter(
      (guide) =>
        (!topic || guide.topic === topic) &&
        (!region || guide.regionSlugs.includes(region)) &&
        words.every((word) => searchableText(guide).includes(word)),
    ),
  );
};
