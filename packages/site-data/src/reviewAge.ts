import type { SiteLanguage } from "@ttn/config/siteLanguage";

const DAY_MS = 24 * 60 * 60 * 1000;

type Unit = "day" | "week" | "month" | "year";

/** German: "vor einem Tag", "vor 3 Tagen" (dative after "vor"). */
const GERMAN_UNITS: Record<Unit, { one: string; many: string }> = {
  day: { one: "vor einem Tag", many: "Tagen" },
  week: { one: "vor einer Woche", many: "Wochen" },
  month: { one: "vor einem Monat", many: "Monaten" },
  year: { one: "vor einem Jahr", many: "Jahren" },
};

const ago = (count: number, unit: Unit, language: SiteLanguage) => {
  if (language === "de") return count === 1 ? GERMAN_UNITS[unit].one : `vor ${count} ${GERMAN_UNITS[unit].many}`;
  return count === 1 ? `a ${unit} ago` : `${count} ${unit}s ago`;
};

/**
 * How long ago a review was written, the way Google says it ("a week ago", "5 months ago"). `writtenOn` is
 * "YYYY-MM-DD"; a date in the future reads as today.
 */
export const reviewAge = (writtenOn: string, now: Date, language: SiteLanguage = "en"): string => {
  const days = Math.floor((now.getTime() - new Date(`${writtenOn}T00:00:00Z`).getTime()) / DAY_MS);
  if (!Number.isFinite(days) || days < 1) return language === "de" ? "heute" : "today";
  if (days < 7) return ago(days, "day", language);
  if (days < 30) return ago(Math.floor(days / 7), "week", language);
  if (days < 365) return ago(Math.max(1, Math.floor(days / 30.44)), "month", language);
  return ago(Math.floor(days / 365.25), "year", language);
};
