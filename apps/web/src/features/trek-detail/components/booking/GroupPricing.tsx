"use client";

import { Icon } from "@ttn/ui/icon";
import { useId } from "react";

import { formatTripDate, formatUsd } from "@/features/treks/format";

import { TREK_SECTION_IDS, isTrekSectionHidden } from "../../sections";
import type { GroupPrice } from "../../types";
import { useBookingSelection } from "./BookingSelection";

type GroupPricingProps = {
  groupPrices: readonly GroupPrice[];
};

/**
 * Width of a group-size button, so the sizes fit in at most two rows and the last row fills the width:
 * up to three in one row, four as two by two, five or more three to a row (the buttons in a short last row grow).
 */
const tierBasis = (count: number) => {
  if (count <= 3) return "basis-0";
  if (count === 4) return "basis-[40%]";
  return "basis-[30%]";
};

/** Price per person for the chosen group size, the chosen start day and the group-size picker. */
export const GroupPricing = ({ groupPrices }: GroupPricingProps) => {
  const {
    groupIndex: selectedIndex,
    selectGroup: setSelectedIndex,
    startDate,
  } = useBookingSelection();
  const radioName = useId();
  const selected = groupPrices[selectedIndex];
  if (!selected) return null;

  return (
    <>
      <div className="flex flex-col">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Tier pricing · transport, permits &amp; lodging
        </p>
        <p aria-live="polite" className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-[40px] leading-none font-extrabold text-brand">
            {formatUsd(selected.priceUsd)}
          </span>
          <span className="text-body-sm font-medium text-muted-foreground">
            / person
          </span>
          <span className="sr-only">for {selected.label}</span>
        </p>
        <a
          href={`#${TREK_SECTION_IDS.inclusions}`}
          className="mt-1.5 inline-flex items-center gap-1 self-start rounded-sm text-xs font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring"
        >
          See cost inclusion and exclusion
          <Icon name="arrow_downward" size={14} />
        </a>
      </div>

      {/* "Change" opens the start date picker in the pricing section, so the line goes when that section is hidden. */}
      {startDate && !isTrekSectionHidden("pricing") && (
        <a
          href={`#${TREK_SECTION_IDS.pricing}`}
          className="flex items-center justify-between gap-2.5 rounded-md border border-brand/15 bg-brand-tint px-3 py-2.5 text-caption text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="calendar_month" size={18} className="text-brand" />
            <span>
              Start: <strong>{formatTripDate(startDate)}</strong> · your choice
            </span>
          </span>
          <span className="text-xs font-bold text-brand">Change</span>
        </a>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex w-full justify-between text-xs font-bold tracking-wider text-text uppercase">
          <span>Select group size</span>
          <span className="text-brand">Private team</span>
        </legend>
        <div className="flex flex-wrap gap-2 text-center">
          {groupPrices.map((tier, index) => (
            <label
              key={tier.label}
              className={`${tierBasis(groupPrices.length)} grow cursor-pointer rounded-md border border-line bg-page px-1 py-2.5 leading-snug text-ink has-checked:border-brand has-checked:bg-brand has-checked:text-on-brand has-checked:shadow-[0_2px_6px_rgba(0,91,159,0.25)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring`}
            >
              <input
                type="radio"
                name={radioName}
                checked={index === selectedIndex}
                onChange={() => setSelectedIndex(index)}
                aria-label={`${tier.label}: ${formatUsd(tier.priceUsd)} per person`}
                className="sr-only"
              />
              <span aria-hidden="true" className="block text-body-sm font-bold">
                {tier.shortLabel}
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 block text-caption opacity-85"
              >
                {formatUsd(tier.priceUsd)}
              </span>
            </label>
          ))}
        </div>
        <p className="text-sm leading-snug text-muted-foreground">
          Private trek guarantee: you trek only with your own dedicated guide
          and porter crew.
        </p>
      </fieldset>
    </>
  );
};
