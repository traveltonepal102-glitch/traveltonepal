import { isFullWidthTrekSection } from "@ttn/config/trekPageSections";
import type { TrekPageSection } from "@ttn/config/trekPageSections";

/**
 * Anchors of the trek page's sections, shared by the "On this page" bar, the booking card links and
 * the sections themselves. Sections below the top of the page are still to be built.
 */
export const TREK_SECTION_IDS = {
  highlights: "highlights",
  /** "Regions on this route" (a trek across several regions). */
  regions: "regions",
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

/**
 * Sections taken off every trek page for now, whatever the trek's order; remove one here to bring it back.
 * "pricing" (decided 2026-10-31): the booking card already shows the group rates. With it go the start date
 * picker, the "Dates" link and the booking card's "Start: … Change" line, which only pointed there.
 */
export const HIDDEN_TREK_SECTIONS: readonly TrekPageSection[] = ["pricing"];

export const isTrekSectionHidden = (section: TrekPageSection) => HIDDEN_TREK_SECTIONS.includes(section);

/** Links in the sticky "On this page" bar, with the section each one jumps to. */
const SECTION_LINKS: { section: TrekPageSection; id: string; label: string }[] = [
  { section: "itinerary", id: TREK_SECTION_IDS.itinerary, label: "Itinerary" },
  { section: "inclusions", id: TREK_SECTION_IDS.inclusions, label: "Inclusions" },
  { section: "route_map", id: TREK_SECTION_IDS.routeMap, label: "Trip map" },
  { section: "pricing", id: TREK_SECTION_IDS.pricing, label: "Dates" },
  { section: "packing", id: TREK_SECTION_IDS.usefulInfo, label: "Useful info" },
  { section: "reviews", id: TREK_SECTION_IDS.reviews, label: "Reviews" },
  { section: "faq", id: TREK_SECTION_IDS.faq, label: "FAQ" },
];

type SectionLinksOptions = { hasReviews: boolean; order: readonly TrekPageSection[] };

/** The "On this page" links in the trek's order of sections. "Reviews" only when the page shows them. */
export const trekSectionLinks = ({ hasReviews, order }: SectionLinksOptions) =>
  SECTION_LINKS.filter((link) => (hasReviews || link.section !== "reviews") && !isTrekSectionHidden(link.section))
    .toSorted((a, b) => order.indexOf(a.section) - order.indexOf(b.section))
    .map(({ id, label }) => ({ id, label }));

/** Full-width sections that sit on one shared band (the others are bands themselves). */
const BAND_SECTIONS: readonly TrekPageSection[] = ["similar", "newsletter"];

export const isBandSection = (section: TrekPageSection) => BAND_SECTIONS.includes(section);

/**
 * The full-width sections at the end of the page, in order: similar treks and the newsletter share one band
 * when they are next to each other, as in the design.
 */
export const fullWidthGroups = (order: readonly TrekPageSection[]) =>
  order.filter(isFullWidthTrekSection).reduce<TrekPageSection[][]>((groups, section) => {
    const last = groups.at(-1);
    if (last && isBandSection(section) && isBandSection(last[0])) last.push(section);
    else groups.push([section]);
    return groups;
  }, []);
