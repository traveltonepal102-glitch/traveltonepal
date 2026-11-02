import type { Metadata } from "next";

import { shareMetadata } from "@/features/seo/shareMetadata";
import { SITE_NAME } from "@/lib/site";

import type { SitePageTop } from "./types";

/** What follows every page's title on Google (the root layout's title template; written out for the home page). */
export const TITLE_SUFFIX = ` · ${SITE_NAME}`;

/** The page's name in its JSON-LD: its Google title, else its H1. */
export const sitePageName = (top: SitePageTop) => top.seo.title || top.heading;

/**
 * A fixed page's title, description and share preview, from its Google result in Pages (the H1 when no title; shared
 * links show the chosen share photo, else the photo behind the heading, else Site settings'). The
 * home page is the root layout's own page, so the layout's title template doesn't reach it: its title is written out.
 * Its dates make it an article for share previews, except home, the site itself ("website"; its dates are in its JSON-LD).
 */
export const sitePageMetadata = (top: SitePageTop, path: string): Metadata => {
  const title = sitePageName(top);
  const isHome = path === "/";
  const description = top.seo.description || top.intro;
  return {
    title: isHome ? { absolute: `${title}${TITLE_SUFFIX}` } : title,
    description,
    alternates: { canonical: path },
    ...shareMetadata({ path, title, description, images: [top.seo.shareImage, top.cover], dates: isHome ? undefined : top.dates }),
  };
};
