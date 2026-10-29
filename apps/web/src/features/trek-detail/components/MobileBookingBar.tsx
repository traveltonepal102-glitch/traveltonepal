import { formatUsd } from "@/features/treks/format";
import { trekInquiryEmailUrl, trekInquiryUrl } from "@/features/treks/inquiry";
import { Icon } from "@ttn/ui/icon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { TrekDetail } from "../types";

/** Phones: the booking card is far down the page, so the price, WhatsApp and email stay pinned to the bottom. */
export const MobileBookingBar = ({ trek }: { trek: TrekDetail }) => (
  <div className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-surface px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] md:hidden">
    {trek.priceFromUsd ? (
      <p className="flex flex-col leading-tight">
        <span className="text-[11px] text-muted-foreground">From</span>
        <span className="font-display text-[22px] font-extrabold text-brand">{formatUsd(trek.priceFromUsd)}</span>
      </p>
    ) : (
      <p className="text-caption font-semibold text-ink">Price on request</p>
    )}
    <div className="flex items-center gap-2">
      <a
        href={trekInquiryEmailUrl(trek)}
        aria-label={`Email us about the ${trek.name}`}
        className="inline-flex size-11.5 items-center justify-center rounded-md border border-line-strong bg-surface text-brand hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Icon name="mail" size={20} />
      </a>
      <a
        href={trekInquiryUrl(trek)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11.5 items-center gap-2 rounded-md bg-whatsapp px-4.5 text-caption font-extrabold tracking-wide text-white uppercase hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <WhatsAppLogo size={18} />
        Book on WhatsApp
      </a>
    </div>
  </div>
);
