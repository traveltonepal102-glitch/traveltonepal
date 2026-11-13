import { getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { ShareButton } from "./ShareButton";

const SMALL_BUTTON = "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-solid border-line bg-transparent px-4 text-[15px] font-semibold text-ink no-underline hover:bg-forest-tint";

type HomeTitleProps = { top: HomeTop; trek: HomeTrek | null; rating: HomeRating | null; hasReviews: boolean };

/** The page's H1 and intro from Pages › Home, what Google says of the company, where it is, and the buttons. */
export const HomeTitle = ({ top, trek, rating, hasReviews }: HomeTitleProps) => (
  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
    <div className="flex flex-[1_1_620px] flex-col gap-2.5">
      {top.eyebrow && (
        // A pill on one line; on a narrow phone it wraps into two even lines with soft corners, the tick beside the first.
        <span className="inline-flex items-start gap-2 self-start rounded-2xl bg-forest-tint px-3 py-1 text-sm leading-5 font-semibold text-balance text-forest-deep">
          <span className="flex h-5 flex-none items-center">
            <TrailIcon name="check" size={14} />
          </span>
          {top.eyebrow}
        </span>
      )}
      <h1>{top.heading}</h1>
      {(rating || trek?.place) && (
        <p className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-base leading-6 text-muted">
          {rating && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <TrailIcon name="star" size={16} className="fill-saffron text-saffron" />
              {rating.rating.toFixed(1)}
              {hasReviews ? (
                <a href="#reviews" className="font-semibold">
                  ({rating.count} Google reviews)
                </a>
              ) : (
                <span className="font-semibold">({rating.count} Google reviews)</span>
              )}
            </span>
          )}
          {trek?.place && (
            <span className="inline-flex items-center gap-1.5">
              <TrailIcon name="pin" size={16} />
              {trek.place}
            </span>
          )}
        </p>
      )}
      {top.intro && <p className="max-w-none text-[19px] leading-7.5">{top.intro}</p>}
    </div>
    {/* On a phone: the two main buttons full width, then "Trip PDF" and "Share" side by side. */}
    <div className="actions max-sm:w-full max-sm:grid-cols-2">
      <a href={getWhatsAppUrl(`Hello! I would like to plan the ${trek?.name ?? "trek"}.`)} rel="nofollow" className={`${whatsAppButton} max-sm:col-span-2`}>
        <WhatsAppLogo />
        {top.buttonLabel}
      </a>
      {top.secondLabel && trek && (
        <a href="#itinerary" className={`${outlineButton} max-sm:col-span-2`}>
          {top.secondLabel}
        </a>
      )}
      {trek?.pdfMapUrl && (
        <a href={trek.pdfMapUrl} className={SMALL_BUTTON}>
          <TrailIcon name="doc" />
          Trip PDF
        </a>
      )}
      <ShareButton title={top.heading} className={`${SMALL_BUTTON} ${trek?.pdfMapUrl ? "" : "max-sm:col-span-2"}`} />
    </div>
  </div>
);
