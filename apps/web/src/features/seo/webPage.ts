import type { JsonLdData } from "@/lib/jsonLd";
import { absoluteUrl } from "@/lib/site";

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

/** schema.org's datePublished and dateModified, for the page's own node (WebPage, Article, AboutPage…). */
export const datesJsonLd = (dates: PageDates | undefined): JsonLdData =>
  dates ? { datePublished: dates.published, ...(dates.modified ? { dateModified: dates.modified } : {}) } : {};

type WebPageInput = {
  /** A more precise kind of page, e.g. "CollectionPage" for a list. */
  type?: "WebPage" | "CollectionPage";
  path: string;
  name: string;
  dates: PageDates | undefined;
};

/** The page itself, with its dates: for pages whose JSON-LD has no node of their own (a trek is a TouristTrip). */
export const webPageJsonLd = ({ type = "WebPage", path, name, dates }: WebPageInput): JsonLdData => ({
  "@type": type,
  url: absoluteUrl(path),
  name,
  ...datesJsonLd(dates),
});
