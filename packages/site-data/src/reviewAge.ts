const DAY_MS = 24 * 60 * 60 * 1000;

const ago = (count: number, unit: string) => (count === 1 ? `a ${unit} ago` : `${count} ${unit}s ago`);

/**
 * How long ago a review was written, the way Google says it ("a week ago", "5 months ago"). `writtenOn` is
 * "YYYY-MM-DD"; a date in the future reads as today.
 */
export const reviewAge = (writtenOn: string, now: Date): string => {
  const days = Math.floor((now.getTime() - new Date(`${writtenOn}T00:00:00Z`).getTime()) / DAY_MS);
  if (!Number.isFinite(days) || days < 1) return "today";
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.floor(days / 7), "week");
  if (days < 365) return ago(Math.max(1, Math.floor(days / 30.44)), "month");
  return ago(Math.floor(days / 365.25), "year");
};
