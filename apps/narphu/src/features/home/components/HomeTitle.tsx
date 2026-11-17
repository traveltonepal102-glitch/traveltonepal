import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { ShareButton } from "./ShareButton";

const PILL = "inline-flex items-center gap-1.5 rounded-full border border-solid px-3 py-0.75 text-sm leading-5 font-semibold";
const QUIET_ACTION = "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border-0 bg-transparent px-3 font-[inherit] text-[15px] font-semibold text-maroon no-underline hover:bg-paper hover:text-maroon-deep";

type HomeTitleProps = { top: HomeTop; trek: HomeTrek | null; rating: HomeRating | null; hasReviews: boolean };

/**
 * The top's words (design: one column, everything on one side): the page's label and H1 from Pages › Home (or the
 * trek's Google card), where the trek is, the intro, then one row of actions: the itinerary, the printable map, sharing
 * and, after a rule, what Google says of the company.
 */
export const HomeTitle = ({ top, trek, rating, hasReviews }: HomeTitleProps) => (
  <div className="flex max-w-220 flex-col gap-4">
    <p className="flex flex-wrap gap-2">
      {top.eyebrow && (
        <span className={`${PILL} border-line bg-snow text-maroon-deep`}>
          <TrailIcon name="check" size={14} className="text-maroon" />
          {top.eyebrow}
        </span>
      )}
      {trek && <span className={`${PILL} border-saffron-line bg-saffron-tint text-saffron-ink`}>Private trek · Start any day</span>}
    </p>
    <h1 className="text-maroon">{top.heading}</h1>
    {trek?.place && (
      <p className="flex items-center gap-1.5 text-[15px] leading-5.5 text-muted">
        <TrailIcon name="pin" size={16} />
        {trek.place}
      </p>
    )}
    {top.intro && <p className="max-w-170 text-[19px] leading-7.5 text-ink">{top.intro}</p>}
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 pt-1.5">
      {top.secondLabel && trek && (
        <a href="#itinerary" className="mr-2 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-maroon px-4.5 text-[15px] font-semibold text-snow no-underline hover:bg-maroon-deep hover:text-snow">
          {top.secondLabel}
          <TrailIcon name="chevron" size={16} />
        </a>
      )}
      {trek?.pdfMapUrl && (
        <a href={trek.pdfMapUrl} target="_blank" rel="noopener noreferrer" type="application/pdf" className={QUIET_ACTION}>
          <TrailIcon name="doc" size={18} />
          Trip PDF
        </a>
      )}
      <ShareButton title={top.heading} className={QUIET_ACTION} />
      {rating && (
        <>
          <span aria-hidden="true" className="mx-2.5 h-7 w-px bg-field max-sm:hidden" />
          {/* What Google says, typed in the admin; a link to the reviews when the page shows them. */}
          <a href={hasReviews ? "#reviews" : undefined} className={`${QUIET_ACTION} gap-2.5 font-normal text-muted`}>
            <span aria-hidden="true" className="font-[Arial,sans-serif] text-lg font-bold text-google">
              G
            </span>
            <span role="img" aria-label={`${rating.rating.toFixed(1)} out of 5 stars`} className="flex text-saffron">
              {Array.from({ length: 5 }, (_, star) => (
                <TrailIcon key={star} name="star" size={15} className="fill-saffron" />
              ))}
            </span>
            <span>
              <strong className="font-semibold text-ink">{rating.rating.toFixed(1)}</strong> · {rating.count} Google reviews
            </span>
          </a>
        </>
      )}
    </div>
  </div>
);
