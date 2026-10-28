import { Icon } from "@ttn/ui/icon";

import type { Review } from "../types";

const STAR_COUNT = 5;

/** A published review as a small card: stars (when given), title, text, reviewer and where it was posted. */
export const CompactReviewCard = ({ review }: { review: Review }) => (
  <figure className="flex h-full flex-col justify-between gap-3 rounded-lg border border-line bg-surface p-4.5 shadow-card">
    <div className="flex flex-col gap-2">
      {review.rating && (
        <p className="inline-flex text-saffron">
          {Array.from({ length: STAR_COUNT }, (_, index) => (
            <Icon key={index} name={index < (review.rating ?? 0) ? "star-fill" : "star"} size={16} />
          ))}
          <span className="sr-only">Rated {review.rating} out of 5</span>
        </p>
      )}
      {review.title && <p className="font-display text-body-sm font-bold text-ink">“{review.title}”</p>}
      <blockquote cite={review.url} className="text-xs text-text">
        {review.quote}
      </blockquote>
    </div>
    <figcaption className="flex items-center gap-2.5 border-t border-muted pt-3">
      <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-full border-2 border-brand bg-brand-tint text-brand">
        <Icon name="person" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-xs font-bold text-ink">{review.name}</span>
        <span className="text-[11px] text-muted-foreground">
          {review.country && `${review.country} · `}
          <a href={review.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
            {review.source}
          </a>
        </span>
      </span>
    </figcaption>
  </figure>
);
