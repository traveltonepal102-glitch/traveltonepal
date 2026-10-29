import { passesThrough } from "./route";
import { TREKS } from "./treks";
import type { TrekSummary } from "./types";

const SAME_REGION = 4;
const POPULAR = 2;
/** Each day of difference in length costs a tenth of a point, so similar lengths win ties. */
const PER_DAY_DIFFERENCE = 0.1;

const score = (trek: TrekSummary, other: TrekSummary) =>
  (trek.route.some((stop) => passesThrough(other, stop.slug)) ? SAME_REGION : 0) +
  (other.isPopular ? POPULAR : 0) -
  Math.abs(other.days - trek.days) * PER_DAY_DIFFERENCE;

/** Treks to suggest next to this one: sharing a region first, then popular ones, then similar lengths. */
export const similarTreks = (trek: TrekSummary, limit = 4, treks: readonly TrekSummary[] = TREKS): TrekSummary[] =>
  treks
    .filter((other) => other.slug !== trek.slug)
    .map((other) => ({ other, value: score(trek, other) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ other }) => other);
