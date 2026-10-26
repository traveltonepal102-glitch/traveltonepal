import type { MetadataRoute } from "next";

import { ROUTES, guidePath, regionPath, trekPath } from "@/lib/routes";

/** What the sitemap lists, as the pages themselves decide it: only things that have their own page. */
export type SitemapSource = {
  treks: readonly { slug: string; hasPage: boolean; updatedAt?: string }[];
  regions: readonly { slug: string; hasPage: boolean }[];
  /** Travel guides that have their own page. */
  guideSlugs: readonly string[];
};

/**
 * Pages worth finding on Google. Impressum and the cookie settings page are left out on purpose: they carry
 * `noindex` and have no search value.
 */
const FIXED_PAGES = [ROUTES.home, ROUTES.treks, ROUTES.regions, ROUTES.guides, ROUTES.about, ROUTES.contact, ROUTES.privacy, ROUTES.terms];

/**
 * The sitemap's entries, as full URLs on `siteUrl`: the fixed pages, then every trek, region and travel guide with
 * a page (a link to a page that answers 404 would only waste Google's visit). Each address once.
 */
export const sitemapEntries = ({ treks, regions, guideSlugs }: SitemapSource, siteUrl: URL): MetadataRoute.Sitemap => {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const entries: MetadataRoute.Sitemap = [
    ...FIXED_PAGES.map((path) => ({ url: url(path) })),
    ...treks.flatMap((trek) => (trek.hasPage ? [{ url: url(trekPath(trek.slug)), ...(trek.updatedAt ? { lastModified: trek.updatedAt } : {}) }] : [])),
    ...regions.flatMap((region) => (region.hasPage ? [{ url: url(regionPath(region.slug)) }] : [])),
    ...guideSlugs.map((slug) => ({ url: url(guidePath(slug)) })),
  ];
  return entries.filter((entry, index) => entries.findIndex((other) => other.url === entry.url) === index);
};
