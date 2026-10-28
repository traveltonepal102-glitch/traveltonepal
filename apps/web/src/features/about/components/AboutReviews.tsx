import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { CompactReviewCard } from "@/features/reviews/components/CompactReviewCard";
import { GoogleReviewLinks } from "@/features/reviews/components/GoogleReviewLinks";
import { RatingBadge } from "@/features/reviews/components/RatingBadge";
import type { RatingBadgeData } from "@/features/reviews/components/RatingBadge";
import type { Review } from "@/features/reviews/types";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import { BAND, SECTION, WRAP } from "./styles";

type AboutReviewsProps = {
  reviews: readonly Review[];
  rating: RatingBadgeData | null;
  /** From Pages › About; "" uses the design's wording. */
  heading: string;
};

/** "What trekkers say about us": published reviews and the overall rating. The page leaves it out when there are none. */
export const AboutReviews = ({ reviews, rating, heading }: AboutReviewsProps) => (
  <section id={ABOUT_SECTION_IDS.reviews} aria-labelledby="about-reviews-title" className={`${SECTION} ${BAND}`}>
    <div className={`${WRAP} flex flex-col gap-5.5`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageSectionHeading id="about-reviews-title" eyebrow="Reviews" title={heading || "What trekkers say about us"} />
        {rating && (
          <div className="self-start rounded-lg border border-line sm:self-auto">
            <RatingBadge {...rating} />
          </div>
        )}
      </div>
      <ul className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <li key={review.id}>
            <CompactReviewCard review={review} />
          </li>
        ))}
      </ul>
      <GoogleReviewLinks />
    </div>
  </section>
);
