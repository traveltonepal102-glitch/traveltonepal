import "server-only";
import { cache } from "react";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import type { PhotoColumnsRow } from "@/features/photos/services/photosRepository";
import { EMPTY_RICH_TEXT, richTextDocSchema } from "@/lib/richText/richText";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { REGION_LOCALE, WHY_POINT_ICON_VALUES } from "../constants";
import type { Region, RegionFormValues, RegionUsageItem } from "../types";

type RegionRow = Database["public"]["Tables"]["regions"]["Row"];
type TextRow = Database["public"]["Tables"]["region_translations"]["Row"];

/** Postgres error codes save_region and delete_region can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";
const CHECK_VIOLATION = "23514";
/** save_region's hint when a pinned travel guide isn't about the region (any more). */
const PINNED_NOT_IN_REGION = "pinned_article_not_in_region";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const REGION_COLUMNS = `id, slug, district, website_domain, latitude, longitude, month_ratings, cover_photo_id, featured_trek_id,
  max_altitude_m, difficulty, is_flight, created_at, updated_at, updated_by,
  region_translations!inner(*, share:photos!region_translations_share_photo_id_fkey(${PHOTO_COLUMNS})),
  cover:photos!regions_cover_photo_id_fkey(${PHOTO_COLUMNS}),
  region_photos(position, photo:photos(${PHOTO_COLUMNS})),
  region_nearby_treks(position, trek_id, region_nearby_trek_translations(locale, label, note)),
  region_hidden_guides(guide_id),
  trekking_guide_regions(guide_id),
  region_compare!region_compare_region_id_fkey(position, other_region_id),
  article_regions(article_id, pin_position)` as const;


type RegionQueryRow = RegionRow & {
  region_translations: (TextRow & { share: PhotoColumnsRow | null })[];
  cover: PhotoColumnsRow | null;
  region_photos: { position: number; photo: PhotoColumnsRow }[];
  region_nearby_treks: { position: number; trek_id: string; region_nearby_trek_translations: { locale: string; label: string; note: string }[] }[];
  region_hidden_guides: { guide_id: string }[];
  trekking_guide_regions: { guide_id: string }[];
  region_compare: { position: number; other_region_id: string }[];
  article_regions: { article_id: string; pin_position: number | null }[];
};

/** The pinned travel guides, in their pinned order. */
const toPinnedArticleIds = (rows: RegionQueryRow["article_regions"]) =>
  rows
    .flatMap(({ article_id, pin_position }) => (pin_position === null ? [] : [{ id: article_id, position: pin_position }]))
    .sort((a, b) => a.position - b.position)
    .map((pin) => pin.id);

/** Nearby treks in order, with their English label and note. */
const toNearbyTreks = (rows: RegionQueryRow["region_nearby_treks"]) =>
  [...rows]
    .sort((a, b) => a.position - b.position)
    .map((row) => {
      const text = row.region_nearby_trek_translations.find((item) => item.locale === REGION_LOCALE);
      return { trekId: row.trek_id, label: text?.label ?? "", note: text?.note ?? "" };
    });

/** Stored JSON is checked before use, like any outside data. */
const introductionSchema = richTextDocSchema.catch(EMPTY_RICH_TEXT);
const faqsSchema = z.array(z.object({ question: z.string(), answer: richTextDocSchema })).catch([]);
const whyPointsSchema = z.array(z.object({ icon: z.enum(WHY_POINT_ICON_VALUES), title: z.string(), text: z.string() })).catch([]);

const toRegion = (row: RegionQueryRow): Region => {
  const [text] = row.region_translations;
  return {
    id: row.id,
    websiteDomain: row.website_domain,
    leadingGuideIds: row.trekking_guide_regions.map((item) => item.guide_id),
    articleIds: row.article_regions.map((item) => item.article_id),
    updatedAt: row.updated_at,
    photos: {
      cover: row.cover ? toPhoto(row.cover) : null,
      gallery: [...row.region_photos].sort((a, b) => a.position - b.position).map((item) => toPhoto(item.photo)),
    },
    slug: row.slug,
    district: row.district,
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    monthRatings: row.month_ratings,
    name: text.name,
    pinLabel: text.pin_label,
    tagline: text.tagline,
    introduction: introductionSchema.parse(text.introduction),
    bestFor: text.best_for,
    shortName: text.short_name,
    summary: text.summary,
    heroHighlight: text.hero_highlight,
    overviewHeading: text.overview_heading,
    whyPoints: whyPointsSchema.parse(text.why_points),
    maxAltitudeM: row.max_altitude_m,
    trekLength: text.trek_length,
    difficulty: row.difficulty,
    gettingThere: text.getting_there,
    isFlight: row.is_flight,
    gettingThereDetails: text.getting_there_details,
    permits: text.permits,
    fromKathmandu: text.from_kathmandu,
    nearestAirport: text.nearest_airport,
    permitsDetails: text.permits_details,
    whereYouSleep: text.where_you_sleep,
    seasons: {
      spring: text.season_spring,
      monsoon: text.season_monsoon,
      autumn: text.season_autumn,
      winter: text.season_winter,
    },
    faqs: faqsSchema.parse(text.faqs),
    seoKeyword: text.seo_keyword,
    seoTitle: text.seo_title,
    seoDescription: text.seo_description,
    sharePhoto: text.share ? toPhoto(text.share) : null,
    canonicalPath: text.canonical_path,
    hideFromGoogle: text.hide_from_google,
    featuredTrekId: row.featured_trek_id,
    featuredTrekLabel: text.featured_trek_label,
    featuredTrekPitch: text.featured_trek_pitch,
    nearbyTreks: toNearbyTreks(row.region_nearby_treks),
    customRoutePitch: text.custom_route_pitch,
    hiddenGuideIds: row.region_hidden_guides.map((item) => item.guide_id),
    compareRegionIds: [...row.region_compare].sort((a, b) => a.position - b.position).map((item) => item.other_region_id),
    pinnedArticleIds: toPinnedArticleIds(row.article_regions),
  };
};

