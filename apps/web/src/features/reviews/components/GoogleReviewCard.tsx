import { Icon } from "@ttn/ui/icon";

import { GoogleLogo } from "@/components/ui/GoogleLogo";

import { reviewMeta } from "../reviewRows";
import type { Review } from "../types";
import { ReadReviewLink } from "./ReadReviewLink";
import { ReviewerAvatar } from "./ReviewerAvatar";

const STAR_COUNT = 5;

/** Google's own star yellow, so the card reads as a Google review. */
const GOOGLE_STAR = "text-[#fbbc04]";

/**
 * One review laid out the way Google shows it: the reviewer (photo or initial) with the review site's mark, the
 * stars and how long ago, then the text (five lines at most) and "Read more" on the review site.
 */
export const GoogleReviewCard = ({ review }: { review: Review }) => {
  const meta = reviewMeta(review);

  return (
    <figure className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-5 shadow-card">
      <figcaption className="flex items-center gap-3">
        <ReviewerAvatar name={review.name} photo={review.photo} className="size-10 text-body-sm" sizePx={40} />
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-bold text-ink">{review.name}</span>
          {meta && <span className="truncate text-caption text-muted-foreground">{meta}</span>}
        </span>
        {review.source === "Google" ? (
          <GoogleLogo size={22} className="flex-none" />
        ) : (
          <span className="flex-none text-caption font-bold text-muted-foreground">{review.source}</span>
        )}
        <span className="sr-only">Review on {review.source}</span>
      </figcaption>

      <p className="m-0 flex items-center gap-2">
        {review.rating && (
          <span className={`inline-flex ${GOOGLE_STAR}`}>
            {Array.from({ length: STAR_COUNT }, (_, index) => (
              <Icon key={index} name={index < (review.rating ?? 0) ? "star-fill" : "star"} size={18} />
            ))}
            <span className="sr-only">Rated {review.rating} out of 5,</span>
          </span>
        )}
        <span className="text-caption text-muted-foreground">{review.age}</span>
      </p>

      {review.title && <p className="m-0 font-bold text-ink">“{review.title}”</p>}
      <blockquote cite={review.url} className="m-0 line-clamp-5 text-body-sm text-text">
        {review.quote}
      </blockquote>
      <div className="mt-auto">
        <ReadReviewLink url={review.url} source={review.source} reviewer={review.name} />
      </div>
    </figure>
  );
};
