import type { RemoveBlockerGroup } from "@/components/editor/types";
import { articlePath } from "@/features/travel-guides/constants";
import { guidePath } from "@/features/trekking-guides/constants";
import { trekPath } from "@/features/treks/constants";
import type { RegionUsageKind } from "@/lib/supabase/database.types";

import { regionPath } from "../constants";
import type { RegionUsageItem } from "../types";

/** In this order in the delete window, with what to do and where each item is edited. */
const GROUPS: Record<RegionUsageKind, { label: string; fix: string; href: (id: string) => string }> = {
  trek: {
    label: "Treks in this region",
    fix: "Open each trek and pick another region for it.",
    href: trekPath,
  },
  travel_guide: {
    label: "Travel guides about this region",
    fix: "Open each guide's settings and untick this region (or pick another website for it).",
    href: articlePath,
  },
  trekking_guide: {
    label: "Trekking guides who lead here",
    fix: "Open each guide and untick this region.",
    href: guidePath,
  },
  region: {
    label: "Regions that compare with it",
    fix: "Open each region and take this one out of “Other regions”.",
    href: regionPath,
  },
};

const ORDER: RegionUsageKind[] = ["trek", "travel_guide", "trekking_guide", "region"];

/** What still uses a region, grouped for the delete window; empty when it can be deleted. */
export const toRegionBlockers = (usage: readonly RegionUsageItem[]): RemoveBlockerGroup[] =>
  ORDER.flatMap((kind) => {
    const items = usage.filter((item) => item.kind === kind);
    if (!items.length) return [];
    const { label, fix, href } = GROUPS[kind];
    return [{ label, fix, items: items.map((item) => ({ id: item.id, name: item.name, href: href(item.id) })) }];
  });
