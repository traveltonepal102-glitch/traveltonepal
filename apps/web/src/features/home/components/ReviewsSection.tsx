import { Icon } from "@ttn/ui/icon";

import { GoogleReviewLinks } from "@/features/reviews/components/GoogleReviewLinks";
import { RatingBadge } from "@/features/reviews/components/RatingBadge";
import { ReviewCarousel } from "@/features/reviews/components/ReviewCarousel";
import { PREVIEW_COMPANY_REVIEWS, PREVIEW_RATING } from "@/features/reviews/previewReviews";
import { ratingBadgeFor } from "@/features/reviews/ratingBadge";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";
import { HOME_SECTION_IDS } from "@/lib/navigation";

const isDevelopment = process.env.NODE_ENV === "development";

/** The home page carousel shows the newest ones; all of them are on Google. */
const HOME_REVIEW_COUNT = 12;

/**
 * "Trekkers tell it best" (design: Main.dc.html): the reviews the admin chose, in a carousel laid out like Google's,
 * with the Google rating. Shows real reviews only: with none yet the section
 * is left out of production builds, and `pnpm dev` shows the design's placeholders to check the layout.
 */
export const ReviewsSection = async () => {
  const published = await getPublishedReviews();
  const realReviews = published.reviews.slice(0, HOME_REVIEW_COUNT);
  const isPreview = realReviews.length === 0 && isDevelopment;
  const reviews = isPreview ? PREVIEW_COMPANY_REVIEWS : realReviews;
  const rating = isPreview ? PREVIEW_RATING : published.rating && ratingBadgeFor(published.rating);

  if (reviews.length === 0) return null;

  return (
    <section id={HOME_SECTION_IDS.reviews} aria-labelledby="reviews-title" className="bg-brand-tint py-16 md:py-24">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4.5">
          <div className="flex flex-col gap-2.5">
            <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
              <Icon name="groups" size={18} />
              From the trail
            </p>
            <h2 id="reviews-title" className="text-h2 tracking-tight md:text-h1">
              Trekkers tell it best
            </h2>
          </div>
          {rating && <RatingBadge {...rating} />}
        </div>

        <ReviewCarousel reviews={reviews} label="Reviews from trekkers" />
        <GoogleReviewLinks />
      </div>
    </section>
  );
};
