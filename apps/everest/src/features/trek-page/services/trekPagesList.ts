import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { check } from "@/features/home/services/trekRowsRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";

/** This website's treks that have their own page: all with a page but the main one, which is the home page. */
export const listTrekPages = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createDatabaseClient();
  const [site, treks] = await Promise.all([client.from("web_site").select("home_trek_slug").single(), client.from("web_treks").select("slug, updated_at, has_page").eq("locale", WEBSITE_LOCALE)]);
  const homeSlug = check(site, "the website").home_trek_slug;
  return check(treks, "the treks").flatMap((row) => (row.has_page && row.slug !== homeSlug ? [{ slug: row.slug, modified: row.updated_at }] : []));
};
