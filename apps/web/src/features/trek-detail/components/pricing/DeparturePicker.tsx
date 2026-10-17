"use client";

import { Icon } from "@ttn/ui/icon";
import { useId } from "react";

import type { DepartureOption } from "../../pricing";
import { useBookingSelection } from "../booking/BookingSelection";

type DeparturePickerProps = {
  departures: readonly DepartureOption[];
  /** e.g. "2026/2027", in the picker's title. */
  season: string;
};

/** Fixed departure dates as radio cards; the choice also shows in the booking card. */
export const DeparturePicker = ({ departures, season }: DeparturePickerProps) => {
  const { departureIndex, selectDeparture } = useBookingSelection();
  const radioName = useId();
  const selected = departures[departureIndex];

  return (
    // The card is a <div>: browsers draw a fieldset's legend over its border. The legend floats so it
    // lays out as an ordinary header row (it must stay the fieldset's first child to label the group).
    <div className="rounded-lg border border-line bg-surface p-4.5 shadow-card md:p-5">
      <fieldset className="min-w-0">
        <legend className="float-left mb-3.5 flex w-full flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5">
          <span className="inline-flex items-center gap-2.5 font-display text-base font-bold text-ink">
            <Icon name="calendar_month" size={22} className="text-brand" />
            Select your {season} departure date:
          </span>
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-whatsapp">
            <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
            Guaranteed departures
          </span>
        </legend>

        <div className="clear-both grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
          {departures.map((departure, index) => (
            <label
              key={departure.label}
              className="group flex cursor-pointer flex-col rounded-xl border border-line bg-page px-4 py-3.5 has-checked:border-2 has-checked:border-brand has-checked:bg-[#f4f8fc] has-checked:px-3.75 has-checked:py-3.25 has-checked:shadow-[0_2px_8px_rgba(0,91,159,0.12)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
            >
              <input
                type="radio"
                name={radioName}
                checked={index === departureIndex}
                onChange={() => selectDeparture(index)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-[15px] font-bold text-ink">{departure.label}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex size-5 flex-none items-center justify-center rounded-full border-2 border-subtle bg-surface group-has-checked:border-brand group-has-checked:bg-brand"
                >
                  <span className="hidden size-2 rounded-full bg-white group-has-checked:block" />
                </span>
              </span>
              <span className={`mt-1.5 text-caption ${departure.isGuaranteed ? "font-semibold text-whatsapp" : "font-normal text-muted-foreground"}`}>
                {departure.note}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-caption font-normal text-text">
          <p aria-live="polite">
            Selected departure: <strong className="text-brand">{selected?.label}</strong>
          </p>
          <p className="text-muted-foreground italic">*Your own private dates are also possible, at no extra cost.</p>
        </div>
      </fieldset>
    </div>
  );
};
