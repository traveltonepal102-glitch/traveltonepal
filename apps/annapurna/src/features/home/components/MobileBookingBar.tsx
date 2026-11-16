"use client";

import { getWhatsAppUrl } from "@ttn/config/contact";

import { ctaButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatPrice } from "@/lib/format";

import { buildBookingMessage } from "../bookingMessage";
import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

type MobileBookingBarProps = { trekName: string; days: number };

/** A phone's bar at the bottom of the screen: the price per person for the group chosen, WhatsApp, and the way to the booking card. */
export const MobileBookingBar = ({ trekName, days }: MobileBookingBarProps) => {
  const { prices, chosenIndex, travellers, startDate } = useBooking();
  const chosen = prices[chosenIndex];
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <section aria-label="Ihre Buchung" className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-solid border-line bg-snow px-(--gutter) py-2.5 shadow-[0_-8px_24px_-12px_rgba(21,35,63,0.3)] lg:hidden">
      <span className="flex flex-col text-eyebrow text-muted">
        {chosen ? `ab · ${travellersText(travellers)}` : "Privattrek"}
        {chosen && <strong className="font-display text-[20px] leading-6 font-bold text-ink">{formatPrice(chosen.price, chosen.currency)}</strong>}
      </span>
      <span className="flex gap-2">
        <a href={getWhatsAppUrl(message)} rel="nofollow" aria-label="Per WhatsApp buchen" className={`${whatsAppButton} min-h-11 w-12 px-0`}>
          <WhatsAppLogo />
        </a>
        <a href="#book" className={`${ctaButton} min-h-11 text-[15px]`}>
          Termin wählen
        </a>
      </span>
    </section>
  );
};
