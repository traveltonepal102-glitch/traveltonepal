import { orderTrekSections } from "@ttn/config/trekPageSections";
import { toRichTextDoc } from "@ttn/ui/lib/richText";

import { similarTreks } from "@/features/treks/similar";
import type { TrekSummary } from "@/features/treks/types";
import { coverImage, sharePhotoImage } from "@/lib/images";
import type { MonthRating } from "@/features/regions/overviews";
import type { RegionCard } from "@/features/regions/regionRows";
import { firstText } from "@/lib/rowText";
import type { WebTrekGuideRow, WebTrekPageRow, WebTrekPhotoRow } from "@/lib/supabase/database.types";

import { ROUTE_SKETCHES } from "./content/routeSketches";
import { dayRegionSlugs, toRouteStops } from "./routeRegions";
import { customizationFor, differentiatorsFor } from "./content/sharedContent";
import { toTrekGuides } from "./trekGuideRows";
import type { TrekDayRow } from "./trekPageJson";
import {
  readDays,
  readFaqGroups,
  readGroupPrices,
  readKnowTopics,
  readPackingGroups,
  readPhotoBadges,
  readPoints,
} from "./trekPageJson";
import type { ItineraryDay, SharedSection, TrekDetail, TrekPhoto } from "./types";

/** Everything the trek page is made from, as read from the database (trekPageRepository). */
export type TrekPageSource = {
  /** This trek's card (name, region, days, difficulty, cover photo...). */
  summary: TrekSummary;
  page: WebTrekPageRow;
  photos: readonly WebTrekPhotoRow[];
  guides: readonly WebTrekGuideRow[];
  /** Every published trek, for "Explore more of the Himalaya". */
  treks: readonly TrekSummary[];
  /** Every region's card, for "Regions on this route" (a trek across several regions). */
  regions: readonly RegionCard[];
};

const SHARED_SECTIONS: readonly SharedSection[] = [
  "founder",
  "consultation",
  "customization",
  "meals",
  "why_book",
  "credentials",
  "reviews",
  "differentiators",
  "booking_form",
  "booking_cta",
  "newsletter",
];

const toGrade = (grade: number): TrekDetail["grade"] => Math.min(5, Math.max(1, Math.round(grade))) as TrekDetail["grade"];

/** The cover first (from the card), then the gallery in the admin's order. */
const toPhotos = (summary: TrekSummary, rows: readonly WebTrekPhotoRow[], photosBaseUrl: string): TrekPhoto[] => {
  const gallery = rows
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row): TrekPhoto[] => {
      const image = coverImage(row, photosBaseUrl, summary.name);
      return image ? [{ ...image, place: firstText(row.cover_place) }] : [];
    });
  return summary.image ? [summary.image, ...gallery] : gallery;
};

const toDay = (day: TrekDayRow, photosBaseUrl: string): ItineraryDay => ({
  place: day.place,
  title: day.title,
  subtitle: day.subtitle,
  duration: day.duration || undefined,
  altitudeM: day.altitude_m,
  sleepAltitudeM: day.sleep_altitude_m ?? undefined,
  isHighPoint: day.is_high_point,
  body: toRichTextDoc(day.description),
  photo: day.photo ? coverImage(day.photo, photosBaseUrl, day.place || day.title) : undefined,
});

const MONTH_RATINGS: readonly MonthRating[] = ["best", "possible", "avoid"];

/** The region's 12 month ratings, or null when they aren't all readable. */
const toMonthRatings = (ratings: readonly string[] | null): MonthRating[] | null => {
  const known = (ratings ?? []).filter((rating): rating is MonthRating => (MONTH_RATINGS as readonly string[]).includes(rating));
  return known.length === 12 ? known : null;
};

/**
 * Where trekking starts, for the elevation summary: the place named first in "Trek start" (e.g. "Syabrubesi,
 * Rasuwa") at that day's altitude, else the first day after arrival.
 */
const toTrailhead = (trekStart: string, days: readonly ItineraryDay[]): TrekDetail["trailhead"] => {
  const name = trekStart.split(",")[0]?.trim() ?? "";
  const day = days.find((item) => name && item.place.toLowerCase() === name.toLowerCase()) ?? days[1] ?? days[0];
  return { name: name || day?.place || "", altitudeM: day ? (day.sleepAltitudeM ?? day.altitudeM) : 0 };
};

/** The admin's picks that are published, in order; with none, the four treks most like this one. */
const toSimilarTreks = (summary: TrekSummary, slugs: readonly string[], treks: readonly TrekSummary[]) => {
  const picks = slugs.flatMap((slug) => treks.find((trek) => trek.slug === slug && slug !== summary.slug) ?? []);
  return picks.length ? picks : similarTreks(summary, 4, treks);
};

