import { TrailIcon } from "@/components/ui/TrailIcon";
import { formatDecimal } from "@/lib/format";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { ShareButton } from "./ShareButton";

const PILL = "inline-flex min-h-9 items-center gap-2 rounded-full border border-solid border-white/25 bg-white/10 px-3.5 text-sm leading-5 font-semibold text-snow";
const QUIET_ACTION =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-solid border-white/35 bg-transparent px-4 font-[inherit] text-[15px] font-semibold text-snow no-underline hover:bg-white/10 hover:text-snow";

type HomeTitleProps = { top: HomeTop; trek: HomeTrek | null; rating: HomeRating | null; hasReviews: boolean };

/**
 * The hero's words (design: canvas "Everest Trek Website", Home top, white on the navy veil): the page's label and H1
 * from Pages › Home (or the trek's Google card) with the trek's subtitle under it, where the trek is, the intro, then one
 * row of actions: the itinerary, the printable map, sharing and what Google says of the company.
 */
export const HomeTitle = ({ top, trek, rating, hasReviews }: HomeTitleProps) => (
  <div className="flex max-w-190 flex-col gap-5">
    <p className="rise flex flex-wrap gap-2">
      {top.eyebrow && (
        <span className={PILL}>
          <TrailIcon name="check" size={14} className="text-glacier" />
          {top.eyebrow}
        </span>
      )}
      {trek && <span className={PILL}>Privat · Start an jedem Tag</span>}
    </p>
    <h1 id="top-title" className="rise rise-2 text-snow">
      {top.heading}
    </h1>
    {trek?.place && (
      <p className="rise rise-2 flex items-center gap-1.5 text-[15px] leading-5.5 text-on-ink-label">
        <TrailIcon name="pin" size={16} />
        {trek.place}
      </p>
    )}
    {top.intro && <p className="rise rise-3 max-w-160 text-lg leading-7.5 text-on-ocean-muted sm:text-xl sm:leading-8">{top.intro}</p>}
    <div className="rise rise-3 flex flex-wrap items-center gap-2.5 pt-1">
      {top.secondLabel && trek && (
        <a href="#itinerary" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-snow px-5 text-[15px] font-bold text-ink no-underline hover:bg-ice hover:text-ink">
          {top.secondLabel}
          <TrailIcon name="chevron" size={16} />
        </a>
      )}
      {trek?.pdfMapUrl && (
        <a href={trek.pdfMapUrl} target="_blank" rel="noopener noreferrer" type="application/pdf" className={QUIET_ACTION}>
          <TrailIcon name="doc" size={18} />
          Reise-PDF
        </a>
      )}
      <ShareButton title={top.heading} className={QUIET_ACTION} />
    </div>
    {rating && (
      // What Google says, typed in the admin; a link to the reviews when the page shows them.
      <a href={hasReviews ? "#reviews" : undefined} className="rise rise-3 inline-flex min-h-11 items-center gap-2.5 self-start text-[15px] text-on-ocean-muted no-underline hover:text-snow">
        <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-snow font-[Arial,sans-serif] text-base font-bold text-google">
          G
        </span>
        <span role="img" aria-label={`${formatDecimal(rating.rating)} von 5 Sternen`} className="flex text-glacier">
          {Array.from({ length: 5 }, (_, star) => (
            <TrailIcon key={star} name="star" size={15} className="fill-glacier" />
          ))}
        </span>
        <span>
          <strong className="font-semibold text-snow">{formatDecimal(rating.rating)}</strong> · {rating.count} Google-Bewertungen
        </span>
      </a>
    )}
  </div>
);
