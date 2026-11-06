import type { PageDates } from "@ttn/site-data/pageDates";
import { SHARE_IMAGE_SIZE } from "@ttn/ui/lib/photos";
import type { Metadata } from "next";

import { SITE_NAME } from "./site";

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
  /** The page's picture for shared links (a library photo's 1200×630 share file). */
  shareImageBase?: string;
  /** Sent as article:published_time and article:modified_time (type "article"). */
  dates?: PageDates;
  /** The website is live in the admin's Sites: until then no page is listed or followed. */
  isLive: boolean;
  /** False for a page with no search value (Impressum, Cookie settings): Google follows its links but doesn't list it. */
  isListed?: boolean;
};

const robotsFor = (isLive: boolean, isListed: boolean): Metadata["robots"] => {
  if (!isLive) return { index: false, follow: false };
  return isListed ? undefined : { index: false, follow: true };
};

/** A page's Google result, canonical address and share tags, the same on every page of this website. */
export const pageMetadata = ({ path, title, description, shareImageBase, dates, isLive, isListed = true }: PageMetadataInput): Metadata => {
  const images = shareImageBase ? [{ url: shareImageBase, ...SHARE_IMAGE_SIZE, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(isLive, isListed),
    openGraph: {
      ...(dates ? { type: "article" as const, publishedTime: dates.published, modifiedTime: dates.modified } : { type: "website" as const }),
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  };
};
