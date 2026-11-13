import type { HomeGuide } from "@/features/home/types";

export const BLOGS_PER_PAGE = 9;

/** How many pages the whole list has (each with an address of its own, see `blogsPagePath`). */
export const blogPageCount = (total: number, perPage = BLOGS_PER_PAGE) => Math.max(1, Math.ceil(total / perPage));

/** A search or a topic narrowing the list, kept in the address so sharing and the back button work; `page` is the page of what they found. */
export type BlogFilters = { q: string; topic: string | null; page: number };

export const EMPTY_BLOG_FILTERS: BlogFilters = { q: "", topic: null, page: 1 };

/** Lower case without accents, so "Himalaya" finds "himālaya". */
const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Every word typed must appear in the blog's title, text or topic. */
export const matchesBlogSearch = ({ title, text, tag }: HomeGuide, q: string) => {
  const haystack = normalize(`${title} ${text} ${tag}`);
  return normalize(q).split(/\s+/).filter(Boolean).every((word) => haystack.includes(word));
};

/** The address's values, with anything unusable replaced by the default: an unknown topic or a page that isn't a whole number above 0. */
export const parseBlogFilters = (params: URLSearchParams, topics: readonly string[]): BlogFilters => {
  const topic = params.get("topic");
  const page = Number(params.get("page"));
  return {
    q: params.get("q")?.trim() ?? "",
    topic: topic && topics.includes(topic) ? topic : null,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
};

/** The query for these filters, without the defaults ("" for none). */
export const serializeBlogFilters = ({ q, topic, page }: BlogFilters) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  return params.toString();
};

/** The topics the blogs have, each once with its name, in the blogs' order. */
export const blogTopics = (guides: readonly HomeGuide[]) => [...new Map(guides.map((guide) => [guide.topic, guide.tag])).entries()].map(([id, label]) => ({ id, label }));

/** What one page of the list shows. A page past the end shows the last one. */
export const toBlogPage = (guides: readonly HomeGuide[], { q, topic, page }: BlogFilters, perPage = BLOGS_PER_PAGE) => {
  const matches = guides.filter((guide) => (!topic || guide.topic === topic) && matchesBlogSearch(guide, q));
  const pageCount = blogPageCount(matches.length, perPage);
  const current = Math.min(page, pageCount);
  return {
    items: matches.slice((current - 1) * perPage, current * perPage),
    page: current,
    pageCount,
    total: matches.length,
    isFiltering: Boolean(q || topic),
  };
};

/** The page links: the first, the last and those beside the current one, with a gap for any left out. */
export const pageNumbers = (page: number, pageCount: number): (number | "gap")[] => {
  const shown = [...new Set([1, page - 1, page, page + 1, pageCount])].filter((number) => number >= 1 && number <= pageCount).toSorted((a, b) => a - b);
  return shown.flatMap((number, index) => (index > 0 && number - shown[index - 1] > 1 ? (["gap", number] as const) : [number]));
};
