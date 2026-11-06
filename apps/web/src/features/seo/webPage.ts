import type { JsonLdData } from "@/lib/jsonLd";
import { absoluteUrl } from "@/lib/site";
import { datesJsonLd } from "@ttn/site-data/pageDates";
import type { PageDates } from "@ttn/site-data/pageDates";

export { datesJsonLd, toPageDates } from "@ttn/site-data/pageDates";
export type { PageDates } from "@ttn/site-data/pageDates";

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
