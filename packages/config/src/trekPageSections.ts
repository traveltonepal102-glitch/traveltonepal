/**
 * The trek page's sections with a heading (H2), in the page's default order. Each trek can put them in its own
 * order (`treks.section_order`, edited in the admin's trek editor); the photo gallery always opens the page.
 */
export const TREK_PAGE_SECTIONS = [
  // Beside the booking card.
  "intro",
  "overview",
  "founder",
  "consultation",
  "highlights",
  "suitability",
  "itinerary",
  "guides",
  "inclusions",
  "elevation",
  "route_map",
  "why_book",
  "pricing",
  "credentials",
  "reviews",
  "differentiators",
  "booking_form",
  "packing",
  "field_guide",
  // Full width, after the booking card.
  "faq",
  "booking_cta",
  "similar",
  "newsletter",
] as const;

export type TrekPageSection = (typeof TREK_PAGE_SECTIONS)[number];

/** Sections as wide as the page, after the booking card: they move among themselves only. */
export const FULL_WIDTH_TREK_SECTIONS: readonly TrekPageSection[] = ["faq", "booking_cta", "similar", "newsletter"];

export const isFullWidthTrekSection = (section: TrekPageSection) => FULL_WIDTH_TREK_SECTIONS.includes(section);

const isTrekPageSection = (value: string): value is TrekPageSection => (TREK_PAGE_SECTIONS as readonly string[]).includes(value);

/**
 * A saved order made whole, in the order the page shows it: unknown and repeated keys are dropped, a section
 * missing from it (none saved yet, or one added to the page later) goes back after the section it follows by
 * default, and the full-width sections come after the others.
 */
export const orderTrekSections = (saved: readonly string[]): TrekPageSection[] => {
  const order = [...new Set(saved.filter(isTrekPageSection))];
  TREK_PAGE_SECTIONS.forEach((section, index) => {
    if (order.includes(section)) return;
    const before = TREK_PAGE_SECTIONS.slice(0, index).findLast((other) => order.includes(other));
    order.splice(before ? order.indexOf(before) + 1 : 0, 0, section);
  });
  return [...order.filter((section) => !isFullWidthTrekSection(section)), ...order.filter(isFullWidthTrekSection)];
};
