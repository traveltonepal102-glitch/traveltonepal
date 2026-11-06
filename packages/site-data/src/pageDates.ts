/**
 * When a page was first published and last changed (ISO 8601: a time, or a YYYY-MM-DD day). Sent as
 * datePublished / dateModified in its JSON-LD and as article:published_time / article:modified_time.
 */
export type PageDates = { published: string; modified?: string };

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * "2026-10-24T09:05:11.123456+00:00" (as Postgres sends it) → "2026-10-24T09:05:11Z"; a day ("2026-10-26") stays a
 * day; undefined when it isn't a date.
 */
const isoDate = (value: string) => {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return undefined;
  return DAY.test(value) ? value : new Date(time).toISOString().replace(/\.\d{3}Z$/, "Z");
};

/** A row's dates (e.g. published_at and updated_at); a change dated before the page was published counts as published. */
export const toPageDates = (publishedAt: string, modifiedAt: string): PageDates | undefined => {
  const published = isoDate(publishedAt);
  if (!published) return undefined;
  const modified = isoDate(modifiedAt);
  return { published, modified: modified && Date.parse(modified) > Date.parse(published) ? modified : published };
};

/** The later of two saves, for a page made of two rows. */
export const latestOf = (first: string, second: string | null | undefined) => (second && Date.parse(second) > Date.parse(first) ? second : first);

/** schema.org's datePublished and dateModified, for the page's own node (WebPage, Article, AboutPage…). */
export const datesJsonLd = (dates: PageDates | undefined) =>
  dates ? { datePublished: dates.published, ...(dates.modified ? { dateModified: dates.modified } : {}) } : {};
