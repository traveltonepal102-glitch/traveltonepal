import type { IconName } from "@ttn/ui/icon";

import type { SiteKind } from "@/lib/supabase/database.types";

export type AdminSection = {
  label: string;
  href: string;
  icon: IconName;
  /** One line under the page heading: what the screen is for. */
  summary: string;
};

/** Every admin screen. The sidebar, the "New" menu and the pages all read from here. */
export const ADMIN_SECTIONS = {
  dashboard: {
    label: "Dashboard",
    href: "/",
    icon: "dashboard",
    summary: "An overview of your sites: visits, enquiries and what changed lately.",
  },
  treks: { label: "Treks", href: "/treks", icon: "hiking", summary: "Add and edit treks: itinerary, prices, photos and SEO." },
  regions: { label: "Regions", href: "/regions", icon: "map", summary: "Region pages: facts, best months, photos and FAQs." },
  travelGuides: { label: "Travel guides", href: "/travel-guides", icon: "article", summary: "Write and publish travel guides." },
  pages: { label: "Pages", href: "/pages", icon: "description", summary: "Fixed pages such as About us, Contact and Privacy." },
  adventures: {
    label: "Adventures",
    href: "/adventures",
    icon: "travel_explore",
    summary: "Experiences beyond trekking, shown in a carousel on the home page.",
  },
  trekkingGuides: {
    label: "Trekking guides",
    href: "/trekking-guides",
    icon: "hiking",
    summary: "The guides who lead the treks. Add them once, pick them from a list anywhere.",
  },
  authors: { label: "Authors", href: "/authors", icon: "person", summary: "The people who write the travel guides." },
  reviews: { label: "Reviews", href: "/reviews", icon: "rate_review", summary: "Traveller reviews shown on treks and regions." },
  searchPerformance: {
    label: "Search performance",
    href: "/search-performance",
    icon: "monitoring",
    summary: "How your sites do on Google: clicks, searches and positions.",
  },
  structuredData: {
    label: "Structured data",
    href: "/structured-data",
    icon: "code_blocks",
    summary: "Your own schema.org JSON-LD for any page, added to what the website writes by itself.",
  },
  photos: {
    label: "Photos and videos",
    href: "/photos",
    icon: "photo_library",
    summary: "Every photo and YouTube video, in folders by where it is used. Upload photos, add video links, find and delete them.",
  },
  sites: {
    label: "Sites",
    href: "/sites",
    icon: "public",
    summary: "Every website: the main site and the region sites, each with its own address. Super admins add region sites.",
  },
  settings: {
    label: "Site settings",
    href: "/settings",
    icon: "settings",
    summary: "Contact details, company details and licences, and social links, used on every page."
  },
} satisfies Record<string, AdminSection>;

export type NavGroup = {
  /** Shown above the group in the full menu; the first group has none. */
  title?: string;
  items: AdminSection[];
};

export const NAV_GROUPS: NavGroup[] = [
  { items: [ADMIN_SECTIONS.dashboard] },
  {
    title: "Content",
    items: [
      ADMIN_SECTIONS.treks,
      ADMIN_SECTIONS.regions,
      ADMIN_SECTIONS.travelGuides,
      ADMIN_SECTIONS.pages,
      ADMIN_SECTIONS.adventures,
      ADMIN_SECTIONS.photos,
    ],
  },
  { title: "People", items: [ADMIN_SECTIONS.trekkingGuides, ADMIN_SECTIONS.authors, ADMIN_SECTIONS.reviews] },
  { title: "Growth", items: [ADMIN_SECTIONS.searchPerformance, ADMIN_SECTIONS.structuredData] },
  { title: "All websites", items: [ADMIN_SECTIONS.sites] },
];

/** The current screen's menu item: an exact match for the dashboard, otherwise the section and its sub-pages. */
export const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * A region site's menu (decided 2026-11-02): only what belongs to that website, plus Sites. Site settings sit at the
 * bottom of the sidebar for every site. Regions, adventures, people and growth belong to the main site.
 */
export const REGION_NAV_GROUPS: NavGroup[] = [
  {
    title: "This website",
    items: [ADMIN_SECTIONS.pages, ADMIN_SECTIONS.treks, ADMIN_SECTIONS.travelGuides, ADMIN_SECTIONS.photos, ADMIN_SECTIONS.reviews],
  },
  { title: "All websites", items: [ADMIN_SECTIONS.sites] },
];

/** The menu for the site "Working on" shows: everything for the main site, the region menu for a region site. */
export const navGroupsFor = (siteKind: SiteKind): NavGroup[] => (siteKind === "main" ? NAV_GROUPS : REGION_NAV_GROUPS);

/** Where a region site's admin opens when the screen you were on isn't in its menu. */
export const REGION_SITE_START = ADMIN_SECTIONS.treks.href;

/** Whether this screen is in the site's menu (or is Site settings, at the bottom of every sidebar). */
export const isInSiteMenu = (pathname: string, siteKind: SiteKind) =>
  [...navGroupsFor(siteKind).flatMap((group) => group.items), ADMIN_SECTIONS.settings].some((section) => isActivePath(pathname, section.href));
