import "server-only";
import { cache } from "react";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { EMPTY_RICH_TEXT, richTextDocSchema } from "@/lib/richText/richText";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { BADGE_ICON_VALUES, FAQ_ICON_VALUES, PACKING_ICON_VALUES, SHARED_SECTION_KEYS, TREK_LOCALE } from "../constants";
import type { Departure, GroupPrice, ItineraryDay, RegionOption, SimilarTrekOption, Trek, TrekFormValues } from "../types";

type TrekRow = Database["public"]["Tables"]["treks"]["Row"];
type TextRow = Database["public"]["Tables"]["trek_translations"]["Row"];
type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];
type DayRow = Database["public"]["Tables"]["trek_days"]["Row"];
type PriceRow = Database["public"]["Tables"]["trek_group_prices"]["Row"];
type PriceTextRow = Database["public"]["Tables"]["trek_group_price_translations"]["Row"];
type DepartureRow = Database["public"]["Tables"]["trek_departures"]["Row"];
type DepartureTextRow = Database["public"]["Tables"]["trek_departure_translations"]["Row"];
type DayTextRow = Database["public"]["Tables"]["trek_day_translations"]["Row"];
type PhotoFields = Pick<PhotoRow, "id" | "width" | "height" | "variant_widths" | "placeholder" | "place">;

/** Postgres error codes save_trek can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const TREK_COLUMNS = `*,
  trek_translations!inner(*),
  cover:photos!treks_cover_photo_id_fkey(${PHOTO_COLUMNS}),
  trek_photos(position, photo:photos(${PHOTO_COLUMNS})),
  trek_days(*, photo:photos(${PHOTO_COLUMNS}), trek_day_translations!inner(*)),
  trek_group_prices(*, trek_group_price_translations!inner(*)),
  trek_departures(*, trek_departure_translations!inner(*)),
  trek_similar!trek_similar_trek_id_fkey(position, similar_trek_id),
  trek_guides(position, guide_id)` as const;

type DayQueryRow = DayRow & { photo: PhotoFields | null; trek_day_translations: DayTextRow[] };

type TrekQueryRow = TrekRow & {
  trek_translations: TextRow[];
  cover: PhotoFields | null;
  trek_photos: { position: number; photo: PhotoFields }[];
  trek_days: DayQueryRow[];
  trek_group_prices: (PriceRow & { trek_group_price_translations: PriceTextRow[] })[];
  trek_departures: (DepartureRow & { trek_departure_translations: DepartureTextRow[] })[];
  trek_similar: { position: number; similar_trek_id: string }[];
  trek_guides: { position: number; guide_id: string }[];
};

const toGroupPrices = (rows: TrekQueryRow["trek_group_prices"]): GroupPrice[] =>
  [...rows]
    .sort((a, b) => a.position - b.position)
    .flatMap((row) => {
      const [text] = row.trek_group_price_translations;
      if (!text) return [];
      return [{ id: row.id, label: text.label, shortLabel: text.short_label, priceUsd: row.price_usd, team: text.team, isDefault: row.is_default }];
    });

const toDepartures = (rows: TrekQueryRow["trek_departures"]): Departure[] =>
  [...rows]
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .map((row) => ({
      id: row.id,
      startDate: row.start_date,
      isGuaranteed: row.is_guaranteed,
      note: row.trek_departure_translations[0]?.note ?? "",
    }));

/** Days in order, with their English text (a day without it is skipped). */
const toItinerary = (days: DayQueryRow[]): ItineraryDay[] =>
  [...days]
    .sort((a, b) => a.position - b.position)
    .flatMap((day) => {
      const [text] = day.trek_day_translations;
      if (!text) return [];
      return [
        {
          id: day.id,
          place: text.place,
          title: text.title,
          subtitle: text.subtitle,
          duration: text.duration,
          altitudeM: day.altitude_m,
          sleepAltitudeM: day.sleep_altitude_m,
          isHighPoint: day.is_high_point,
          description: text.description,
          photo: day.photo ? toPhoto(day.photo) : null,
        },
      ];
    });

/** Stored JSON is checked before use, like any outside data. */
const photoBadgesSchema = z
  .array(z.object({ label: z.string(), icon: z.enum(BADGE_ICON_VALUES), tone: z.enum(["brand", "green"]) }))
  .catch([]);
const pointSchema = z.object({ title: z.string(), text: z.string() });
const pointsSchema = z.array(pointSchema).catch([]);
const packingGroupsSchema = z.array(z.object({ title: z.string(), icon: z.enum(PACKING_ICON_VALUES), items: z.array(pointSchema) })).catch([]);
const faqsSchema = z
  .array(z.object({ title: z.string(), icon: z.enum(FAQ_ICON_VALUES), items: z.array(z.object({ question: z.string(), answer: z.string() })) }))
  .catch([]);
