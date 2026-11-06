import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

/** Shows a saved page on its website. */
export const refreshSitePages = (siteId: string) => refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.pages]);