/** The trek page's content from its database rows. Blank texts fall back or are left out, never shown empty. */
export const toTrekDetail = ({ summary, page, photos, guides, treks, regions }: TrekPageSource, photosBaseUrl: string): TrekDetail => {
  const shortName = firstText(page.short_name) ?? summary.name;
  const dayRows = readDays(page.days);
  const daySlugs = dayRegionSlugs(dayRows.map((day) => day.region_slug), summary.route);
  const days = dayRows.map((day, index) => ({ ...toDay(day, photosBaseUrl), regionSlug: daySlugs[index] }));
  const sideTrip = firstText(page.optional_high_point);
  const { meal_budget_min_usd: low, meal_budget_max_usd: high } = page;

  return {
    ...summary,
    headline: firstText(page.headline) ?? summary.name,
    shortName,
    seo: {
      title: firstText(page.seo_title) ?? `${summary.name}: itinerary, cost and local guides`,
      description: firstText(page.seo_description, summary.summary) ?? "",
      shareImage: sharePhotoImage(page, photosBaseUrl, summary.name),
    },
    category: firstText(page.category) ?? (summary.tags.includes("classic") ? "Classic trek" : "Off the beaten path"),
    protectedArea: firstText(page.protected_area),
    currentSeason: page.current_season.trim(),
    daysNote: page.days_note.trim(),
    grade: toGrade(page.grade),
    highPoint: firstText(page.high_point) ?? days.find((day) => day.isHighPoint)?.place ?? "",
    optionalHighPoint: sideTrip && page.optional_high_point_m ? { name: sideTrip, altitudeM: page.optional_high_point_m } : undefined,
    intro: toRichTextDoc(page.introduction),
    photos: toPhotos(summary, photos, photosBaseUrl),
    photoBadges: readPhotoBadges(page.photo_badges),
    highlightsHeading: firstText(page.highlights_heading) ?? `${shortName} highlights`,
    highlights: readPoints(page.highlights),
    suitability: { intro: page.suitability_intro.trim(), points: readPoints(page.suitability_points) },
    itinerary: { intro: toRichTextDoc(page.itinerary_intro), days },
    routeStops: toRouteStops(summary.route, regions, daySlugs),
    routeSketch: ROUTE_SKETCHES[summary.slug],
    customization: customizationFor(shortName, sideTrip),
    guides: {
      intro: firstText(page.guides_intro) ?? `Licensed local guides who know ${summary.region}, trained in first aid and focused on your safety.`,
      team: toTrekGuides(guides, summary.region, photosBaseUrl),
    },
    inclusions: { included: readPoints(page.included), excluded: readPoints(page.excluded) },
    meals: {
      dailyBudgetUsd: low !== null && high !== null ? { min: low, max: high } : undefined,
      trailTips: readPoints(page.meal_trail_tips),
      teahouseNotes: readPoints(page.meal_teahouse_notes),
    },
    differentiators: differentiatorsFor(summary.region),
    trailhead: toTrailhead(page.trek_start, days),
    routeMap: { place: firstText(page.map_place) ?? `${summary.name}, Nepal`, myMapsId: page.my_maps_id ?? undefined },
    packing: { intro: page.packing_intro.trim(), groups: readPackingGroups(page.packing_groups) },
    fieldGuide: {
      heading: firstText(page.know_heading) ?? `${summary.name} guide: best season, facilities and safety`,
      topics: readKnowTopics(page.know_topics).map(({ photo, ...topic }) => ({
        ...topic,
        photo: photo ? coverImage(photo, photosBaseUrl, `${topic.title}, ${summary.name}`) : undefined,
      })),
    },
    faqs: readFaqGroups(page.faqs),
    startFinish: page.start_finish.trim(),
    distanceKm: page.distance_km ?? undefined,
    dailyWalking: page.daily_walking.trim(),
    guideRatio: page.guide_ratio.trim(),
    accommodation: page.accommodation.trim(),
    transport: page.transport.trim(),
    groupPrices: readGroupPrices(page.group_prices).map((price) => ({
      label: price.label,
      shortLabel: price.short_label,
      priceUsd: price.price_usd,
      team: price.team,
      isDefault: price.is_default,
    })),
    monthRatings: toMonthRatings(page.region_month_ratings),
    similarTreks: toSimilarTreks(summary, page.similar_slugs, treks),
    hiddenSections: SHARED_SECTIONS.filter((section) => page.hidden_shared_sections.includes(section)),
    sectionOrder: orderTrekSections(page.section_order ?? []),
  };
};
