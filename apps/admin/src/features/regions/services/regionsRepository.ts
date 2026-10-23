import "server-only";
import { cache } from "react";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { EMPTY_RICH_TEXT, richTextDocSchema } from "@/lib/richText/richText";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { REGION_LOCALE } from "../constants";
import type { Region, RegionFormValues } from "../types";

type RegionRow = Database["public"]["Tables"]["regions"]["Row"];
type TextRow = Database["public"]["Tables"]["region_translations"]["Row"];
type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

/** Postgres error codes save_region can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";
const CHECK_VIOLATION = "23514";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const REGION_COLUMNS = `id, slug, district, website_domain, latitude, longitude, month_ratings, cover_photo_id, featured_trek_id,
  created_at, updated_at, updated_by,
  region_translations!inner(*),
  cover:photos!regions_cover_photo_id_fkey(${PHOTO_COLUMNS}),
  region_photos(position, photo:photos(${PHOTO_COLUMNS})),
  region_nearby_treks(position, trek_id, region_nearby_trek_translations(locale, label, note)),
  region_hidden_guides(guide_id),
  trekking_guide_regions(guide_id)` as const;

type PhotoFields = Pick<PhotoRow, "id" | "width" | "height" | "variant_widths" | "placeholder" | "place">;

type RegionQueryRow = RegionRow & {
  region_translations: TextRow[];
  cover: PhotoFields | null;
  region_photos: { position: number; photo: PhotoFields }[];
  region_nearby_treks: { position: number; trek_id: string; region_nearby_trek_translations: { locale: string; label: string; note: string }[] }[];
  region_hidden_guides: { guide_id: string }[];
  trekking_guide_regions: { guide_id: string }[];
};

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

const toRegion = (row: RegionQueryRow): Region => {
  const [text] = row.region_translations;
  return {
    id: row.id,
    websiteDomain: row.website_domain,
    leadingGuideIds: row.trekking_guide_regions.map((item) => item.guide_id),
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
    highestPoint: text.highest_point,
    trekLength: text.trek_length,
    difficulty: text.difficulty,
    gettingThere: text.getting_there,
    gettingThereDetails: text.getting_there_details,
    permits: text.permits,
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
    featuredTrekId: row.featured_trek_id,
    featuredTrekLabel: text.featured_trek_label,
    featuredTrekPitch: text.featured_trek_pitch,
    nearbyTreks: toNearbyTreks(row.region_nearby_treks),
    customRoutePitch: text.custom_route_pitch,
    hiddenGuideIds: row.region_hidden_guides.map((item) => item.guide_id),
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
  | { ok: false; reason: "slug_taken" | "photo_missing" | "featured_not_in_region" | "not_found" | "forbidden" | "failed" };

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
    },
    p_text: {
      name: values.name,
      pin_label: values.pinLabel,
      tagline: values.tagline,
      introduction: values.introduction,
      best_for: values.bestFor,
      highest_point: values.highestPoint,
      trek_length: values.trekLength,
      difficulty: values.difficulty,
      getting_there: values.gettingThere,
      getting_there_details: values.gettingThereDetails,
      permits: values.permits,
      season_spring: values.seasons.spring,
      season_monsoon: values.seasons.monsoon,
      season_autumn: values.seasons.autumn,
      season_winter: values.seasons.winter,
      faqs: values.faqs,
      seo_keyword: values.seoKeyword,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
      featured_trek_label: values.featuredTrekLabel,
      featured_trek_pitch: values.featuredTrekPitch,
      custom_route_pitch: values.customRoutePitch,
    },
    p_photos: { gallery: values.photos.galleryPhotoIds, details: values.photos.details },
  });

  if (!error) return { ok: true, regionId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "slug_taken" };
  if (error.code === CHECK_VIOLATION) return { ok: false, reason: "featured_not_in_region" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "photo_missing" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_region failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};
