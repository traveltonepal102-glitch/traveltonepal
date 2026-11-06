"use client";

import { primaryButton } from "@/components/ui/buttonStyles";
import { formatUsd } from "@/lib/format";

import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

/** A phone's bar at the bottom of the screen: the travellers and their total, and the way to the booking card. */
export const MobileBookingBar = () => {
  const { prices, chosenIndex, travellers } = useBooking();
  const chosen = prices[chosenIndex];

  return (
    <section aria-label="Your booking" className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-solid border-line bg-snow px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(23,36,30,0.3)] lg:hidden">
      <span className="flex flex-col text-eyebrow text-muted">
        {chosen ? `${travellersText(travellers)} · total` : "Private trek"}
        {chosen && <strong className="font-display text-[22px] leading-6.5 font-[640] text-ink">{formatUsd(chosen.priceUsd * travellers)}</strong>}
      </span>
      <a href="#book" className={primaryButton}>
        Book now
      </a>
    </section>
  );
};
