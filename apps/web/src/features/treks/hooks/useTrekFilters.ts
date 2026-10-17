import { useSearchParams } from "next/navigation";

import { EMPTY_TREK_FILTERS, parseTrekFilters, serializeTrekFilters } from "../filtering";
import type { TrekFilters } from "../filtering";

/**
 * Treks page filters, kept in the URL (/treks?region=langtang&sort=price) so links, the back button
 * and sharing work. `replaceState` updates the URL without a reload or a server request; Next.js
 * keeps `useSearchParams` in sync with it.
 */
export const useTrekFilters = (regionSlugs: readonly string[]) => {
  const searchParams = useSearchParams();
  const filters = parseTrekFilters(new URLSearchParams(searchParams.toString()), regionSlugs);

  const setFilters = (next: TrekFilters) => {
    const query = serializeTrekFilters(next);
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  };

  return {
    filters,
    update: (patch: Partial<TrekFilters>) => setFilters({ ...filters, ...patch }),
    clearAll: () => setFilters({ ...EMPTY_TREK_FILTERS, sort: filters.sort }),
  };
};
