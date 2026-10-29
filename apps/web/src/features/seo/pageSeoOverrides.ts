import type { Metadata } from "next";

import { ROUTES, guidePath, regionPath, trekPath } from "@/lib/routes";
import type { SitePageSlug, WebPageSeoOverrideRow } from "@/lib/supabase/database.types";

/** What the admin's Google cards change about how search engines see a page, by the page's path. */
export type PageSeoOverrides = {
  /** "Hide from Google": noindex, and not in the sitemap. */
  hidden: ReadonlySet<string>;
  /** A page's path → the path of the page it names as its main version (only the ones the website follows). */
  canonicals: ReadonlyMap<string, string>;
};

const SITE_PAGE_PATHS: Record<SitePageSlug, string> = {
  home: ROUTES.home,
  treks: ROUTES.treks,
  regions: ROUTES.regions,
  "travel-guides": ROUTES.guides,
  about: ROUTES.about,
  contact: ROUTES.contact,
  terms: ROUTES.terms,
  privacy: ROUTES.privacy,
  impressum: ROUTES.impressum,
  cookies: ROUTES.cookies,
};

const isSitePageSlug = (slug: string): slug is SitePageSlug => Object.hasOwn(SITE_PAGE_PATHS, slug);

const pathOf = ({ page_kind, page_slug }: WebPageSeoOverrideRow): string | undefined => {
  if (page_kind === "trek") return trekPath(page_slug);
  if (page_kind === "region") return regionPath(page_slug);
  if (page_kind === "guide") return guidePath(page_slug);
  return isSitePageSlug(page_slug) ? SITE_PAGE_PATHS[page_slug] : undefined;
};

/**
 * The overrides the website follows. A hidden page is only hidden (a canonical address next to noindex would give
 * Google two answers). A canonical address must name a page the sitemap lists (shown and meant for Google, so never
 * a 404, a noindex or a hidden page), not the page itself, and not a page that points elsewhere too (Google dislikes
 * chains); anything else is ignored and the page stays its own main version.
 */
export const toPageSeoOverrides = (rows: readonly WebPageSeoOverrideRow[], sitemapPaths: ReadonlySet<string>): PageSeoOverrides => {
  const pages = rows.flatMap((row) => {
    const path = pathOf(row);
    return path ? [{ path, target: row.canonical_path, isHidden: row.hide_from_google }] : [];
  });
  const hidden = new Set(pages.filter((page) => page.isHidden).map((page) => page.path));
  const named = pages.filter((page) => !page.isHidden && page.target);
  const pointingElsewhere = new Set(named.map((page) => page.path));
  const isMainPage = (target: string) => sitemapPaths.has(target) && !hidden.has(target) && !pointingElsewhere.has(target);
  return {
    hidden,
    canonicals: new Map(named.filter((page) => page.target !== page.path && isMainPage(page.target)).map((page) => [page.path, page.target])),
  };
};

/** The pages the sitemap leaves out: hidden ones, and those that name another page as their main version. */
export const pathsLeftOutOfSitemap = ({ hidden, canonicals }: PageSeoOverrides): ReadonlySet<string> => new Set([...hidden, ...canonicals.keys()]);

/**
 * A page's metadata with its overrides: hidden → `noindex, follow` (its links still count); a canonical address →
 * that canonical link and og:url. Pages without overrides are returned as they are.
 */
export const withPageSeoOverrides = (metadata: Metadata, { hidden, canonicals }: PageSeoOverrides): Metadata => {
  const own = metadata.alternates?.canonical;
  if (typeof own !== "string") return metadata;
  if (hidden.has(own)) return { ...metadata, robots: { index: false, follow: true } };
  const target = canonicals.get(own);
  if (!target) return metadata;
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: target },
    ...(metadata.openGraph ? { openGraph: { ...metadata.openGraph, url: target } } : {}),
  };
};
