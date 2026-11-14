import { getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { ShareButton } from "./ShareButton";

const SMALL_BUTTON = `${outlineButton} min-h-11 px-4 text-[15px]`;
const FLAGS = ["bg-azure", "bg-[#e6e9ef]", "bg-ember", "bg-whatsapp", "bg-sun"];

type HomeTitleProps = { top: HomeTop; trek: HomeTrek | null; rating: HomeRating | null; hasReviews: boolean };

/** Across the page, the buttons under the words on the right: the page's label with the prayer flags, its H1 and intro from Pages › Home (a trek's Google card), what Google says of the company, where it is, and the buttons. */
export const HomeTitle = ({ top, trek, rating, hasReviews }: HomeTitleProps) => (
  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
    <div className="flex w-full flex-col gap-3.5">
      {top.eyebrow && (
        <p className="eyebrow flex items-center gap-3 text-azure">
          <span aria-hidden="true" className="inline-flex gap-0.75">
            {FLAGS.map((flag) => (
              <span key={flag} className={`h-3 w-2 ${flag}`} />
            ))}
          </span>
          {top.eyebrow}
        </p>
      )}
      <h1>{top.heading}</h1>
      {(rating || trek?.place) && (
        <p className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-base leading-6 text-muted">
          {rating && (
            <span className="inline-flex items-center gap-1.5 font-bold text-ink">
              <TrailIcon name="star" size={16} className="fill-sun text-sun" />
              {rating.rating.toFixed(1)}
              {hasReviews ? (
                <a href="#reviews" className="font-medium text-muted">
                  ({rating.count} Google reviews)
                </a>
              ) : (
                <span className="font-medium text-muted">({rating.count} Google reviews)</span>
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
      {top.intro && <p className="max-w-none text-[19px] leading-7.5 text-muted">{top.intro}</p>}
    </div>
    {/* On a phone: the two main buttons full width, then "Trip PDF" and "Share" side by side. */}
    <div className="actions max-sm:w-full max-sm:grid-cols-2 sm:ml-auto">
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
