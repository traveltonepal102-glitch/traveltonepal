import "server-only";
import { readContactContent } from "@ttn/site-data/contactContent";

import { photosPublicBaseUrl } from "@/env";
import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";
import { SITE_NAME } from "@/lib/site";

import type { ContactPageContent } from "../types";

/** The Contact page from Pages › Contact. Throws on a database error. */
export const getContactPage = async (): Promise<ContactPageContent> => {
  const row = await getSitePageRow("contact");
  return { top: toSitePageTop(row, photosPublicBaseUrl, SITE_NAME), ...readContactContent(row.content) };
};
