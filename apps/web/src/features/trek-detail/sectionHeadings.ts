import { firstText } from "@/lib/rowText";
import type { WebTrekPageRow } from "@/lib/supabase/database.types";

import type { TrekSectionHeadings } from "./types";

type HeadingNames = {
  /** The trek's full name, e.g. "Langtang Valley Trek" ("Langtang Valley Trek route map"). */
  name: string;
  /** How people say it, e.g. "Langtang Trek" ("Langtang Trek packing list"). */
  shortName: string;
  /** The number of days in the plan, before the itinerary heading ("10-day day-by-day itinerary"). */
  days: number;
};

/** Each section's heading as written in the trek editor; a blank one uses the page's own words. */
export const toSectionHeadings = (page: WebTrekPageRow, { name, shortName, days }: HeadingNames): TrekSectionHeadings => ({
  intro: firstText(page.intro_heading) ?? "Introduction",
  overview: firstText(page.overview_heading) ?? "Trip overview and key specifications",
  suitability: firstText(page.suitability_heading) ?? "Is this trek for you?",
  regions: firstText(page.regions_heading) ?? "Regions on this route",
  itinerary: `${days}-day ${firstText(page.itinerary_heading) ?? "day-by-day itinerary"}`,
  guides: firstText(page.guides_heading) ?? "Meet your trek guide",
  inclusions: firstText(page.inclusions_heading) ?? "What’s covered · What’s not included",
  elevation: firstText(page.elevation_heading) ?? "Route and elevation profile",
  routeMap: firstText(page.route_map_heading) ?? `${name} route map`,
  pricing: firstText(page.pricing_heading) ?? "Group rates by team size",
  packing: firstText(page.packing_heading) ?? `${shortName} packing list`,
  faq: firstText(page.faq_heading) ?? `Frequently asked questions for the ${name}`,
  similar: firstText(page.similar_heading) ?? "Similar trekking options in Nepal",
});
