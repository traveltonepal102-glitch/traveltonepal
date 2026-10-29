import type { LibraryPhoto } from "../types";

/** The team works in Nepal, so "today" and the months are Nepal dates. */
const NEPAL_DAY = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Kathmandu" });
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Recent uploads" holds the last 30 days. */
export const RECENT_DAYS = 30;

/** The recent intervals, newest first: up to how many days ago each one reaches. */
const INTERVALS = [
  { label: "Today", maxDaysAgo: 0 },
  { label: "Yesterday", maxDaysAgo: 1 },
  { label: "Last 7 days", maxDaysAgo: 6 },
  { label: "Last 30 days", maxDaysAgo: RECENT_DAYS - 1 },
] as const;

/** The Nepal date of a moment, as a UTC midnight to count whole days with. */
const nepalDay = (moment: Date) => new Date(`${NEPAL_DAY.format(moment)}T00:00:00Z`);

/** Whole days between the upload and now, by Nepal date: 0 today, 1 yesterday. */
export const daysAgo = (createdAt: string, now: Date) => Math.round((nepalDay(now).getTime() - nepalDay(new Date(createdAt)).getTime()) / DAY_MS);

/** Uploaded in the last 30 days (Nepal dates)? */
export const isRecent = (photo: LibraryPhoto, now: Date) => daysAgo(photo.createdAt, now) < RECENT_DAYS;

const groupLabel = (createdAt: string, now: Date) => {
  const days = daysAgo(createdAt, now);
  return INTERVALS.find((interval) => days <= interval.maxDaysAgo)?.label ?? MONTH.format(nepalDay(new Date(createdAt)));
};

export type UploadTimeGroup = { label: string; photos: LibraryPhoto[] };

/**
 * Photos by when they were uploaded, newest first: Today, Yesterday, Last 7 days, Last 30 days, then each older
 * month ("September 2026"). Empty groups are left out.
 */
export const groupByUploadTime = (photos: readonly LibraryPhoto[], now: Date): UploadTimeGroup[] => {
  const groups = new Map<string, LibraryPhoto[]>();
  const newestFirst = [...photos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  for (const photo of newestFirst) {
    const label = groupLabel(photo.createdAt, now);
    groups.set(label, [...(groups.get(label) ?? []), photo]);
  }
  return [...groups.entries()].map(([label, groupPhotos]) => ({ label, photos: groupPhotos }));
};