const sharedSectionsSchema = z.array(z.enum(SHARED_SECTION_KEYS)).catch([]);
const introductionSchema = richTextDocSchema.catch(EMPTY_RICH_TEXT);

const toTrek = (row: TrekQueryRow, regionNames: Map<string, string>): Trek => {
  const [text] = row.trek_translations;
  return {
    id: row.id,
    updatedAt: row.updated_at,
    regionName: regionNames.get(row.region_id) ?? "",
    priceFromUsd: row.price_from_usd,
    photos: {
      cover: row.cover ? toPhoto(row.cover) : null,
      gallery: [...row.trek_photos].sort((a, b) => a.position - b.position).map((item) => toPhoto(item.photo)),
    },
    name: text.name,
    slug: row.slug,
    regionId: row.region_id,
    status: row.status,
    difficulty: row.difficulty,
    grade: row.grade,
    days: row.days,
    maxAltitudeM: row.max_altitude_m,
    distanceKm: row.distance_km,
    seasons: row.seasons,
    tags: row.tags,
    isPopular: row.is_popular,
    summary: text.summary,
    cardBadge: text.card_badge,
    photoBadges: photoBadgesSchema.parse(text.photo_badges),
    startFinish: text.start_finish,
    dailyWalking: text.daily_walking,
    guideRatio: text.guide_ratio,
    seasonLabel: text.season_label,
    accommodation: text.accommodation,
    transport: text.transport,
    introduction: introductionSchema.parse(text.introduction),
    highlightsHeading: text.highlights_heading,
    highlights: pointsSchema.parse(text.highlights),
    suitabilityIntro: text.suitability_intro,
    suitabilityPoints: pointsSchema.parse(text.suitability_points),
    itineraryIntro: text.itinerary_intro,
    itinerary: toItinerary(row.trek_days),
    included: pointsSchema.parse(text.included),
    excluded: pointsSchema.parse(text.excluded),
    mealBudgetMinUsd: row.meal_budget_min_usd,
    mealBudgetMaxUsd: row.meal_budget_max_usd,
    mealTrailTips: pointsSchema.parse(text.meal_trail_tips),
    mealTeahouseNotes: pointsSchema.parse(text.meal_teahouse_notes),
    groupPrices: toGroupPrices(row.trek_group_prices),
    hasFixedDates: row.has_fixed_dates,
    departures: toDepartures(row.trek_departures),
    mapPlace: row.map_place,
    myMapsId: row.my_maps_id,
    packingIntro: text.packing_intro,
    packingGroups: packingGroupsSchema.parse(text.packing_groups),
    faqs: faqsSchema.parse(text.faqs),
    headline: text.headline,
    shortName: text.short_name,
    seoKeyword: text.seo_keyword,
    seoTitle: text.seo_title,
    seoDescription: text.seo_description,
    hiddenSharedSections: sharedSectionsSchema.parse(row.hidden_shared_sections),
    guidesIntro: text.guides_intro,
    guideIds: [...row.trek_guides].sort((a, b) => a.position - b.position).map((item) => item.guide_id),
    similarTrekIds: [...row.trek_similar].sort((a, b) => a.position - b.position).map((item) => item.similar_trek_id),
  };
};