/** All regions with their English text, A–Z. Throws when the database can't be read. */
export const listRegions = async (): Promise<Region[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_COLUMNS)
    .eq("region_translations.locale", REGION_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);

  return data.map(toRegion).sort((a, b) => a.name.localeCompare(b.name));
};

/** One region, or null when there is none with this id. Throws when the database can't be read. Once per request. */
export const getRegion = cache(async (regionId: string): Promise<Region | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_COLUMNS)
    .eq("id", regionId)
    .eq("region_translations.locale", REGION_LOCALE)
    .maybeSingle();
  if (error) throw new Error(`Could not load region ${regionId}: ${error.message}`);

  return data ? toRegion(data) : null;
});

export type SaveRegionResult =
  | { ok: true; regionId: string }
  | { ok: false; reason: "slug_taken" | "photo_missing" | "featured_not_in_region" | "pinned_article_not_in_region" | "not_found" | "forbidden" | "failed" };

/**
 * Adds (regionId null) or updates a region, its English text and its photos in one transaction (save_region).
 * Row Level Security decides who may: any admin edits, only a Super admin adds.
 */
export const saveRegion = async (values: RegionFormValues, regionId: string | null): Promise<SaveRegionResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_region", {
    p_region_id: regionId,
    p_locale: REGION_LOCALE,
    p_region: {
      slug: values.slug,
      district: values.district,
      latitude: values.latitude,
      longitude: values.longitude,
      month_ratings: values.monthRatings,
      cover_photo_id: values.photos.coverPhotoId,
      featured_trek_id: values.featuredTrekId ?? "",
      nearby_treks: values.nearbyTreks.map((trek) => ({ trek_id: trek.trekId, label: trek.label, note: trek.note })),
      hidden_guide_ids: values.hiddenGuideIds,
      max_altitude_m: values.maxAltitudeM,
      difficulty: values.difficulty ?? "",
      is_flight: values.isFlight,
      compare_region_ids: values.compareRegionIds,
      pinned_article_ids: values.pinnedArticleIds,
    },
    p_text: {
      name: values.name,
      pin_label: values.pinLabel,
      tagline: values.tagline,
      introduction: values.introduction,
      best_for: values.bestFor,
      trek_length: values.trekLength,
      getting_there: values.gettingThere,
      getting_there_details: values.gettingThereDetails,
      permits: values.permits,
      short_name: values.shortName,
      summary: values.summary,
      hero_highlight: values.heroHighlight,
      overview_heading: values.overviewHeading,
      why_points: values.whyPoints,
      from_kathmandu: values.fromKathmandu,
      nearest_airport: values.nearestAirport,
      permits_details: values.permitsDetails,
      where_you_sleep: values.whereYouSleep,
      season_spring: values.seasons.spring,
      season_monsoon: values.seasons.monsoon,
      season_autumn: values.seasons.autumn,
      season_winter: values.seasons.winter,
      faqs: values.faqs,
      seo_keyword: values.seoKeyword,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
      share_photo_id: values.sharePhotoId ?? "",
      canonical_path: values.canonicalPath,
      hide_from_google: values.hideFromGoogle,
      featured_trek_label: values.featuredTrekLabel,
      featured_trek_pitch: values.featuredTrekPitch,
      custom_route_pitch: values.customRoutePitch,
    },
    p_photos: { gallery: values.photos.galleryPhotoIds, details: values.photos.details },
  });

  if (!error) return { ok: true, regionId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "slug_taken" };
  // save_region names which check failed in the hint (both are check violations).
  if (error.code === CHECK_VIOLATION) return { ok: false, reason: error.hint === PINNED_NOT_IN_REGION ? PINNED_NOT_IN_REGION : "featured_not_in_region" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "photo_missing" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_region failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/** What still uses a region (treks, travel guides, trekking guides, regions comparing with it), by kind and name. */
export const getRegionUsage = async (regionId: string): Promise<RegionUsageItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("region_usage", { p_region_id: regionId, p_locale: REGION_LOCALE });
  if (error) throw new Error(`Could not check what uses region ${regionId}: ${error.message}`);
  return data;
};

/**
 * Deletes a region once nothing uses it (delete_region, one transaction). "in_use": something still does;
 * "not_found": no such region; "forbidden": not a Super admin (RLS).
 */
export const deleteRegion = async (regionId: string): Promise<"deleted" | "in_use" | "not_found" | "forbidden"> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("delete_region", { p_region_id: regionId });
  if (!error) return "deleted";
  if (error.code === FOREIGN_KEY_VIOLATION) return "in_use";
  if (error.code === NOT_FOUND) return "not_found";
  if (error.code === RLS_VIOLATION) return "forbidden";
  throw new Error(`Could not delete region ${regionId}: ${error.code} ${error.message}`);
};
