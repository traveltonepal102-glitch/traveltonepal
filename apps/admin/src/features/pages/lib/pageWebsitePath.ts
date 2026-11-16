import type { SiteLanguage } from "@ttn/config/siteLanguage";
import { sitePagePaths } from "@ttn/config/sitePagePaths";
import type { SitePageKey } from "@ttn/config/sitePagePaths";

import type { SiteKind, SitePageSlug } from "@/lib/supabase/database.types";

/** A region website's fixed pages by their key in @ttn/config/sitePagePaths (its blog list is the travel guides page). */
const REGION_PAGE_KEYS: Partial<Record<SitePageSlug, SitePageKey>> = {
  about: "about",
  contact: "contact",
  "travel-guides": "blogs",
  terms: "terms",
  privacy: "privacy",
  impressum: "impressum",
  cookies: "cookies",
};

export type PageSite = { kind: SiteKind; language: SiteLanguage };

/**
 * Where a fixed page is on a website: Travel To Nepal's address (`mainPath`, from the page constants), or a region
 * website's in its language (/ueber-uns on the German website). Home is always "/".
 */
export const pageWebsitePath = (slug: SitePageSlug, mainPath: string, site: PageSite): string => {
  if (site.kind === "main") return mainPath;
  if (slug === "home") return "/";
  const key = REGION_PAGE_KEYS[slug];
  return key ? sitePagePaths(site.language)[key] : mainPath;
};
