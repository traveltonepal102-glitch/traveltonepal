import { MAIN_SITE_ID } from "@ttn/config/sites";
import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

import type { EditorSaveState } from "@/components/editor/types";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { pageSaveFailure } from "./pageSaveResult";

/**
 * A page form saves into the site it was opened for (bound by the page). When "Working on" changed since (another tab),
 * the save is refused instead of writing one site's words into another's page.
 */
export const checkPageSite = async (siteId: string): Promise<EditorSaveState | null> => {
  const current = await getCurrentSite();
  if (current?.id === siteId) return null;
  return pageSaveFailure("“Working on” changed to another site since this page opened. Reload the page, check the site, then save again.");
};

/** Shows a saved page on the website. Only Travel To Nepal's pages are on it yet; the region websites come later. */
export const refreshSitePages = (siteId: string) => {
  if (siteId === MAIN_SITE_ID) refreshWebsite([WEBSITE_CACHE_TAGS.pages]);
};
