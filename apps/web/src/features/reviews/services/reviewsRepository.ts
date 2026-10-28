import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toPublishedReviews } from "../reviewRows";
import type { PublishedReviews } from "../types";

/**
 * The reviews the admin chose to show and the overall rating (home, About and trek pages). Cached; refreshed when
 * reviews, the trek they are about or the review profile in Site settings change. Throws when the database can't
 * be read (a failed refresh keeps the last good page).
 */
export const getPublishedReviews = async (): Promise<PublishedReviews> => {
  "use cache";
  cacheTag(CACHE_TAGS.reviews, CACHE_TAGS.treks, CACHE_TAGS.settings);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createWebsiteClient();
  const [reviews, ratings] = await Promise.all([client.from("web_reviews").select("*"), client.from("web_review_ratings").select("*")]);
  if (reviews.error) throw new Error(`Could not load reviews: ${reviews.error.message}`);
  if (ratings.error) throw new Error(`Could not load review ratings: ${ratings.error.message}`);
  // "5 months ago" is worked out here, so it stays true for as long as the page is cached (an hour at most).
  return toPublishedReviews(reviews.data, ratings.data, photosPublicBaseUrl, new Date());
};
