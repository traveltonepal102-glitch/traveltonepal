/**
 * How the admin tells the website that saved content changed. The website caches its database reads under these
 * tags; after a save the admin POSTs the changed tags to the website's refresh route, signed with REVALIDATE_SECRET.
 */
export const WEBSITE_CACHE_TAGS = {
  regions: "regions",
  treks: "treks",
  travelGuides: "travel-guides",
  trekkingGuides: "trekking-guides",
  /** Site settings: contact details, company and licences, social links (shown on every page). */
  settings: "settings",
  /** Pages: About, Contact (with the About team, from Authors and Trekking guides). */
  pages: "pages",
  /** Reviews the admin chose to show, and the overall ratings (home, About and trek pages). */
  reviews: "reviews",
} as const;

export type WebsiteCacheTag = (typeof WEBSITE_CACHE_TAGS)[keyof typeof WEBSITE_CACHE_TAGS];

export const WEBSITE_CACHE_TAG_VALUES: readonly WebsiteCacheTag[] = Object.values(WEBSITE_CACHE_TAGS);

/** The website's route that refreshes tags: POST { tags: [...] } with "Authorization: Bearer <secret>". */
export const WEBSITE_REFRESH_PATH = "/api/revalidate";

/** Both apps reject a shorter secret (it is a shared password between two servers). */
export const REVALIDATE_SECRET_MIN_LENGTH = 32;
