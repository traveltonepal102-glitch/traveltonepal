
import { Icon } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { BookingRating } from "./BookingRating";
import { ExpertContact } from "./ExpertContact";
import { GroupPricing } from "./GroupPricing";

const CTA =
  "flex items-center justify-center gap-2 rounded-md text-center font-bold tracking-[0.06em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Booking terms, from the website design. */
const ASSURANCES = [
  { icon: "check_circle", text: "Free cancellation up to 30 days before you start", className: "text-whatsapp" },
  { icon: "lock", text: "Only 10% deposit secures permits and transport", className: "text-brand" },
] as const;

/** Right-hand booking card: price by group size, inquiry buttons and who to talk to. Sticky on desktop. */
export const BookingCard = async ({ trek }: { trek: TrekDetail }) => {
  const [{ contact }, { rating }] = await Promise.all([getSiteSettings(), getPublishedReviews()]);
  return (
    <aside id={TREK_SECTION_IDS.book} aria-label="Book this trek" className="scroll-mt-16 lg:sticky lg:top-16">
      <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-4.5 shadow-[0_12px_28px_rgba(15,23,42,0.12)] sm:p-6">
        {rating && <BookingRating rating={rating} />}

        <GroupPricing groupPrices={trek.groupPrices} />

        <div className="flex flex-col gap-2.5 pt-1">
          <a
            href={`#${TREK_SECTION_IDS.plan}`}
            className={`${CTA} min-h-13 bg-brand text-body-sm text-on-brand shadow-[0_4px_12px_rgba(0,91,159,0.28)] hover:bg-brand-hover`}
          >
            <Icon name="hiking" />
            Book this trek / Inquire now
          </a>
          <a
            href={trekInquiryUrl(trek)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${CTA} min-h-11.5 border border-green-line bg-green-tint text-xs text-whatsapp hover:bg-green-line/60`}
          >
            <WhatsAppLogo size={18} />
            WhatsApp direct ({contact.phoneDisplay})
          </a>
        </div>

        <ExpertContact />

        <ul className="flex flex-col gap-2 border-t border-line pt-3 text-xs font-medium text-text">
          {ASSURANCES.map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              <Icon name={item.icon} size={16} className={`flex-none ${item.className}`} />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
