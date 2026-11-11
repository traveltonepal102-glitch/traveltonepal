import { EDITABLE_PAGES, LEGAL_PAGES, LIST_PAGES } from "@/features/pages/constants";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { SiteKind, SitePageSlug } from "@/lib/supabase/database.types";

import type { PageKind, PageRef } from "./types";

export const STRUCTURED_DATA_PATH = ADMIN_SECTIONS.structuredData.href;

/** One page's schemas, e.g. /structured-data/trek/<id> or /structured-data/page/about. */
export const pageSchemasPath = ({ kind, key }: PageRef) => `${STRUCTURED_DATA_PATH}/${kind}/${key}`;

export const PAGE_KINDS = ["page", "trek", "region", "guide"] as const satisfies readonly PageKind[];

export const PAGE_KIND_LABELS: Record<PageKind, string> = { page: "Fixed pages", trek: "Treks", region: "Regions", guide: "Travel guides" };

type FixedPage = { slug: SitePageSlug; label: string; websitePath: string };

/** Every fixed page slug there is (the main site has them all), to check one from an address. */
export const FIXED_PAGES: readonly FixedPage[] = [...LIST_PAGES, ...EDITABLE_PAGES, ...LEGAL_PAGES];

/** A region website's own fixed pages: Home is its main trek, the travel guides list is its blogs (apps/manaslu/src/lib/routes.ts). */
const REGION_FIXED_PAGES: readonly FixedPage[] = [
  { slug: "home", label: "Home", websitePath: "/" },
  { slug: "travel-guides", label: "Blogs", websitePath: "/blogs" },
  ...EDITABLE_PAGES,
  ...LEGAL_PAGES,
];

/** The fixed pages a website has, in the order the menu shows them. */
export const fixedPagesFor = (siteKind: SiteKind): readonly FixedPage[] => (siteKind === "main" ? FIXED_PAGES : REGION_FIXED_PAGES);

/** Where the website shows an item with this slug: the main site in folders, a region website at its root. */
export const itemWebsitePath = (kind: Exclude<PageKind, "page">, slug: string, siteKind: SiteKind) => {
  if (siteKind !== "main") return `/${slug}`;
  return { trek: `/treks/${slug}`, region: `/regions/${slug}`, guide: `/travel-guides/${slug}` }[kind];
};

/**
 * The limits. The database allows a little more (supabase/migrations/20261029155000_page_schemas.sql): it stores
 * the JSON with a space after each ":" and ",".
 */
export const SCHEMA_LIMITS = { blocks: 10, label: 80, jsonBytes: 20_000 } as const;

/** Types Google does not accept from the business itself (self-serving review snippets), anywhere in a block. */
export const FORBIDDEN_TYPES = ["AggregateRating", "Review"] as const;

/** A schema type the website writes by itself, and when. */
export type AutomaticSchema = { type: string; when?: string };

const EVERY_PAGE: AutomaticSchema[] = [{ type: "TravelAgency", when: "every page, from Site settings" }];
const BREADCRUMBS: AutomaticSchema = { type: "BreadcrumbList" };
const faq = (where: string): AutomaticSchema => ({ type: "FAQPage", when: `when ${where} has questions` });

const FIXED_PAGE_SCHEMAS: Partial<Record<SitePageSlug, AutomaticSchema[]>> = {
  home: [{ type: "WebSite", when: "the site's name and its other spellings" }],
  about: [{ type: "AboutPage" }, BREADCRUMBS],
  contact: [{ type: "ContactPage" }, BREADCRUMBS, faq("the page")],
  regions: [BREADCRUMBS, { type: "ItemList", when: "the regions" }],
  "travel-guides": [BREADCRUMBS, { type: "ItemList", when: "the guides" }],
};

const LEGAL_PAGE: AutomaticSchema[] = [{ type: "WebPage" }];

/** A region website's (apps/manaslu/src/features/<page>/seo.ts, home/homeJsonLd.ts). */
const REGION_FIXED_PAGE_SCHEMAS: Partial<Record<SitePageSlug, AutomaticSchema[]>> = {
  home: [{ type: "WebPage" }, { type: "TouristTrip", when: "the main trek, with its prices" }, faq("the main trek")],
  "travel-guides": [{ type: "CollectionPage" }, BREADCRUMBS, { type: "ItemList", when: "the blogs" }],
  about: [{ type: "AboutPage" }, BREADCRUMBS],
  contact: [{ type: "ContactPage" }, BREADCRUMBS, faq("the page")],
  terms: LEGAL_PAGE,
  privacy: LEGAL_PAGE,
  impressum: LEGAL_PAGE,
  cookies: LEGAL_PAGE,
};

const fixedPageSchemas = (schemas: Partial<Record<SitePageSlug, AutomaticSchema[]>>, key: string) =>
  Object.entries(schemas).find(([slug]) => slug === key)?.[1] ?? [];

/** A region website's: its treks and blogs are pages of their own (its main trek is Home). */
const regionAutomaticSchemas = ({ kind, key }: PageRef): AutomaticSchema[] => {
  if (kind === "trek") return [{ type: "WebPage" }, BREADCRUMBS, { type: "TouristTrip", when: "with the prices" }, faq("the trek"), ...EVERY_PAGE];
  if (kind === "guide") return [{ type: "BlogPosting" }, BREADCRUMBS, faq("the blog"), ...EVERY_PAGE];
  return [...fixedPageSchemas(REGION_FIXED_PAGE_SCHEMAS, key), ...EVERY_PAGE];
};

/**
 * What the website already writes on this page (apps/web/src/features/<page>/seo.ts, on a region website
 * apps/manaslu/src/features/<page>/seo.ts): a second block of the same type would compete with it, so the editor warns
 * about one.
 */
export const automaticSchemas = (ref: PageRef, siteKind: SiteKind): AutomaticSchema[] => {
  if (siteKind !== "main") return regionAutomaticSchemas(ref);
  const { kind, key } = ref;
  if (kind === "trek") return [BREADCRUMBS, { type: "TouristTrip", when: "with the prices" }, faq("the trek"), ...EVERY_PAGE];
  if (kind === "region") return [BREADCRUMBS, { type: "TouristDestination" }, faq("the region"), ...EVERY_PAGE];
  if (kind === "guide") return [{ type: "Article" }, BREADCRUMBS, faq("the guide"), ...EVERY_PAGE];
  return [...fixedPageSchemas(FIXED_PAGE_SCHEMAS, key), ...EVERY_PAGE];
};

/** Google's test for a live page (or for pasted code, without a page address). */
export const richResultsTestUrl = (pageUrl: string | null) =>
  pageUrl ? `https://search.google.com/test/rich-results?url=${encodeURIComponent(pageUrl)}` : "https://search.google.com/test/rich-results";
