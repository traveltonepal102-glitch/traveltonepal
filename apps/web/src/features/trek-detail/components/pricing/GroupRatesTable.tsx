"use client";

import { formatUsd } from "@/features/treks/format";

import type { GroupPrice } from "../../types";
import { useBookingSelection } from "../booking/BookingSelection";

const CELL = "px-4 py-3.5";

/** Price per person and team for each group size; "Select" sets the size used in the booking card. */
export const GroupRatesTable = ({ groupPrices }: { groupPrices: readonly GroupPrice[] }) => {
  const { groupIndex, selectGroup } = useBookingSelection();

  return (
    <div
      role="region"
      aria-label="Group rates"
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <table className="w-full min-w-140 border-collapse text-left">
        <caption className="sr-only">Price per person by group size</caption>
        <thead>
          <tr className="border-b border-line bg-page text-xs font-bold tracking-wider text-text uppercase">
            <th scope="col" className={CELL}>Group size</th>
            <th scope="col" className={CELL}>Per person</th>
            <th scope="col" className={CELL}>Your team</th>
            <th scope="col" className={`${CELL} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody className="text-body-sm text-text">
          {groupPrices.map((tier, index) => {
            const isSelected = index === groupIndex;
            return (
              <tr key={tier.label} className={`border-t border-line first:border-t-0 ${isSelected ? "bg-brand-tint" : ""}`}>
                <th scope="row" className={`${CELL} font-bold text-ink`}>
                  {tier.isDefault && (
                    <span className="mr-1.5 rounded-xs bg-saffron/30 px-1.5 py-0.5 text-[10px] font-extrabold text-ink uppercase">
                      Popular
                    </span>
                  )}
                  {tier.label}
                </th>
                <td className={`${CELL} font-display text-base font-extrabold text-brand`}>{formatUsd(tier.priceUsd)}</td>
                <td className={`${CELL} text-xs text-text`}>{tier.team}</td>
                <td className={`${CELL} text-right`}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? "Selected" : "Select"}: ${tier.label}`}
                    onClick={() => selectGroup(index)}
                    className={`cursor-pointer rounded-sm border px-3 py-1.25 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                      isSelected ? "border-brand bg-brand text-on-brand" : "border-line-strong bg-muted text-ink hover:bg-line"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
