import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { TREK_LOCALE } from "@/features/treks/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Review, ReviewRating, ReviewTrekOption, ReviewValues } from "../types";

/** Postgres error codes the save can raise. */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

/** Every review, newest first. Throws when the database can't be read. */
export const listReviews = async (): Promise<Review[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(`*, photo:photos!reviews_photo_id_fkey(${PHOTO_COLUMNS})`)
    .order("reviewed_on", { ascending: false });
  if (error) throw new Error(`Could not load reviews: ${error.message}`);
  return data.map((row) => ({
    id: row.id,
    updatedAt: row.updated_at,
    source: row.source,
    url: row.url,
    reviewerName: row.reviewer_name,
    reviewerCountry: row.reviewer_country,
    rating: row.rating,
    title: row.title,
    quote: row.quote,
    reviewedOn: row.reviewed_on,
    trekId: row.trek_id,
    isShown: row.is_shown,
    photoId: row.photo_id,
    photo: row.photo ? toPhoto(row.photo) : null,
  }));
};

/** Treks a review can be about, A–Z (any status: a review of a hidden trek shows as a review of the company). */
export const listReviewTrekOptions = async (): Promise<ReviewTrekOption[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("treks").select("id, trek_translations!inner(name)").eq("trek_translations.locale", TREK_LOCALE);
  if (error) throw new Error(`Could not load treks: ${error.message}`);
  return data.map((trek) => ({ id: trek.id, name: trek.trek_translations[0]?.name ?? "" })).sort((a, b) => a.name.localeCompare(b.name));
};

export type SaveReviewResult =
  | { ok: true; reviewId: string }
  | { ok: false; reason: "duplicate_link" | "missing_link" | "not_found" | "forbidden" | "failed" };

/** Adds (reviewId null) or updates a review (save_review). */
export const saveReview = async (values: ReviewValues, reviewId: string | null): Promise<SaveReviewResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_review", {
    p_review_id: reviewId,
    p_review: {
      source: values.source,
      url: values.url,
      reviewer_name: values.reviewerName,
      reviewer_country: values.reviewerCountry,
      rating: values.rating,
      title: values.title,
      quote: values.quote,
      reviewed_on: values.reviewedOn,
      trek_id: values.trekId ?? "",
      is_shown: values.isShown,
      photo_id: values.photoId ?? "",
    },
  });
  if (!error) return { ok: true, reviewId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "duplicate_link" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_link" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`save_review failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/** Removes a review. False: no such review, or not allowed (RLS: Super admins only). */
export const removeReview = async (reviewId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("reviews").delete().eq("id", reviewId).select("id");
  if (error) throw new Error(`Could not remove review ${reviewId}: ${error.message}`);
  return data.length > 0;
};

/** The overall ratings that are set. Throws when the database can't be read. */
export const listReviewRatings = async (): Promise<ReviewRating[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("review_ratings").select("source, rating, review_count");
  if (error) throw new Error(`Could not load review ratings: ${error.message}`);
  return data.map((row) => ({ source: row.source, rating: Number(row.rating), reviewCount: row.review_count }));
};

/** Replaces the overall ratings (a site left out is no longer shown). False when the save failed. */
export const saveReviewRatings = async (ratings: ReviewRating[]): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_review_ratings", {
    p_ratings: ratings.map((item) => ({ source: item.source, rating: item.rating, review_count: item.reviewCount })),
  });
  if (error) console.error(`save_review_ratings failed: ${error.code} ${error.message}`);
  return !error;
};
