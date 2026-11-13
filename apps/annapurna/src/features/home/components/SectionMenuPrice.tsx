"use client";

import { formatUsd } from "@/lib/format";

import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

/**
 * The price in the menu at the top: the same per-person price as the booking card, for the travellers chosen there
 * (it changes with them), so the page never shows two different prices. Nothing while the trek has no prices.
 */
export const SectionMenuPrice = () => {
  const { prices, chosenIndex, travellers } = useBooking();
  const chosen = prices[chosenIndex];
  if (!chosen) return null;

  return (
    <span className="text-right text-sm leading-4.5 text-muted">
      Per person · {travellersText(travellers)}
      <br />
      <strong className="font-display text-xl leading-6 font-[640] text-ink">{formatUsd(chosen.priceUsd)}</strong>
    </span>
  );
};
