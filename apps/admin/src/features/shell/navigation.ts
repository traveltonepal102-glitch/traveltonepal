import type { IconName } from "@ttn/ui/icon";

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
  photos: {
    label: "Photos",
    href: "/photos",
    icon: "image",
    summary: "Every photo, in folders by where it is used. Upload, find and delete photos.",
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
  { title: "Growth", items: [ADMIN_SECTIONS.searchPerformance] },
];

/** The current screen's menu item: an exact match for the dashboard, otherwise the section and its sub-pages. */
export const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
