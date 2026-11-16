"use client";

import { useId } from "react";

import { formatPrice } from "@/lib/format";

import type { HomeGroupPrice } from "../types";

type GroupPriceTableProps = {
  prices: readonly HomeGroupPrice[];
  /** The group the chosen travellers are in: its row is selected. */
  chosenIndex: number;
  /** Picking a row sets the travellers to that group's smallest size. */
  onChoose: (index: number) => void;
};

/**
 * "Preis pro Person nach Gruppengröße" in the booking card: every group's price per person, always shown, as one
 * choice list. Real radio buttons (keyboard: arrow keys), so picking a group and the travellers stepper above always
 * agree: the stepper's number selects its group here, and a row picked here sets the stepper.
 */
export const GroupPriceTable = ({ prices, chosenIndex, onChoose }: GroupPriceTableProps) => {
  const name = useId();
  const headingId = `${name}-h`;

  return (
    <fieldset aria-labelledby={headingId} className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <div className="flex items-baseline justify-between gap-3">
        <span id={headingId} className="text-sm leading-5 font-semibold text-ink">
          Preis nach Gruppengröße
        </span>
        <span aria-hidden="true" className="text-eyebrow text-muted">
          pro Person
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {prices.map((price, index) => {
          const isChosen = index === chosenIndex;
          return (
            <li key={price.label}>
              <label
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[10px] border border-solid px-3 text-[15px] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus motion-reduce:transition-none ${
                  isChosen ? "border-azure bg-sky font-semibold text-navy" : "border-line bg-snow text-ink hover:border-azure/50"
                }`}
              >
                <input type="radio" name={name} checked={isChosen} onChange={() => onChoose(index)} className="sr-only" />
                {/* The radio's look: a ring, filled when chosen. */}
                <span aria-hidden="true" className={`grid size-4.5 flex-none place-items-center rounded-full border-2 border-solid ${isChosen ? "border-azure" : "border-field"}`}>
                  {isChosen && <span className="size-2 rounded-full bg-azure" />}
                </span>
                <span>{price.label}</span>
                <span aria-hidden="true" className="min-w-3 flex-1 translate-y-1 border-b-2 border-dotted border-line" />
                <span className="whitespace-nowrap">{formatPrice(price.price, price.currency)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};
