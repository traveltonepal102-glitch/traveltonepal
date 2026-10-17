import { Icon } from "@ttn/ui/icon";

import { RatingBadge } from "@/features/reviews/components/RatingBadge";
import type { RatingBadgeData } from "@/features/reviews/components/RatingBadge";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import type { ReviewCardData } from "@/features/reviews/components/ReviewCard";
import { PREVIEW_RATING, PREVIEW_REVIEW_CARDS } from "@/features/reviews/previewReviews";
import { GOOGLE_RATING, REVIEWS } from "@/features/reviews/reviews";

const isDevelopment = process.env.NODE_ENV === "development";

const realCards: ReviewCardData[] = REVIEWS.map((review) => ({
  key: review.id,
  quote: review.quote,
  name: review.name,
  meta: `${review.country} · ${review.trekName}`,
  cite: review.url,
}));

const realRating: RatingBadgeData | null = GOOGLE_RATING && {
  ratingLabel: GOOGLE_RATING.rating.toFixed(1),
  stars: Math.round(GOOGLE_RATING.rating),
  countLabel: `${GOOGLE_RATING.count} reviews on ${GOOGLE_RATING.source}`,
  accessibleLabel: `Rated ${GOOGLE_RATING.rating.toFixed(1)} out of 5 from ${GOOGLE_RATING.count} reviews on ${GOOGLE_RATING.source}`,
  href: GOOGLE_RATING.url,
};

/**
 * "Trekkers tell it best" (design: Main.dc.html). Shows real reviews only: with none yet the section
 * is left out of production builds, and `pnpm dev` shows the design's placeholders to check the layout.
 */
export const ReviewsSection = () => {
  const isPreview = realCards.length === 0 && isDevelopment;
  const cards = isPreview ? PREVIEW_REVIEW_CARDS : realCards;
  const rating = isPreview ? PREVIEW_RATING : realRating;

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
      </div>
    </section>
  );
};
