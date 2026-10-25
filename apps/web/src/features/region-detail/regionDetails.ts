import type { RegionSummary } from "@/features/regions/regions";
import { treksFilterPath } from "@/features/treks/filters";
import { regionPath } from "@/lib/routes";

/** Where a region link goes: its page, or the Treks page filtered to it while it has no page. */
export const regionHref = (region: Pick<RegionSummary, "slug" | "hasPage">) =>
  region.hasPage ? regionPath(region.slug) : treksFilterPath({ region: region.slug });
