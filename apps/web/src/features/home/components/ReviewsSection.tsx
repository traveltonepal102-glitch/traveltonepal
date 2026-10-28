import { Icon } from "@ttn/ui/icon";

import { GoogleReviewLinks } from "@/features/reviews/components/GoogleReviewLinks";
import { RatingBadge } from "@/features/reviews/components/RatingBadge";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import type { ReviewCardData } from "@/features/reviews/components/ReviewCard";
import { PREVIEW_RATING, PREVIEW_REVIEW_CARDS } from "@/features/reviews/previewReviews";
import { ratingBadgeFor } from "@/features/reviews/ratingBadge";
import { reviewMeta } from "@/features/reviews/reviewRows";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";

const isDevelopment = process.env.NODE_ENV === "development";

/** The home page shows the newest few; the rest are on the About and trek pages, and all of them on Google. */
const HOME_REVIEW_COUNT = 6;

/**
 * "Trekkers tell it best" (design: Main.dc.html). Shows the reviews the admin chose: with none yet the section
 * is left out of production builds, and `pnpm dev` shows the design's placeholders to check the layout.
 */
export const ReviewsSection = async () => {
  const published = await getPublishedReviews();
  const realCards: ReviewCardData[] = published.reviews.slice(0, HOME_REVIEW_COUNT).map((review) => ({
    key: review.id,
    quote: review.quote,
    name: review.name,
    meta: reviewMeta(review) || review.source,
    cite: review.url,
  }));
  const isPreview = realCards.length === 0 && isDevelopment;
  const cards = isPreview ? PREVIEW_REVIEW_CARDS : realCards;
  const rating = isPreview ? PREVIEW_RATING : published.rating && ratingBadgeFor(published.rating);

  if (cards.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="bg-brand-tint py-16 md:py-24">
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

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4.5">
          {cards.map(({ key, ...card }) => (
            <li key={key}>
              <ReviewCard {...card} />
            </li>
          ))}
        </ul>
        <GoogleReviewLinks />
      </div>
    </section>
  );
};
