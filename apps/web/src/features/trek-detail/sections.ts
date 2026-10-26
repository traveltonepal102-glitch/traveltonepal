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
  /** Packing list and field guide. */
  usefulInfo: "useful-info",
  faq: "faq",
  /** Inquiry form. */
  plan: "plan",
  /** Booking card. */
  book: "book",
} as const;

/** Links in the sticky "On this page" bar, in page order. "Reviews" only when the page shows them. */
export const trekSectionLinks = ({ hasReviews }: { hasReviews: boolean }) => [
  { id: TREK_SECTION_IDS.itinerary, label: "Itinerary" },
  { id: TREK_SECTION_IDS.inclusions, label: "Inclusions" },
  { id: TREK_SECTION_IDS.routeMap, label: "Trip map" },
  { id: TREK_SECTION_IDS.pricing, label: "Dates" },
  { id: TREK_SECTION_IDS.usefulInfo, label: "Useful info" },
  ...(hasReviews ? [{ id: TREK_SECTION_IDS.reviews, label: "Reviews" }] : []),
  { id: TREK_SECTION_IDS.faq, label: "FAQ" },
];
