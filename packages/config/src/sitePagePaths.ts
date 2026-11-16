import type { SiteLanguage } from "./siteLanguage";

/**
 * The addresses of a region website's fixed pages, in its language (decided 2026-11-15: the German website uses
 * German addresses). The region websites' routes and the admin's links (Pages, Structured data) both read these, so
 * they never disagree. Travel To Nepal keeps its own routes (`apps/web/src/lib/routes.ts`), always English.
 * `/whatsapp`, `/email` and `/review` stay the same in every language: they only redirect and are hidden from Google.
 */
export type SitePageKey = "about" | "contact" | "blogs" | "terms" | "privacy" | "impressum" | "cookies";

const PAGE_PATHS: Record<SiteLanguage, Record<SitePageKey, string>> = {
  en: {
    about: "/about",
    contact: "/contact",
    blogs: "/blogs",
    terms: "/terms",
    privacy: "/privacy",
    impressum: "/impressum",
    cookies: "/cookies",
  },
  de: {
    about: "/ueber-uns",
    contact: "/kontakt",
    blogs: "/blog",
    terms: "/agb",
    privacy: "/datenschutz",
    impressum: "/impressum",
    cookies: "/cookies",
  },
};

/** The word between the blog list's address and its page number: /blogs/page/2, /blog/seite/2. */
const PAGE_SEGMENTS: Record<SiteLanguage, string> = { en: "page", de: "seite" };

export const sitePagePaths = (language: SiteLanguage): Readonly<Record<SitePageKey, string>> => PAGE_PATHS[language];

/** The blog list's page `page` (1 = the list's own address). */
export const blogListPagePath = (language: SiteLanguage, page: number) =>
  page <= 1 ? PAGE_PATHS[language].blogs : `${PAGE_PATHS[language].blogs}/${PAGE_SEGMENTS[language]}/${page}`;
