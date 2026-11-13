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

/** Price per person by group size; "Select" sets the booking card, and the buttons under the list book the selected group. */
export const TrekPrices = ({ pricing, trekName, days }: TrekPricesProps) => {
  const { chosenIndex, choose } = useBooking();

  return (
    <section aria-labelledby="pricing-h" id="pricing" className="flex flex-col gap-5">
      <SectionHeading id="pricing-h" eyebrow="Dates and prices" title={pricing.heading}>
        <p>{pricing.intro || "Every trek is private and starts on the day you choose. The bigger your group, the lower the price per person."}</p>
      </SectionHeading>
      <div className="overflow-hidden rounded-[14px] border border-solid border-line">
        {pricing.prices.map((price, index) => {
          const isChosen = index === chosenIndex;
          return (
            <div key={price.label} className={`-mt-px flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-solid border-line px-5 py-4 ${isChosen ? "bg-forest-tint shadow-[inset_3px_0_0_var(--color-forest)]" : ""}`}>
              <span className="flex flex-[1_1_200px] flex-col">
                <span className="flex items-center gap-2 font-semibold text-ink">
                  {price.label}
                  {price.isDefault && <span className="rounded-full border border-solid border-saffron-line bg-saffron-tint px-2 text-xs leading-4.5 text-saffron-ink">Most chosen</span>}
                </span>
                {price.team && <span className="text-sm leading-5 text-muted">{price.team}</span>}
              </span>
              <span className="font-display text-[26px] leading-8 font-[640] text-forest">
                {formatUsd(price.priceUsd)}
                <span className="font-body text-sm font-normal text-muted"> /person</span>
              </span>
              <button
                type="button"
                aria-pressed={isChosen}
                aria-label={`${isChosen ? "Selected" : "Select"}: ${price.label}`}
                onClick={() => choose(index)}
                className={`min-h-11 min-w-26 cursor-pointer rounded-[10px] border-[1.5px] border-solid border-forest px-4 text-[15px] font-semibold ${isChosen ? "bg-forest text-snow" : "bg-transparent text-forest"}`}
              >
                {isChosen ? "Selected" : "Select"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <BookingContactButtons trekName={trekName} days={days} />
      </div>
    </section>
  );
};
