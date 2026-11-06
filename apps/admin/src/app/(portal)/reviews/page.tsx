import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { removeReview } from "@/features/reviews/actions/removeReview";
import { saveReview } from "@/features/reviews/actions/saveReview";
import { saveReviewRatings } from "@/features/reviews/actions/saveReviewRatings";
import { ReviewPanel } from "@/features/reviews/components/editor/ReviewPanel";
import { ReviewsOverview } from "@/features/reviews/components/list/ReviewsOverview";
import { EMPTY_REVIEW_VALUES, SAVED_NOTICES } from "@/features/reviews/constants";
import { listReviewRatings, listReviewTrekOptions, listReviews } from "@/features/reviews/services/reviewsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

export const metadata: Metadata = { title: ADMIN_SECTIONS.reviews.label };

/**
 * Reviews of the website "Working on" shows: real Google reviews copied word for word, and which ones it shows. "?review=<id>" opens a
 * review's edit panel beside the list, "?review=new" an empty one; "?saved=…" says what the last save did.
 */
const ReviewsPage = async ({ searchParams }: PageProps<"/reviews">) => {
  const admin = await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [reviews, ratings, treks, { review: openParam, saved }] = await Promise.all([listReviews(site.id), listReviewRatings(site.id), listReviewTrekOptions(site.id), searchParams]);

  const openId = typeof openParam === "string" ? openParam : null;
  const open = reviews.find((review) => review.id === openId) ?? null;
  const isAdding = openId === "new";

  const panel = (open || isAdding) && (
    <ReviewPanel
      // A fresh form for each review (nothing typed for one review carries over to another).
      key={open?.id ?? "new"}
      action={saveReview.bind(null, site.id, open?.id ?? null)}
      review={open}
      values={open ?? EMPTY_REVIEW_VALUES}
      treks={treks}
      removeAction={open && admin.role === "super_admin" ? removeReview.bind(null, site.id, open.id) : null}
    />
  );

  const savedNotice = Object.entries(SAVED_NOTICES).find(([notice]) => notice === saved)?.[1] ?? null;

  return (
    <ReviewsOverview
      reviews={reviews}
      ratings={ratings}
      saveRatingsAction={saveReviewRatings.bind(null, site.id)}
      treks={treks}
      openId={open?.id ?? (isAdding ? "new" : null)}
      panel={panel || null}
      savedNotice={panel ? null : savedNotice}
    />
  );
};

export default ReviewsPage;
