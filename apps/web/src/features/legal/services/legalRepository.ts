import "server-only";

import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { toLegalDoc } from "../legalPageRows";
import type { LegalDoc, LegalSlug } from "../types";

/** A legal page from Pages › Legal pages, with the company details from Site settings. Throws on a database error. */
export const getLegalDoc = async (slug: LegalSlug): Promise<LegalDoc> => {
  const [row, settings] = await Promise.all([getSitePageRow(slug), getSiteSettings()]);
  return toLegalDoc(slug, row, settings);
};
