import type { Metadata } from "next";

import { ROUTES, guidePath, regionPath, trekPath } from "@/lib/routes";
import type { SitePageSlug, WebCanonicalOverrideRow } from "@/lib/supabase/database.types";

/** A page's path → the path of the page it names as its main version (only the ones the website follows). */
export type CanonicalOverrides = ReadonlyMap<string, string>;

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

const pathOf = ({ page_kind, page_slug }: WebCanonicalOverrideRow): string | undefined => {
  if (page_kind === "trek") return trekPath(page_slug);
  if (page_kind === "region") return regionPath(page_slug);
  if (page_kind === "guide") return guidePath(page_slug);
  return isSitePageSlug(page_slug) ? SITE_PAGE_PATHS[page_slug] : undefined;
};

/**
 * The canonical addresses the website follows: the named page must be one the sitemap lists (shown and meant for
 * Google, so never a 404 or a noindex page), not the page itself, and not a page that points elsewhere too (Google
 * dislikes chains). Anything else is ignored and the page stays its own main version.
 */
export const toCanonicalOverrides = (rows: readonly WebCanonicalOverrideRow[], sitemapPaths: ReadonlySet<string>): CanonicalOverrides => {
  const named = rows.flatMap((row) => {
    const path = pathOf(row);
    return path ? [[path, row.canonical_path] as const] : [];
  });
  const pointingElsewhere = new Set(named.map(([path]) => path));
  return new Map(named.filter(([path, target]) => target !== path && sitemapPaths.has(target) && !pointingElsewhere.has(target)));
};

/** A page's metadata pointing at its main version (canonical link and og:url), when it has one the website follows. */
export const withCanonicalOverride = (metadata: Metadata, overrides: CanonicalOverrides): Metadata => {
  const own = metadata.alternates?.canonical;
  const target = typeof own === "string" ? overrides.get(own) : undefined;
  if (!target) return metadata;
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: target },
    ...(metadata.openGraph ? { openGraph: { ...metadata.openGraph, url: target } } : {}),
  };
};
