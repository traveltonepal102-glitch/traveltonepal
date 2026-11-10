import { toRemoveBlockers } from "@/components/editor/removeBlockers";
import type { RemoveBlockerKind } from "@/components/editor/removeBlockers";
import type { RemoveBlockerGroup } from "@/components/editor/types";
import { REGION_HOME_PATH } from "@/features/region-home/constants";
import { regionPath } from "@/features/regions/constants";
import { articlePath } from "@/features/travel-guides/constants";
import type { TrekUsageKind } from "@/lib/supabase/database.types";

import type { TrekUsageItem } from "../types";

/** In this order in the delete window, with what to do and where each item is edited. */
const KINDS: readonly (readonly [TrekUsageKind, RemoveBlockerKind])[] = [
  ["website", { label: "Main trek of the website", fix: "Open Pages › Home and pick another main trek.", href: () => REGION_HOME_PATH }],
  ["region", { label: "Regions that feature it", fix: "Open each region and pick another featured trek.", href: regionPath }],
  [
    "travel_guide",
    {
      label: "Travel guides that show it",
      fix: "Open each guide and pick another trek in “Plan this trek”, or change or remove its trek sections.",
      href: articlePath,
    },
  ],
];

/** What still uses a trek, grouped for the delete window; empty when it can be deleted. */
export const toTrekBlockers = (usage: readonly TrekUsageItem[]): RemoveBlockerGroup[] => toRemoveBlockers(usage, KINDS);
