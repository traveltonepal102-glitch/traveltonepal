import { formatCount } from "@/lib/format";

// UTC: a publish date is a calendar day, the same for every visitor.
const MONTH_YEAR = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-10-06" → "Oct 2026" */
export const formatGuideMonth = (isoDate: string) => MONTH_YEAR.format(new Date(isoDate));

/** 8 → "8 min read" */
export const formatReadTime = (minutes: number) => `${minutes} min read`;

/** 1 → "1 guide", 4 → "4 guides" */
export const formatGuideCount = (count: number) => formatCount(count, "guide");

/** Total reading time to the nearest 5 minutes: 48 → "About 50 minutes in total" (at least 5). */
export const formatTotalReadTime = (minutes: number) =>
  `About ${Math.max(5, Math.round(minutes / 5) * 5)} minutes in total`;
