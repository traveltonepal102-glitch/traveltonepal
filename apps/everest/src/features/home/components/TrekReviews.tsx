import { SectionHeading } from "@/components/shared/SectionHeading";
import { quietButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { formatDecimal } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

import type { HomeRating, HomeReview } from "../types";
import { ReviewCard } from "./ReviewCard";

type TrekReviewsProps = { reviews: readonly HomeReview[]; rating: HomeRating | null };

/** The website's reviews (design: Reviews): the rating typed from Google on the left, the reviews word for word beside it. Hidden while there are none. */
export const TrekReviews = async ({ reviews, rating }: TrekReviewsProps) => {
  if (reviews.length === 0) return null;
  const { googleWriteUrl, googleProfileUrl } = await getSiteSettings();
  const isAllGoogle = reviews.every((review) => review.source === "google");

  return (
    <section aria-labelledby="reviews-h" id="reviews" className="flex flex-wrap gap-12">
      <div className="flex flex-[1_1_300px] flex-col gap-5">
        <SectionHeading id="reviews-h" eyebrow={isAllGoogle ? "Google-Bewertungen" : "Bewertungen"} title="Das sagen unsere Gäste" />
        {rating && (
          <p className="m-0 flex items-center gap-4">
            <strong className="text-[64px] leading-none font-semibold text-ink">{formatDecimal(rating.rating)}</strong>
            <span className="leading-6">
              <span role="img" aria-label={`${formatDecimal(rating.rating)} von 5 Sternen`} className="flex gap-0.5 text-glacier">
                {Array.from({ length: 5 }, (_, star) => (
                  <TrailIcon key={star} name="star" size={18} className="fill-glacier" />
                ))}
              </span>
              <span className="text-[15px] text-muted">
                {rating.count} Bewertungen bei <strong className="font-[Arial,sans-serif] text-google">Google</strong>
              </span>
            </span>
          </p>
        )}
        <p className="m-0 text-[15px] leading-6 text-muted">Wortgetreu übernommen {isAllGoogle ? "aus unserem Google-Profil" : "von den Bewertungsportalen"}.</p>
        <div className="actions">
          {googleProfileUrl && (
            <a href={googleProfileUrl} target="_blank" rel="noopener noreferrer" className={quietButton}>
              Alle bei Google ansehen
            </a>
          )}
          {(googleWriteUrl || googleProfileUrl) && (
            <a href={ROUTES.review} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex min-h-11 items-center px-2 text-[15px] font-semibold">
              Bewertung schreiben
            </a>
          )}
        </div>
      </div>
      <div className="grid min-w-0 flex-[2.4_1_640px] grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};
