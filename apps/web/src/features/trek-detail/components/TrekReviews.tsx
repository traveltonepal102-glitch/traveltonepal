import { GoogleLogo } from "@/components/ui/GoogleLogo";
import { GoogleReviewLinks } from "@/features/reviews/components/GoogleReviewLinks";
import { ReviewCarousel } from "@/features/reviews/components/ReviewCarousel";
import type { RatingSummary, Review } from "@/features/reviews/types";

import { TREK_SECTION_IDS } from "../sections";
import { SectionHeading } from "./SectionHeading";

type TrekReviewsProps = {
  reviews: readonly Review[];
  /** The company's overall rating; leave out when it is not known. */
  rating: RatingSummary | null;
};

/** "From real trekkers": published reviews of this trek. The page leaves it out when there are none. */
export const TrekReviews = ({ reviews, rating }: TrekReviewsProps) => (
  <section id={TREK_SECTION_IDS.reviews} aria-labelledby="trek-reviews-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <SectionHeading id="trek-reviews-title" eyebrow="From real trekkers" title="Trekker reviews" />
      {rating && (
        <a
          // Without the profile in Site settings: the same text, not a link.
          href={rating.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {rating.source === "Google" && <GoogleLogo size={18} />}
          <span className="rounded-sm bg-muted px-2 py-0.5 text-xs font-bold text-ink">
            {rating.rating.toFixed(1)} <span className="sr-only">out of</span>
            <span aria-hidden="true">/</span> 5.0
          </span>
          <span className="text-xs font-bold text-whatsapp">
            {rating.count} reviews on {rating.source}
          </span>
        </a>
      )}
    </div>
    <ReviewCarousel reviews={reviews} label="Reviews of this trek" />
    <GoogleReviewLinks />
  </section>
);
