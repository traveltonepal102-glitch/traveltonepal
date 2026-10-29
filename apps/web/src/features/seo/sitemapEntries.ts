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

type SitemapPage = { path: string; lastModified?: string };

/** The fixed pages, then every trek, region and travel guide with a page; each path once. */
const sitemapPages = ({ treks, regions, guideSlugs }: SitemapSource): SitemapPage[] => {
  const pages: SitemapPage[] = [
    ...FIXED_PAGES.map((path) => ({ path })),
    ...treks.flatMap((trek) => (trek.hasPage ? [{ path: trekPath(trek.slug), ...(trek.updatedAt ? { lastModified: trek.updatedAt } : {}) }] : [])),
    ...regions.flatMap((region) => (region.hasPage ? [{ path: regionPath(region.slug) }] : [])),
    ...guideSlugs.map((slug) => ({ path: guidePath(slug) })),
  ];
  return pages.filter((page, index) => pages.findIndex((other) => other.path === page.path) === index);
};

/** The paths of the pages meant for Google (a canonical address may only name one of these). */
export const sitemapPaths = (source: SitemapSource): ReadonlySet<string> => new Set(sitemapPages(source).map((page) => page.path));

/**
 * The sitemap's entries, as full URLs on `siteUrl` (a link to a page that answers 404 would only waste Google's
 * visit). Pages in `leftOut` (hidden from Google, or naming another page as their main version) aren't listed.
 */
export const sitemapEntries = (source: SitemapSource, siteUrl: URL, leftOut: ReadonlySet<string> = new Set()): MetadataRoute.Sitemap =>
  sitemapPages(source)
    .filter((page) => !leftOut.has(page.path))
    .map(({ path, lastModified }) => ({ url: new URL(path, siteUrl).toString(), ...(lastModified ? { lastModified } : {}) }));