/** The regions a trek can belong to, A–Z (English names). Once per request. */
export const listRegionOptions = cache(async (): Promise<RegionOption[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("regions")
    .select("id, region_translations!inner(name)")
    .eq("region_translations.locale", TREK_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);

  return data
    .map((region) => ({ id: region.id, name: region.region_translations[0]?.name ?? "" }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const regionNameMap = async () => new Map((await listRegionOptions()).map((region) => [region.id, region.name]));

/** Treks to pick as similar treks (every trek but `exceptId`), A–Z. Throws when the database can't be read. */
export const listSimilarTrekOptions = async (exceptId: string | null): Promise<SimilarTrekOption[]> => {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, regionNames] = await Promise.all([
    supabase
      .from("treks")
      .select(`id, days, difficulty, region_id, cover:photos!treks_cover_photo_id_fkey(${PHOTO_COLUMNS}), trek_translations!inner(name)`)
      .eq("trek_translations.locale", TREK_LOCALE),
    regionNameMap(),
  ]);
  if (error) throw new Error(`Could not load treks: ${error.message}`);

  return data
    .filter((trek) => trek.id !== exceptId)
    .map((trek) => ({
      id: trek.id,
      name: trek.trek_translations[0]?.name ?? "",
      days: trek.days,
      difficulty: trek.difficulty,
      regionName: regionNames.get(trek.region_id) ?? "",
      cover: trek.cover ? toPhoto(trek.cover) : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/** All treks with their English text, most recently edited first. Throws when the database can't be read. */
export const listTreks = async (): Promise<Trek[]> => {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, regionNames] = await Promise.all([
    supabase
      .from("treks")
      .select(TREK_COLUMNS)
      .eq("trek_translations.locale", TREK_LOCALE)
      .eq("trek_days.trek_day_translations.locale", TREK_LOCALE)
      .eq("trek_group_prices.trek_group_price_translations.locale", TREK_LOCALE)
      .eq("trek_departures.trek_departure_translations.locale", TREK_LOCALE)
      .order("updated_at", { ascending: false }),
    regionNameMap(),
  ]);
  if (error) throw new Error(`Could not load treks: ${error.message}`);
  return data.map((row) => toTrek(row, regionNames));
};

/** One trek, or null when there is none with this id. Throws when the database can't be read. Once per request. */
export const getTrek = cache(async (trekId: string): Promise<Trek | null> => {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, regionNames] = await Promise.all([
    supabase
      .from("treks")
      .select(TREK_COLUMNS)
      .eq("id", trekId)
      .eq("trek_translations.locale", TREK_LOCALE)
      .eq("trek_days.trek_day_translations.locale", TREK_LOCALE)
      .eq("trek_group_prices.trek_group_price_translations.locale", TREK_LOCALE)
      .eq("trek_departures.trek_departure_translations.locale", TREK_LOCALE)
      .maybeSingle(),
    regionNameMap(),
  ]);
  if (error) throw new Error(`Could not load trek ${trekId}: ${error.message}`);
  return data ? toTrek(data, regionNames) : null;
});

export type SaveTrekResult =
  | { ok: true; trekId: string }
  | { ok: false; reason: "slug_taken" | "missing_link" | "not_found" | "forbidden" | "failed" };

/** Adds (trekId null) or updates a trek, its English text and its photos in one transaction (save_trek). */
export const saveTrek = async (values: TrekFormValues, trekId: string | null): Promise<SaveTrekResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_trek", {
    p_trek_id: trekId,
    p_locale: TREK_LOCALE,
    p_trek: {
      slug: values.slug,
      region_id: values.regionId,
      status: values.status,
      difficulty: values.difficulty,
      grade: values.grade,
      days: values.days,
      max_altitude_m: values.maxAltitudeM,
      distance_km: values.distanceKm,
      seasons: values.seasons,
      tags: values.tags,
      is_popular: values.isPopular,
      cover_photo_id: values.photos.coverPhotoId,
      meal_budget_min_usd: values.mealBudgetMinUsd,
      meal_budget_max_usd: values.mealBudgetMaxUsd,
      has_fixed_dates: values.hasFixedDates,
      map_place: values.mapPlace,
      my_maps_id: values.myMapsId ?? "",
      similar_trek_ids: values.similarTrekIds,
      hidden_shared_sections: values.hiddenSharedSections,
      guide_ids: values.guideIds,
    },
    p_text: {
      name: values.name,
      summary: values.summary,
      card_badge: values.cardBadge,
      photo_badges: values.photoBadges,
      start_finish: values.startFinish,
      daily_walking: values.dailyWalking,
      guide_ratio: values.guideRatio,
      season_label: values.seasonLabel,
      accommodation: values.accommodation,
      transport: values.transport,
      introduction: values.introduction,
      highlights_heading: values.highlightsHeading,
      highlights: values.highlights,
      suitability_intro: values.suitabilityIntro,
      suitability_points: values.suitabilityPoints,
      itinerary_intro: values.itineraryIntro,
      included: values.included,
      excluded: values.excluded,
      meal_trail_tips: values.mealTrailTips,
      meal_teahouse_notes: values.mealTeahouseNotes,
      packing_intro: values.packingIntro,
      packing_groups: values.packingGroups,
      faqs: values.faqs,
      headline: values.headline,
      short_name: values.shortName,
      seo_keyword: values.seoKeyword,
      seo_title: values.seoTitle,
      seo_description: values.seoDescription,
      guides_intro: values.guidesIntro,
    },
    p_photos: { gallery: values.photos.galleryPhotoIds, details: values.photos.details },
    p_days: values.itinerary.map((day) => ({
      id: day.id ?? "",
      altitude_m: day.altitudeM,
      sleep_altitude_m: day.sleepAltitudeM,
      is_high_point: day.isHighPoint,
      photo_id: day.photoId ?? "",
      place: day.place,
      title: day.title,
      subtitle: day.subtitle,
      duration: day.duration,
      description: day.description,
    })),
    p_prices: values.groupPrices.map((price) => ({
      id: price.id ?? "",
      price_usd: price.priceUsd,
      is_default: price.isDefault,
      label: price.label,
      short_label: price.shortLabel,
      team: price.team,
    })),
    p_departures: values.departures.map((departure) => ({
      id: departure.id ?? "",
      start_date: departure.startDate,
      is_guaranteed: departure.isGuaranteed,
      note: departure.note,
    })),
  });

  if (!error) return { ok: true, trekId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "slug_taken" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_link" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_trek failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};
