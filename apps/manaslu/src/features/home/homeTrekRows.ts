import { coverImage } from "@ttn/site-data/images";
import type { SiteImageSource } from "@ttn/site-data/images";
import type { WebTrekGuideRow, WebTrekPageRow, WebTrekPhotoRow, WebTrekRow } from "@ttn/site-data/database.types";
import { firstText } from "@ttn/site-data/rowText";
import { readDays, readFaqGroups, readGroupPrices, readPackingGroups, readPoints } from "@ttn/site-data/trekPageJson";
import { orderTrekSections } from "@ttn/config/trekPageSections";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import { isRichTextEmpty, toRichTextDoc } from "@ttn/ui/lib/richText";

import { formatAltitude, formatDays } from "@/lib/format";

import { toHomeFieldGuide, toHomeGuideTeam, toHomeMeals, toHomeRouteMap } from "./homeTrekExtras";
import type { HomeFact, HomeSectionKey, HomeTrek, HomeTrekCard } from "./types";

const DIFFICULTY: Record<WebTrekRow["difficulty"], string> = { easy: "Easy", moderate: "Moderate", challenging: "Challenging", strenuous: "Strenuous" };

const MONTH_RATINGS: readonly string[] = ["best", "possible", "avoid"];

const isMonthRating = (rating: string): rating is MonthRating => MONTH_RATINGS.includes(rating);

/** The 12 month ratings, or null when they aren't all readable. */
const toMonthRatings = (ratings: readonly string[] | null) => {
  const known = (ratings ?? []).filter(isMonthRating);
  return known.length === 12 ? known : null;
};

export const toTrekCard = (row: WebTrekRow, photosBaseUrl: string): HomeTrekCard => ({
  slug: row.slug,
  name: row.name,
  summary: row.summary.trim(),
  region: row.region_name,
  days: row.days,
  difficulty: DIFFICULTY[row.difficulty],
  maxAltitudeM: row.max_altitude_m,
  season: row.season_label.trim(),
  priceFromUsd: row.price_from_usd,
  image: coverImage(row, photosBaseUrl, row.name),
  hasPage: row.has_page,
});

/** The cover first, then the gallery in the admin's order. */
const toPhotos = (summary: WebTrekRow, rows: readonly WebTrekPhotoRow[], photosBaseUrl: string) => {
  const cover = coverImage(summary, photosBaseUrl, summary.name);
  const gallery = rows
    .filter((row) => row.cover_id !== summary.cover_id)
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row) => coverImage(row, photosBaseUrl, summary.name) ?? []);
  return [...(cover ? [cover] : []), ...gallery] satisfies SiteImageSource[];
};

/** Only the facts the admin filled in. */
const toFacts = (summary: WebTrekRow, page: WebTrekPageRow): HomeFact[] => {
  const facts: { icon: HomeFact["icon"]; label: string; value: string | null | undefined }[] = [
    { icon: "calendar", label: "Duration", value: summary.days ? formatDays(summary.days) : "" },
    { icon: "trend", label: "Difficulty", value: DIFFICULTY[summary.difficulty] },
    { icon: "mountain", label: "Highest point", value: summary.max_altitude_m ? formatAltitude(summary.max_altitude_m) : "" },
    { icon: "route", label: "Start and finish", value: page.start_finish },
    { icon: "trend", label: "Total distance", value: page.distance_km ? `${page.distance_km} km` : "" },
    { icon: "clock", label: "Walking each day", value: page.daily_walking },
    { icon: "bed", label: "Stay", value: page.accommodation },
    { icon: "map", label: "Transport", value: page.transport },
    { icon: "users", label: "Guide to trekkers", value: page.guide_ratio },
    { icon: "sun", label: "Best season", value: summary.season_label },
  ];
  return facts.flatMap(({ icon, label, value }) => (value?.trim() ? [{ icon, label, value: value.trim() }] : []));
};

/** The trek editor's order, kept to the sections this design has, that have something to show and the trek doesn't hide. */
const toSections = (page: WebTrekPageRow, trek: Omit<HomeTrek, "sections">): HomeSectionKey[] => {
  const shows = (section: string) => !page.hidden_shared_sections.includes(section);
  const hasContent: Partial<Record<string, boolean>> = {
    intro: !isRichTextEmpty(trek.intro.body),
    founder: shows("founder"),
    consultation: shows("consultation"),
    highlights: trek.highlights.points.length > 0,
    suitability: trek.suitability.points.length > 0,
    itinerary: trek.itinerary.days.length > 0,
    guides: trek.guides.team.length > 0,
    inclusions: trek.inclusions.included.length + trek.inclusions.excluded.length > 0,
    route_map: trek.routeMap !== null,
    why_book: shows("why_book"),
    pricing: trek.pricing.prices.length > 0 || trek.months !== null,
    credentials: shows("credentials"),
    reviews: shows("reviews"),
    booking_form: shows("booking_form"),
    packing: trek.packing.groups.length > 0,
    field_guide: trek.fieldGuide.topics.length > 0,
    faq: trek.faq.items.length > 0,
    booking_cta: shows("booking_cta"),
  };
  return orderTrekSections(page.section_order ?? []).flatMap((section) => (hasContent[section] ? [section as HomeSectionKey] : []));
};

