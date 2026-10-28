import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveReview } from "@/features/reviews/actions/saveReview";
import { ReviewPanel } from "@/features/reviews/components/editor/ReviewPanel";
import { ReviewsOverview } from "@/features/reviews/components/list/ReviewsOverview";
import { EMPTY_REVIEW_VALUES } from "@/features/reviews/constants";
import { listReviewRatings, listReviewTrekOptions, listReviews } from "@/features/reviews/services/reviewsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.reviews.label };

/**
 * Reviews: real Google reviews copied word for word, and which ones the website shows. "?review=<id>" opens a
 * review's edit panel beside the list, "?review=new" an empty one; "&added=1" right after adding.
 */
const ReviewsPage = async ({ searchParams }: PageProps<"/reviews">) => {
  const admin = await requireAdmin();
  const [reviews, ratings, treks, { review: openParam, added }] = await Promise.all([listReviews(), listReviewRatings(), listReviewTrekOptions(), searchParams]);

  const openId = typeof openParam === "string" ? openParam : null;
  const open = reviews.find((review) => review.id === openId) ?? null;
  const isAdding = openId === "new";

  const panel = (open || isAdding) && (
    <ReviewPanel
      // A fresh form for each review (nothing typed for one review carries over to another).
      key={open?.id ?? "new"}
      action={saveReview.bind(null, open?.id ?? null)}
      review={open}
      values={open ?? EMPTY_REVIEW_VALUES}
      treks={treks}
      canRemove={admin.role === "super_admin"}
      isJustAdded={added === "1"}
    />
  );

  return <ReviewsOverview reviews={reviews} ratings={ratings} treks={treks} openId={open?.id ?? (isAdding ? "new" : null)} panel={panel || null} />;
};

export default ReviewsPage;
