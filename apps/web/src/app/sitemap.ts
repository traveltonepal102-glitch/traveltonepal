import type { MetadataRoute } from "next";

import { pathsLeftOutOfSitemap } from "@/features/seo/pageSeoOverrides";
import { getPageSeoOverrides, getSitemapSource } from "@/features/seo/services/pageSeoOverridesRepository";
import { sitemapEntries } from "@/features/seo/sitemapEntries";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml: every page worth finding on Google, from the same cached reads the pages use, so it changes when
 * the admin saves (the reads' cache tags) and never lists a page that answers 404, is hidden from Google or names
 * another page as its main version (canonical address).
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const source = await getSitemapSource();
  return sitemapEntries(source, SITE_URL, pathsLeftOutOfSitemap(await getPageSeoOverrides(source)));
};

export default sitemap;