export type HomeTrekSource = { summary: WebTrekRow; page: WebTrekPageRow; photos: readonly WebTrekPhotoRow[]; guides: readonly WebTrekGuideRow[] };

/** The main trek from its database rows. Blank texts fall back to this design's words, or their section is left out. */
export const toHomeTrek = ({ summary, page, photos, guides }: HomeTrekSource, photosBaseUrl: string, trekFilesBaseUrl: string): HomeTrek => {
  const shortName = firstText(page.short_name) ?? summary.name;
  const ratings = toMonthRatings(page.region_month_ratings);
  const days = readDays(page.days).map((day, index) => ({
    number: index + 1,
    title: day.title,
    subtitle: day.subtitle,
    duration: day.duration || undefined,
    altitudeM: day.altitude_m,
    isHighPoint: day.is_high_point,
    body: toRichTextDoc(day.description),
  }));
  // The database only takes pdf-maps/<uuid>.pdf, so the path is safe to add to the address.
  const pdfMapUrl = page.pdf_map_path ? `${trekFilesBaseUrl}/${page.pdf_map_path}` : undefined;
  const prices = readGroupPrices(page.group_prices).map((price) => ({ label: price.label, shortLabel: price.short_label, priceUsd: price.price_usd, team: price.team, isDefault: price.is_default }));

  const trek: Omit<HomeTrek, "sections"> = {
    slug: summary.slug,
    name: summary.name,
    shortName,
    days: summary.days ?? days.length,
    difficulty: DIFFICULTY[summary.difficulty],
    priceFromUsd: prices.length ? Math.min(...prices.map((price) => price.priceUsd)) : summary.price_from_usd,
    place: firstText(page.protected_area, summary.region_name) ?? "",
    photos: toPhotos(summary, photos, photosBaseUrl),
    facts: toFacts(summary, page),
    pdfMapUrl,
    intro: { heading: firstText(page.intro_heading, page.overview_heading) ?? `About the ${shortName}`, body: toRichTextDoc(page.introduction) },
    highlights: { heading: firstText(page.highlights_heading) ?? "What you’ll remember", points: readPoints(page.highlights) },
    suitability: { heading: firstText(page.suitability_heading) ?? `Is the ${shortName} for you?`, intro: page.suitability_intro.trim(), points: readPoints(page.suitability_points) },
    itinerary: { heading: `${days.length}-day ${firstText(page.itinerary_heading) ?? "day-by-day itinerary"}`, intro: toRichTextDoc(page.itinerary_intro), days, showsCustomization: !page.hidden_shared_sections.includes("customization") },
    pricing: { heading: firstText(page.pricing_heading) ?? "Prices for your group", intro: page.pricing_intro.trim(), prices },
    guides: { heading: firstText(page.guides_heading) ?? "Meet your trek guide", intro: page.guides_intro.trim(), team: toHomeGuideTeam(guides, summary.region_name, photosBaseUrl) },
    inclusions: { heading: firstText(page.inclusions_heading) ?? "What’s included", included: readPoints(page.included), excluded: readPoints(page.excluded) },
    meals: page.hidden_shared_sections.includes("meals") ? null : toHomeMeals(page),
    routeMap: toHomeRouteMap(page, pdfMapUrl, shortName),
    months: ratings && { heading: `Best months for the ${shortName}`, ratings },
    packing: { heading: firstText(page.packing_heading) ?? "Packing list", intro: page.packing_intro.trim(), groups: readPackingGroups(page.packing_groups).map(({ title, items }) => ({ title, items })) },
    fieldGuide: toHomeFieldGuide(page, summary.name, photosBaseUrl),
    faq: {
      heading: firstText(page.faq_heading) ?? `Questions about the ${shortName}`,
      items: readFaqGroups(page.faqs).flatMap((group) => group.items.map(({ question, body, answer }) => ({ question, body, answer }))),
    },
  };
  return { ...trek, sections: toSections(page, trek) };
};
