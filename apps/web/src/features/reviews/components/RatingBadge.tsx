import { Icon } from "@ttn/ui/icon";

import { GoogleLogo } from "@/components/ui/GoogleLogo";

const STAR_COUNT = 5;

export type RatingBadgeData = {
  /** Shown big, e.g. "4.9". */
  ratingLabel: string;
  /** Filled stars out of 5. */
  stars: number;
  /** e.g. "128 reviews on Google". */
  countLabel: string;
  /** Read by screen readers instead of the visual parts. */
  accessibleLabel: string;
  /** Review page on Google; the badge links there when set. */
  href?: string;
  /** A Google rating: the badge shows Google's "G" and star colour. */
  isGoogle?: boolean;
};

/** White badge with the overall rating, five stars and the review count. */
export const RatingBadge = ({ ratingLabel, stars, countLabel, accessibleLabel, href, isGoogle = false }: RatingBadgeData) => {
  const content = (
    <>
      {isGoogle && <GoogleLogo size={30} className="flex-none" />}
      <span aria-hidden="true" className="font-display text-h2 text-brand">
        {ratingLabel}
      </span>
      <span aria-hidden="true" className="flex flex-col leading-snug">
        <span className={`flex gap-px ${isGoogle ? "text-[#fbbc04]" : "text-saffron"}`}>
          {Array.from({ length: STAR_COUNT }, (_, index) => (
            <Icon key={index} name={index < stars ? "star-fill" : "star"} size={18} />
          ))}
        </span>
        <span className="text-caption font-semibold text-text">{countLabel}</span>
      </span>
      <span className="sr-only">{accessibleLabel}</span>
    </>
  );
  const classes = "inline-flex items-center gap-3.5 rounded-lg bg-surface px-4.5 py-3";

  if (!href) return <p className={classes}>{content}</p>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
    >
      {content}
    </a>
  );
};
