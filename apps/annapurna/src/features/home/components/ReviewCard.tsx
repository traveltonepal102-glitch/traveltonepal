import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeReview } from "../types";

const SITE_NAMES = { google: "Google", tripadvisor: "Tripadvisor" } as const;

/** One review from Google or Tripadvisor, word for word: five lines, then the link to the original. */
export const ReviewCard = ({ review }: { review: HomeReview }) => (
  <article className="flex h-full flex-col gap-3 rounded-[14px] border border-solid border-line bg-snow p-5.5 shadow-card">
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="relative inline-flex size-11 flex-none items-center justify-center overflow-hidden rounded-full bg-navy text-lg font-semibold text-snow">
        {review.photo ? <SiteImage image={review.photo} sizes="44px" className="object-cover" /> : review.name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{review.name}</span>
        <span className="block text-sm leading-5 text-muted">{review.when}</span>
      </span>
      {review.source === "google" ? (
        <span role="img" aria-label="Google" className="flex-none font-[Arial,sans-serif] text-xl font-bold text-[#4285f4]">
          G
        </span>
      ) : (
        <span className="flex-none text-sm font-semibold text-muted">{SITE_NAMES[review.source]}</span>
      )}
    </div>
    <p role="img" aria-label={`${review.rating} out of 5 stars`} className="flex gap-0.5 text-sun">
      {Array.from({ length: review.rating }, (_, star) => (
        <TrailIcon key={star} name="star" className="fill-sun" />
      ))}
    </p>
    <p className="line-clamp-5 text-base leading-6.25">{review.text}</p>
    <a href={review.url} rel="noopener noreferrer" className="mt-auto text-[15px] font-semibold">
      Read more on {SITE_NAMES[review.source]}
    </a>
  </article>
);
