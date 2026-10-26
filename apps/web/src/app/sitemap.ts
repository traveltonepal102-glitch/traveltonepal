import type { MetadataRoute } from "next";

import { listGuidePageSlugs } from "@/features/guide-article/services/guidePageRepository";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { sitemapEntries } from "@/features/seo/sitemapEntries";
import { listTreks } from "@/features/treks/services/treksRepository";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml: every page worth finding on Google, from the same cached reads the pages use, so it changes when
 * the admin saves (the reads' cache tags) and never lists a page that answers 404.
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [treks, regions, guideSlugs] = await Promise.all([listTreks(), listRegionCards(), listGuidePageSlugs()]);
  return sitemapEntries({ treks, regions, guideSlugs }, SITE_URL);
};

export default sitemap;
