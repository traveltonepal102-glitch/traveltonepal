import type { Photo } from "@/features/photos/types";
import { formatDateTime } from "@/utils/formatDateTime";

import type { Trek, TrekDifficulty, TrekStatus } from "../types";

/** One row of the Treks list (design: Admin-treks). Plain data, so the list can filter in the browser. */
export type TrekListItem = {
  id: string;
  name: string;
  /** The main region, and the regions the route passes through after it. */
  regionId: string;
  routeRegionIds: string[];
  /** The route, e.g. "Langtang → Manaslu". */
  regionName: string;
  days: number | null;
  difficulty: TrekDifficulty;
  priceFromUsd: number | null;
  status: TrekStatus;
  cover: Photo | null;
  /** For "Recently edited" sorting. */
  updatedAt: string;
  /** e.g. "23 Oct, 11:32" (Nepal time, formatted on the server). */
  editedLabel: string;
};

export const toTrekListItem = (trek: Trek): TrekListItem => ({
  id: trek.id,
  name: trek.name,
  regionId: trek.regionId,
  routeRegionIds: trek.routeRegionIds,
  regionName: [trek.regionName, ...trek.routeRegionNames].filter(Boolean).join(" → "),
  days: trek.days,
  difficulty: trek.difficulty,
  priceFromUsd: trek.priceFromUsd,
  status: trek.status,
  cover: trek.photos.cover,
  updatedAt: trek.updatedAt,
  editedLabel: formatDateTime(trek.updatedAt),
});

export type TrekStatusFilter = "all" | "published" | "unpublished";
export type TrekSort = "edited" | "name" | "price";

type TrekQuery = { search: string; regionId: string; status: TrekStatusFilter; sort: TrekSort };

const SORTS: Record<TrekSort, (a: TrekListItem, b: TrekListItem) => number> = {
  edited: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  name: (a, b) => a.name.localeCompare(b.name),
  // Treks without a price go last.
  price: (a, b) => (a.priceFromUsd ?? Infinity) - (b.priceFromUsd ?? Infinity),
};

/** The list's search box, region picker, status pills and sort, applied together. */
export const filterTreks = (treks: TrekListItem[], { search, regionId, status, sort }: TrekQuery) => {
  const words = search.trim().toLowerCase();
  return treks
    .filter((trek) => !words || `${trek.name} ${trek.regionName}`.toLowerCase().includes(words))
    // A region finds the treks that start there and the ones that pass through.
    .filter((trek) => !regionId || trek.regionId === regionId || trek.routeRegionIds.includes(regionId))
    .filter((trek) => status === "all" || (status === "published") === (trek.status === "published"))
    .sort(SORTS[sort]);
};
