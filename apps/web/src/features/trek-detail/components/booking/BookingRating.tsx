import { Icon } from "@ttn/ui/icon";

import type { RatingSummary } from "@/features/reviews/types";

const STAR_COUNT = 5;

/** Stars, "4.9 / 5" and the review count, linking to the public review page. */
export const BookingRating = ({ rating }: { rating: RatingSummary }) => (
  <a
    // Without the profile in Site settings: the same text, not a link.
    href={rating.url || undefined}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between gap-2 border-b border-line pb-4 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="inline-flex text-saffron">
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <Icon key={index} name={index < Math.round(rating.rating) ? "star-fill" : "star"} />
        ))}
      </span>
      <span className="text-body-sm font-bold text-ink">
        {rating.rating.toFixed(1)} <span className="sr-only">out of</span>
        <span aria-hidden="true">/</span> 5
      </span>
    </span>
    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {rating.count} reviews on {rating.source}
    </span>
  </a>
);
