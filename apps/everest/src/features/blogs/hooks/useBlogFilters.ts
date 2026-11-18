import { useSearchParams } from "next/navigation";

import { parseBlogFilters, serializeBlogFilters } from "../blogFiltering";
import type { BlogFilters } from "../blogFiltering";

/**
 * The list's state in the address. It changes through the History API (no reload, no server request) and Next.js keeps
 * `useSearchParams` in sync. Typing or a topic replaces the history entry; a new page adds one, so Back returns to the last page.
 */
export const useBlogFilters = (topics: readonly string[]) => {
  const searchParams = useSearchParams();
  const filters = parseBlogFilters(new URLSearchParams(searchParams.toString()), topics);

  const go = (next: BlogFilters, history: "push" | "replace") => {
    const query = serializeBlogFilters(next);
    const url = query ? `?${query}` : window.location.pathname;
    if (history === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };

  return { filters, go };
};
