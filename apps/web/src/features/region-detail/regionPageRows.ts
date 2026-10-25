import { formatBestMonths } from "@ttn/ui/lib/bestMonths";
import { toRichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { GuideSummary } from "@/features/guides/types";
import type { RegionCard } from "@/features/regions/regionRows";
import type { TrekSummary } from "@/features/treks/types";
import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebRegionGuideRow, WebRegionPageRow, WebRegionPhotoRow } from "@/lib/supabase/database.types";

import { toRegionGuides } from "./regionGuideRows";
import { readFaqs, readNearbyTreks, readWhyPoints } from "./regionPageJson";
import { regionsToCompare } from "./regionsToCompare";
import { toSeasonNotes } from "./seasons";
import type { RegionDetail, RegionPhoto, RegionTrekPick } from "./types";

/** "Why trek here" cards take these colours in turn. */
const POINT_TONES: readonly IconTone[] = ["brand", "saffron", "green", "navy"];

/** "Before you go" shows one row of travel guides. */
const MAX_ARTICLES = 3;

/** Everything the region page is made from, as read from the database (regionPageRepository). */
export type RegionPageSource = {
  /** This region's card (facts, map pin, months, cover photo). */
  card: RegionCard;
  page: WebRegionPageRow;
  photos: readonly WebRegionPhotoRow[];
  guides: readonly WebRegionGuideRow[];
  /** Every published trek, for the featured and nearby treks. */
  treks: readonly TrekSummary[];
  /** The main site's travel guide cards, for "Before you go". */
  travelGuides: readonly GuideSummary[];
  /** Every region's card, for "Compare with other regions". */
  regions: readonly RegionCard[];
};

const toPhotos = (rows: readonly WebRegionPhotoRow[], photosBaseUrl: string, regionName: string): RegionPhoto[] =>
  rows
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row) => {
      const image = coverImage(row, photosBaseUrl, `${regionName} region`);
      return image ? [{ ...image, place: firstText(row.cover_place) }] : [];
    });

/** The featured trek (if it is published) and the nearby ones, each once, in the admin's order. */
const toTrekPicks = ({ card, page, treks }: RegionPageSource) => {
  const trekOf = (slug: string) => treks.find((trek) => trek.slug === slug);
  const featured = page.featured_trek_slug ? trekOf(page.featured_trek_slug) : undefined;
  const featuredTrek: RegionTrekPick | undefined = featured && {
    trek: featured,
    label: firstText(page.featured_trek_label) ?? `Our signature ${card.name} trek`,
    note: firstText(page.featured_trek_pitch, featured.summary) ?? "",
  };
  const nearbyTreks = readNearbyTreks(page.nearby_treks).flatMap((item): RegionTrekPick[] => {
    const trek = trekOf(item.slug);
    if (!trek || trek.slug === featured?.slug) return [];
    return [{ trek, label: item.label || "Nearby trek", note: item.note || trek.summary }];
  });
  return { featuredTrek, nearbyTreks };
};

/** The region page's content from its database rows. Blank texts fall back or are left out, never shown empty. */
export const toRegionDetail = (source: RegionPageSource, photosBaseUrl: string): RegionDetail => {
  const { card, page } = source;
  const gettingThere = [
    { icon: "route", label: "From Kathmandu", value: firstText(page.from_kathmandu, card.access.long) },
    { icon: "flight_takeoff", label: "Nearest airport", value: firstText(page.nearest_airport) },
    { icon: "description", label: "Permits", value: firstText(page.permits_details, card.permits) },
    { icon: "hotel", label: "Where you sleep", value: firstText(page.where_you_sleep) },
  ] as const;

  return {
    ...card,
    seo: {
      title: firstText(page.seo_title) ?? `${card.name} trekking region: treks, best time and local guides`,
      description: firstText(page.seo_description, card.summary, card.tagline) ?? "",
    },
    heroHighlight: page.hero_highlight.trim(),
    bestMonthsLabel: formatBestMonths(card.months),
    overview: {
      heading: firstText(page.overview_heading) ?? `Trekking in ${card.name}`,
      introduction: toRichTextDoc(page.introduction),
      points: readWhyPoints(page.why_points).map((point, index) => ({ ...point, tone: POINT_TONES[index % POINT_TONES.length] })),
    },
    gettingThere: gettingThere.flatMap((line) => (line.value ? [{ ...line, value: line.value }] : [])),
    ...toTrekPicks(source),
    customRoutePitch:
      firstText(page.custom_route_pitch) ?? "Combine treks, a shorter version or a side trip. We plan it around your days.",
    seasons: toSeasonNotes(card.months, {
      spring: page.season_spring,
      monsoon: page.season_monsoon,
      autumn: page.season_autumn,
      winter: page.season_winter,
    }),
    guides: toRegionGuides(source.guides, photosBaseUrl),
    photos: toPhotos(source.photos, photosBaseUrl, card.name),
    articles: page.travel_guide_slugs
      .flatMap((slug) => source.travelGuides.find((guide) => guide.slug === slug) ?? [])
      .slice(0, MAX_ARTICLES),
    faqs: readFaqs(page.faqs),
    compareWith: regionsToCompare(card, page.compare_slugs, source.regions),
  };
};
