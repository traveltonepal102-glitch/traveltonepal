import type { Review, ReviewTrekOption } from "../types";

/** "" = all; "company" = reviews about the company (no trek); otherwise a trek id. */
export type ReviewFilters = { query: string; visibility: "" | "shown" | "hidden"; trek: string };

export const NO_REVIEW_FILTERS: ReviewFilters = { query: "", visibility: "", trek: "" };

export const COMPANY_FILTER = "company";

/** Reviews matching the search (name, text or title) and filters, in the list's order (newest first). */
export const filterReviews = (reviews: readonly Review[], filters: ReviewFilters): Review[] => {
  const query = filters.query.trim().toLowerCase();
  return reviews.filter((review) => {
    if (filters.visibility === "shown" && !review.isShown) return false;
    if (filters.visibility === "hidden" && review.isShown) return false;
    if (filters.trek === COMPANY_FILTER && review.trekId) return false;
    if (filters.trek && filters.trek !== COMPANY_FILTER && review.trekId !== filters.trek) return false;
    return !query || [review.reviewerName, review.quote, review.title].some((value) => value.toLowerCase().includes(query));
  });
};

/** What a review is about, for the list: the trek's name, or "About the company". */
export const reviewTopic = (review: Pick<Review, "trekId">, treks: readonly ReviewTrekOption[]) =>
  review.trekId ? (treks.find((trek) => trek.id === review.trekId)?.name ?? "A removed trek") : "About the company";
