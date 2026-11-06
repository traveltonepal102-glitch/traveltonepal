import { readContactContent } from "@ttn/site-data/contactContent";

import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import type { WebSitePageRow } from "@/lib/supabase/database.types";

import type { ContactPageContent } from "./types";

/** The web_site_pages row of the Contact page, as the page shows it; broken or empty items are left out. */
export const toContactPage = (row: WebSitePageRow, photosBaseUrl: string): ContactPageContent => ({
  top: toSitePageTop(row, photosBaseUrl, "Kathmandu"),
  ...readContactContent(row.content),
});
