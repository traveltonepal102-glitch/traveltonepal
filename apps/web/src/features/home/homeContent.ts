import type { GuideSummary } from "@/features/guides/types";
import type { TrekSummary } from "@/features/treks/types";
import { capitalize, formatCount, formatCountWord } from "@/lib/format";

/** The featured guide and two more (the guides row has three places). */
const HOME_GUIDE_COUNT = 3;

/**
 * "Nepal trekking guides": up to three published guides, in the order given (featured first). Each card opens
 * the guide's page (GuideCard → guidePath).
 */
export const homeGuides = (guides: readonly GuideSummary[]) => guides.slice(0, HOME_GUIDE_COUNT);

/** "Nine regions. Each one a different Nepal." */
export const regionsHeading = (regionCount: number) =>
  `${capitalize(formatCountWord(regionCount))} ${regionCount === 1 ? "region" : "regions"}. Each one a different Nepal.`;

/** The trek finder's "any region" choice: "All 9 regions" ("All regions" with fewer than two). */
export const allRegionsLabel = (regionCount: number) => (regionCount > 1 ? `All ${formatCount(regionCount, "region")}` : "All regions");

export type HomeTrekFilter = { key: string; label: string; matches: (trek: TrekSummary) => boolean };

/** Home filter chips; "Under 10 days" uses the shared short-trek limit (up to 9 days). */
const TREK_FILTERS: readonly HomeTrekFilter[] = [
  { key: "classic", label: "Classic routes", matches: (trek) => trek.tags.includes("classic") },
  { key: "quiet", label: "Off the beaten path", matches: (trek) => trek.tags.includes("off-the-beaten-path") },
  { key: "short", label: "Under 10 days", matches: (trek) => trek.days < 10 },
];

/** The chips worth showing: each one at least one trek matches (an empty chip would show no cards). */
export const homeTrekFilters = (treks: readonly TrekSummary[]) => TREK_FILTERS.filter((filter) => treks.some(filter.matches));
