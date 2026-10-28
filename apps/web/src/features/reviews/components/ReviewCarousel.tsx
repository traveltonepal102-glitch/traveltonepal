import { CAROUSEL_ITEM, CardCarousel } from "@/components/shared/CardCarousel";

import type { Review } from "../types";
import { GoogleReviewCard } from "./GoogleReviewCard";

type ReviewCarouselProps = {
  reviews: readonly Review[];
  /** What the row holds, for screen readers, e.g. "Reviews from trekkers". */
  label: string;
};

/** Reviews in a sideways carousel (swipe on phones, arrows on wider screens), laid out like Google's. */
export const ReviewCarousel = ({ reviews, label }: ReviewCarouselProps) => (
  <CardCarousel label={label} count={reviews.length}>
    {reviews.map((review) => (
      <li key={review.id} className={CAROUSEL_ITEM}>
        <GoogleReviewCard review={review} />
      </li>
    ))}
  </CardCarousel>
);
