"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatUsd } from "@/lib/format";

import type { HomeTrek } from "../types";
import { BookingContactButtons } from "./BookingContactButtons";
import { useBooking } from "./BookingContext";

type TrekPricesProps = {
  pricing: HomeTrek["pricing"];
  trekName: string;
  days: number;
};

/** Price per person by group size (design: a tile per group): choosing one sets the booking card too, and the buttons book that group. */
export const TrekPrices = ({ pricing, trekName, days }: TrekPricesProps) => {
  const { prices, chosenIndex, choose } = useBooking();
  const chosen = prices[chosenIndex];

  return (
    <section aria-labelledby="pricing-h" id="pricing" className="flex flex-col gap-8">
      <SectionHeading id="pricing-h" eyebrow="Dates and prices" title={pricing.heading}>
        <p className="m-0">{pricing.intro || "Every trek is private and starts on the day you choose. The bigger your group, the lower the price per person."}</p>
      </SectionHeading>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 p-0">
        {pricing.prices.map((price, index) => {
          const isChosen = index === chosenIndex;
          return (
            <li key={price.label} className="flex">
              <button
                type="button"
                aria-pressed={isChosen}
                onClick={() => choose(index)}
                className={`relative flex flex-1 cursor-pointer flex-col items-start gap-1.5 rounded-[18px] border-[1.5px] border-solid p-5 text-left font-[inherit] transition-colors ${isChosen ? "border-maroon bg-maroon text-snow" : "border-line bg-snow text-ink hover:border-maroon"}`}
              >
                {price.isDefault && <span className="absolute -top-2.75 right-3.5 rounded-full bg-saffron px-2.5 text-xs leading-4.5 font-bold text-ink">Most chosen</span>}
                <span className="font-semibold">{price.label}</span>
                <span className="text-[32px] leading-9 font-semibold">{formatUsd(price.priceUsd)}</span>
                <span className="text-sm leading-5 opacity-80">per person</span>
                {price.team && <span className={`mt-1.5 w-full border-0 border-t border-solid pt-2.5 text-[13px] leading-5 opacity-85 ${isChosen ? "border-white/30" : "border-line"}`}>{price.team}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-solid border-line bg-snow px-5.5 py-4.5">
        {chosen && (
          <p className="m-0 leading-6.5">
            <span className="block text-sm text-muted">Your choice</span>
            <strong className="text-xl font-semibold text-ink">
              {chosen.label} · {formatUsd(chosen.priceUsd)} per person
            </strong>
          </p>
        )}
        <div className="actions">
          <BookingContactButtons trekName={trekName} days={days} />
        </div>
      </div>
    </section>
  );
};
