"use client";

import { formatPrice } from "@/lib/format";

import { useBooking } from "./BookingContext";

/**
 * The price in the menu at the top and the phone's bar: the booking card's per-person price for the group chosen there
 * (it changes with it), so the page never shows two different prices. Nothing while the trek has no prices.
 */
export const SectionMenuPrice = ({ className = "" }: { className?: string }) => {
  const { prices, chosenIndex } = useBooking();
  const chosen = prices[chosenIndex];
  if (!chosen) return null;

  return (
    <span className={`flex flex-col text-[13px] leading-4.5 text-muted ${className}`}>
      Pro Person · {chosen.label}
      <strong className="text-xl leading-6 font-semibold text-ink">{formatPrice(chosen.price, chosen.currency)}</strong>
    </span>
  );
};
