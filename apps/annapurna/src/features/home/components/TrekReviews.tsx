import { SectionHeading } from "@/components/shared/SectionHeading";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

import type { HomeRating, HomeReview } from "../types";
import { ReviewCard } from "./ReviewCard";

type TrekReviewsProps = { reviews: readonly HomeReview[]; rating: HomeRating | null };

/** The website's reviews and the rating typed from Google. Hidden while there are none. */
export const TrekReviews = async ({ reviews, rating }: TrekReviewsProps) => {
  if (reviews.length === 0) return null;
  const { googleWriteUrl, googleProfileUrl } = await getSiteSettings();
  const isAllGoogle = reviews.every((review) => review.source === "google");

  return (
    <section aria-labelledby="reviews-h" id="reviews" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeading id="reviews-h" eyebrow={isAllGoogle ? "Google reviews" : "Reviews"} title="What trekkers say" />
        {rating && (
          <span className="inline-flex items-center gap-2.5 rounded-full border border-solid border-line px-4 py-2 font-semibold text-ink">
            <span className="font-[Arial,sans-serif] font-bold text-[#4285f4]">G</span>
            {rating.rating.toFixed(1)} · {rating.count} reviews
          </span>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <p className="text-[15px] leading-5.5 text-muted">
        Copied word for word from {isAllGoogle ? "our Google profile" : "the review sites"}.{" "}
        {googleProfileUrl && (
          <a href={googleProfileUrl} rel="noopener noreferrer" className="underline">
            See all on Google
          </a>
        )}
        {googleProfileUrl && " · "}
        {(googleWriteUrl || googleProfileUrl) && (
          <a href={ROUTES.review} rel="nofollow" className="underline">
            Write a review
          </a>
        )}
      </p>
    </section>
  );
};
