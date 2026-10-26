import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import type { SitePageSlug, WebSitePageRow } from "@/lib/supabase/database.types";
import { createWebsiteClient } from "@/lib/supabase/server";

import type { PageCounts } from "../pageCounts";
import { withPageCounts } from "../pageCounts";
import { toSitePageTop } from "../sitePageRows";
import type { SitePageTop } from "../types";

/**
 * One fixed page as saved in the admin's Pages (every page's row exists from the start). Cached and refreshed when
 * the page is saved; throws when the database can't be read or the row is missing.
 */
export const getSitePageRow = async (slug: SitePageSlug): Promise<WebSitePageRow> => {
  "use cache";
  cacheTag(CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_site_pages").select("*").eq("slug", slug).single();
  if (error) throw new Error(`Could not load the ${slug} page: ${error.message}`);
  return data;
};

/** A list page's top and Google result (Pages › List pages), with {regions} and {treks} filled in. */
export const getListPageTop = async (slug: "home" | "treks" | "regions" | "travel-guides", counts: PageCounts): Promise<SitePageTop> =>
  withPageCounts(toSitePageTop(await getSitePageRow(slug), photosPublicBaseUrl, "Nepal"), counts);
