import { getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { ShareButton } from "./ShareButton";
import { formatDecimal } from "@/lib/format";

const SMALL_BUTTON = `${outlineButton} min-h-11 px-4 text-[15px]`;
const FLAGS = ["bg-azure", "bg-[#e6e9ef]", "bg-ember", "bg-whatsapp", "bg-sun"];

type HomeTitleProps = { top: HomeTop; trek: HomeTrek | null; rating: HomeRating | null; hasReviews: boolean };

/** Across the page: the page's label with the prayer flags, its H1 and intro from Pages › Home (a trek's Google card), then one row with what Google says of the company and where it is on the left and the buttons on the right. */
export const HomeTitle = ({ top, trek, rating, hasReviews }: HomeTitleProps) => (
  <div className="flex flex-col gap-3">
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
    <h1 className="text-[clamp(30px,1.8vw+22px,44px)] leading-[1.12]">{top.heading}</h1>
    {top.intro && <p className="max-w-none text-body text-muted">{top.intro}</p>}
    <div className="mt-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
      {(rating || trek?.place) && (
        <p className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-base leading-6 text-muted">
          {rating && (
            <span className="inline-flex items-center gap-1.5 font-bold text-ink">
              <TrailIcon name="star" size={16} className="fill-sun text-sun" />
              {formatDecimal(rating.rating)}
              {hasReviews ? (
                <a href="#reviews" className="font-medium text-muted">
                  ({rating.count} Google-Bewertungen)
                </a>
              ) : (
                <span className="font-medium text-muted">({rating.count} Google-Bewertungen)</span>
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
      {/* On a phone: the two main buttons full width, then "Trip PDF" and "Share" side by side. */}
      <div className="actions max-sm:w-full max-sm:grid-cols-2 sm:ml-auto">
        <a href={getWhatsAppUrl(`Hallo! Ich möchte den ${trek?.name ?? "Trek"} planen.`)} rel="nofollow" className={`${whatsAppButton} max-sm:col-span-2`}>
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
            Reise-PDF
          </a>
        )}
        <ShareButton title={top.heading} className={`${SMALL_BUTTON} ${trek?.pdfMapUrl ? "" : "max-sm:col-span-2"}`} />
      </div>
    </div>
  </div>
);
