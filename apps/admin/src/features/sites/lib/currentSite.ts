import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

import { CURRENT_SITE_COOKIE } from "../constants";
import { listSites } from "../services/sitesRepository";
import type { Site } from "../types";
import { pickCurrentSite } from "./pickCurrentSite";

/** The site the admin is working on ("Working on"), once per request. Null only when there are no sites at all. */
export const getCurrentSite = cache(async (): Promise<Site | null> => {
  const [sites, cookieStore] = await Promise.all([listSites(), cookies()]);
  return pickCurrentSite(sites, cookieStore.get(CURRENT_SITE_COOKIE)?.value);
});
