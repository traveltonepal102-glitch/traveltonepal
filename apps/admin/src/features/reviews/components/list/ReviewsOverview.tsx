"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_REVIEW_PATH } from "../../constants";
import { NO_REVIEW_FILTERS, filterReviews, reviewTopic } from "../../lib/reviewFilters";
import type { Review, ReviewRating, ReviewTrekOption } from "../../types";
import { RatingsCard } from "./RatingsCard";
import { ReviewFilterBar } from "./ReviewFilterBar";
import { ReviewListCard } from "./ReviewListCard";

type ReviewsOverviewProps = {
  reviews: Review[];
  ratings: ReviewRating[];
  treks: ReviewTrekOption[];
  /** The review whose panel is open ("new" while adding). */
  openId: string | null;
  /** The edit drawer, when one is open (it shows over the list). */
  panel: ReactNode;
};

/** The Reviews screen: the overall rating, then every saved review with filters, and the edit drawer. */
export const ReviewsOverview = ({ reviews, ratings, treks, openId, panel }: ReviewsOverviewProps) => {
  const [filters, setFilters] = useState(NO_REVIEW_FILTERS);
  const shown = filterReviews(reviews, filters);
  const onWebsite = reviews.filter((review) => review.isShown).length;
  const countLabel = shown.length === reviews.length ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}` : `${shown.length} of ${reviews.length} reviews`;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="rate_review" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Reviews
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{onWebsite} on website</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">
            Real reviews from Google, copied word for word with the link to each one. Switch on the ones the website shows: the home page shows the newest six, the About page three, and a trek page the ones about that trek.
          </p>
        </div>
        <Link href={NEW_REVIEW_PATH} scroll={false} className={primaryButton}>
          <Icon name="add" />
          Add review
        </Link>
      </div>

      <RatingsCard ratings={ratings} />
      <ReviewFilterBar filters={filters} onChange={setFilters} treks={treks} countLabel={countLabel} />

      <ul className="m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
        {shown.map((review) => (
          <li key={review.id}>
            <ReviewListCard review={review} topic={reviewTopic(review, treks)} isOpen={review.id === openId} />
          </li>
        ))}
        {!shown.length && (
          <li className="rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground tablet:col-span-full">
            {reviews.length
              ? "No review matches these filters."
              : "No reviews yet. When a trekker reviews you on Google, add it here with “Add review” (on Google: Share review › Copy link)."}
          </li>
        )}
      </ul>
      {panel}
    </>
  );
};
