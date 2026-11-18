import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { listBlogPages } from "@/features/blogs/services/blogsRepository";
import { listTrekPages } from "@/features/trek-page/services/trekPagesList";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";
import { ROUTES, pagePath } from "@/lib/routes";

import { toPageSeoOverrides } from "../pageSeoOverrides";

/** The Google cards' choices for this website's treks and blogs. Throws on a database error. */
export const getPageSeoOverrides = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.travelGuides, CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const [{ data, error }, treks, blogs] = await Promise.all([createDatabaseClient().from("web_page_seo_overrides").select("*").eq("locale", WEBSITE_LOCALE), listTrekPages(), listBlogPages()]);
  if (error) throw new Error(`Could not load the pages' Google settings: ${error.message}`);
  return toPageSeoOverrides(data, new Set<string>([ROUTES.home, ROUTES.about, ROUTES.contact, ROUTES.blogs, ...[...treks, ...blogs].map((page) => pagePath(page.slug))]));
};

/** The trek and blog pages the sitemap lists: not hidden, and their own main version. */
export const listListedPages = async () => {
  const [treks, blogs, { hidden, canonicals }] = await Promise.all([listTrekPages(), listBlogPages(), getPageSeoOverrides()]);
  return [...treks, ...blogs].flatMap(({ slug, modified }) => {
    const path = pagePath(slug);
    return hidden.has(path) || canonicals.has(path) ? [] : [{ path, modified }];
  });
};
