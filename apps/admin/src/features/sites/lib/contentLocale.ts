import "server-only";
import type { SiteLanguage } from "@ttn/config/siteLanguage";

import { listSites } from "../services/sitesRepository";
import { getCurrentSite } from "./currentSite";

/**
 * The language a website's treks, travel guides, authors and trekking guides are typed in: the website's own
 * (decided 2026-11-15, `sites.language`). The database refuses text in another language for them
 * (check_content_locale). Regions are Travel To Nepal's and stay English (`REGION_LOCALE`).
 */
export const contentLocaleOf = async (siteId: string): Promise<SiteLanguage> =>
  (await listSites()).find((site) => site.id === siteId)?.language ?? "en";

/** The content language of the website "Working on" shows: what lists, pickers and editors read. */
export const currentContentLocale = async (): Promise<SiteLanguage> => (await getCurrentSite())?.language ?? "en";
