import type { Metadata } from "next";

import { imageFileUrl } from "@/lib/images";
import { SITE_NAME } from "@/lib/site";

import type { SitePageTop } from "./types";

/** What follows every page's title on Google (the root layout's title template; written out for the home page). */
export const TITLE_SUFFIX = ` · ${SITE_NAME}`;

/**
 * A fixed page's title, description and share preview, from its Google result in Pages (the H1 when no title). The
 * home page is the root layout's own page, so the layout's title template doesn't reach it: its title is written out.
 */
export const sitePageMetadata = (top: SitePageTop, path: string): Metadata => {
  const title = top.seo.title || top.heading;
  const isHome = path === "/";
  const description = top.seo.description || top.intro;
  return {
    title: isHome ? { absolute: `${title}${TITLE_SUFFIX}` } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      ...(top.cover ? { images: [{ url: imageFileUrl(top.cover, 1200), alt: top.cover.alt }] } : {}),
    },
  };
};
