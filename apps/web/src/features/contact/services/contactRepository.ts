import "server-only";

import { photosPublicBaseUrl } from "@/env";
import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";

import { toContactPage } from "../contactPageRows";
import type { ContactPageContent } from "../types";

/** The Contact page from Pages › Contact (cached with the page). Throws on a database error. */
export const getContactPage = async (): Promise<ContactPageContent> => toContactPage(await getSitePageRow("contact"), photosPublicBaseUrl);
