import { blogListPagePath, sitePagePaths } from "@ttn/config/sitePagePaths";

import { SITE_LANGUAGE } from "./site";

const PAGES = sitePagePaths(SITE_LANGUAGE);

/**
 * This website's addresses, in German (decided 2026-11-15; @ttn/config/sitePagePaths, which the admin reads too). Flat:
 * a trek or a blog is directly under the root. The route folders in app/ have the same names.
 */
export const ROUTES = {
  home: "/",
  blogs: PAGES.blogs,
  about: PAGES.about,
  contact: PAGES.contact,
  terms: PAGES.terms,
  privacy: PAGES.privacy,
  impressum: PAGES.impressum,
  cookies: PAGES.cookies,
  /** Redirects to the "write a review" link in Site settings (a plain link, not a page). */
  review: "/review",
} as const;

/** A page of the blog list: the first is the blog page itself (/blog), the rest have an address of their own (/blog/seite/2), built ahead. */
export const blogsPagePath = (page: number) => blogListPagePath(SITE_LANGUAGE, page);

/** A trek's or a blog's address. */
export const pagePath = (slug: string) => `/${slug}`;
