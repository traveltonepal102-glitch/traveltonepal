import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { toLatestGuides } from "@/features/home/homeRows";
import { check } from "@/features/home/services/trekRowsRepository";
import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";

import type { BlogsPageData } from "../types";

/** This website's blogs that have a page, with when each last changed. */
export const listBlogPages = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const blogs = await createDatabaseClient().from("web_travel_guides").select("slug, published_on, updated_on").eq("locale", WEBSITE_LOCALE);
  return check(blogs, "the travel guides").map((blog) => ({ slug: blog.slug, modified: blog.updated_on ?? blog.published_on }));
};

/** The Blogs page, read once and cached. Throws when the database can't be read (a failed refresh keeps the last good page). */
export const getBlogsPage = async (): Promise<BlogsPageData> => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const [row, guides] = await Promise.all([getSitePageRow("travel-guides"), createDatabaseClient().from("web_travel_guides").select("*").eq("locale", WEBSITE_LOCALE)]);
  const rows = check(guides, "the travel guides");
  return { top: toSitePageTop(row, photosPublicBaseUrl, "Blogs"), guides: toLatestGuides(rows, photosPublicBaseUrl, rows.length) };
};
