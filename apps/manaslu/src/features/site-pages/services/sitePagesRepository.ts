import "server-only";
import type { SitePageSlug } from "@ttn/site-data/database.types";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS, DATABASE_CACHE_LIFE, createDatabaseClient } from "@/lib/database";

/** A fixed page's row, saved in the admin's Pages. Cached and refreshed on save; throws when the database can't be read. */
export const getSitePageRow = async (slug: SitePageSlug) => {
  "use cache";
  cacheTag(CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createDatabaseClient().from("web_site_pages").select("*").eq("slug", slug).single();
  if (error) throw new Error(`Could not load the page "${slug}": ${error.message}`);
  return data;
};
