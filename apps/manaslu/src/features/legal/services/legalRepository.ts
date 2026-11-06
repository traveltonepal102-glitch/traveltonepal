import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, createDatabaseClient } from "@/lib/database";

import { toLegalDoc } from "../legalRows";
import type { LegalDoc, LegalSlug } from "../types";

const readPageRow = async (slug: LegalSlug) => {
  "use cache";
  cacheTag(CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createDatabaseClient().from("web_site_pages").select("*").eq("slug", slug).single();
  if (error) throw new Error(`Could not load the page "${slug}": ${error.message}`);
  return data;
};

/** A legal page from Pages › Legal pages, with the company details from Site settings. Throws on a database error. */
export const getLegalDoc = async (slug: LegalSlug): Promise<LegalDoc> => {
  const [row, settings] = await Promise.all([readPageRow(slug), getSiteSettings()]);
  return toLegalDoc(slug, row, settings);
};
