/**
 * Anchors of the trek page's sections, shared by the "On this page" bar, the booking card links and
 * the sections themselves. Sections below the top of the page are still to be built.
 */
export const TREK_SECTION_IDS = {
  highlights: "highlights",
  itinerary: "itinerary",
  guides: "guides",
  inclusions: "inclusions",
  elevation: "elevation",
  routeMap: "route-map",
  why: "why",
  pricing: "pricing",
  credentials: "credentials",
  reviews: "reviews",
  faq: "faq",
  /** Inquiry form. */
  plan: "plan",
  /** Booking card. */
  book: "book",
} as const;

/** Links in the sticky "On this page" bar, in page order. "Credentials" and "Reviews" only when the page shows them. */
export const trekSectionLinks = (days: number, { hasReviews, hasCredentials }: { hasReviews: boolean; hasCredentials: boolean }) => [
  { id: TREK_SECTION_IDS.highlights, label: "Highlights" },
  { id: TREK_SECTION_IDS.itinerary, label: `${days}-day itinerary` },
  { id: TREK_SECTION_IDS.inclusions, label: "Inclusions" },
  { id: TREK_SECTION_IDS.elevation, label: "Elevation and route" },
  { id: TREK_SECTION_IDS.pricing, label: "Cost and tiers" },
  ...(hasCredentials ? [{ id: TREK_SECTION_IDS.credentials, label: "Credentials" }] : []),
  ...(hasReviews ? [{ id: TREK_SECTION_IDS.reviews, label: "Reviews" }] : []),
  { id: TREK_SECTION_IDS.faq, label: "FAQ" },
];
