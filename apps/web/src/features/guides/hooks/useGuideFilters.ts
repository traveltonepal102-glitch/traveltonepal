import { useSearchParams } from "next/navigation";

import { EMPTY_GUIDE_FILTERS, parseGuideFilters, serializeGuideFilters } from "../guideFiltering";
import type { GuideFilters } from "../guideFiltering";
import type { GuideTopicId } from "../topics";

/**
 * "All guides" list state, kept in the URL so links, sharing and the back button work. Like the Treks
 * page, the URL changes through the History API (no reload, no server request) and Next.js keeps
 * `useSearchParams` in sync. Filter changes replace the history entry; page changes add one, so Back
 * returns to the previous page.
 */
export const useGuideFilters = (regionSlugs: readonly string[]) => {
  const searchParams = useSearchParams();
  const filters = parseGuideFilters(new URLSearchParams(searchParams.toString()), regionSlugs);

  const setFilters = (next: GuideFilters, history: "push" | "replace") => {
    const query = serializeGuideFilters(next);
    const url = query ? `?${query}` : window.location.pathname;
    if (history === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };

  return {
    filters,
    setTopic: (topic: GuideTopicId | null) => setFilters({ ...filters, topic, page: 1 }, "replace"),
    setRegion: (region: string | null) => setFilters({ ...filters, region, page: 1 }, "replace"),
    clearSearch: () => setFilters({ ...filters, q: "", page: 1 }, "replace"),
    clearAll: () => setFilters(EMPTY_GUIDE_FILTERS, "replace"),
    goToPage: (page: number) => setFilters({ ...filters, page }, "push"),
  };
};
