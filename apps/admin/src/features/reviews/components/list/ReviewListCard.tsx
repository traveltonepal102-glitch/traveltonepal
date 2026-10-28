import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { formatCalendarDate } from "@/utils/formatDateTime";

import { REVIEW_SOURCES, reviewPath } from "../../constants";
import type { Review } from "../../types";
import { ReviewStars } from "../ReviewStars";

type ReviewListCardProps = {
  review: Review;
  /** The trek's name, or "About the company". */
  topic: string;
  isOpen: boolean;
};

/** One review in the list: stars, text, who wrote it, and whether the website shows it. Opens the edit panel. */
export const ReviewListCard = ({ review, topic, isOpen }: ReviewListCardProps) => (
  <Link
    href={reviewPath(review.id)}
    scroll={false}
    aria-current={isOpen ? "true" : undefined}
    className={cn(
      "flex h-full flex-col gap-2.5 rounded-lg border border-solid bg-surface p-4 text-text no-underline hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      isOpen ? "border-brand ring-3 ring-brand/15" : "border-border",
      !review.isShown && "bg-page",
    )}
  >
    <span className="flex items-center justify-between gap-2">
      <ReviewStars rating={review.rating} />
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
          review.isShown ? "bg-green-tint text-whatsapp" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon name={review.isShown ? "visibility" : "visibility_off"} size={14} />
        {review.isShown ? "On website" : "Hidden"}
      </span>
    </span>
    {review.title && <span className="font-bold text-ink">“{review.title}”</span>}
    <span className="line-clamp-4 text-caption">{review.quote}</span>

    <span className="mt-auto flex flex-col gap-0.5 border-t border-solid border-border pt-2.5 text-xs">
      <span className="font-bold text-ink">
        {review.reviewerName}
        {review.reviewerCountry && <span className="font-normal text-muted-foreground"> · {review.reviewerCountry}</span>}
      </span>
      <span className="text-muted-foreground">
        {topic} · {REVIEW_SOURCES.find((source) => source.value === review.source)?.label} · {formatCalendarDate(review.reviewedOn)}
      </span>
    </span>
  </Link>
);
