"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { MONTH_NAMES, RATING_LOOK, RATINGS } from "@/features/guide-article/components/body/monthRatings";
import type { MonthRating } from "@/features/regions/overviews";
import { formatTripDate } from "@/features/treks/format";

import { dateInMonth, endDate, isCalendarDate, lastDayOf, monthIndexOf } from "../../startDate";
import { useBookingSelection } from "../booking/BookingSelection";

const MONTH_NOTES: Record<MonthRating, string> = {
  best: "one of the best months",
  possible: "possible, with some trade-offs",
  avoid: "not ideal: ask us first",
};

const PERKS = ["No fixed departures", "No minimum group size", "Free date changes until you pay the deposit"];

type StartDatePickerProps = {
  days: number;
  /** e.g. "Langtang": the months' colours are that region's. */
  regionName: string;
};

/**
 * "Choose your own start date" (design: Trek, pricing): no fixed departures. A month from the next 12 (coloured by
 * the region's best months), then the start day; the choice shows in the booking card and goes into the requests.
 */
export const StartDatePicker = ({ days, regionName }: StartDatePickerProps) => {
  const { today, months, startDate, selectStartDate } = useBookingSelection();
  const dateId = useId();
  const chosenIndex = startDate ? monthIndexOf(months, startDate) : -1;
  const rating = months[chosenIndex]?.rating;
  const lastMonth = months.at(-1);
  const latest = lastMonth && lastDayOf(lastMonth);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4.5 shadow-card md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5">
        <h3 className="inline-flex items-center gap-2.5 font-display text-base font-bold text-ink">
          <Icon name="calendar_month" size={22} className="text-brand" />
          Choose your own start date
        </h3>
        <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-whatsapp">
          <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
          Private trek · any day of the year
        </span>
      </div>
      <p className="text-body-sm text-text">
        There are no fixed departures. Pick the month that suits you, then your start day.
        {regionName && ` The colours show how good each month is for the ${regionName} region.`}
      </p>

      <div role="group" aria-label="Start month" aria-busy={!today} className="grid min-h-17 grid-cols-6 gap-1.5 lg:grid-cols-12">
        {months.map((month, index) => (
          <button
            key={`${month.year}-${month.month}`}
            type="button"
            aria-pressed={index === chosenIndex}
            title={`${MONTH_NAMES[month.month]} ${month.year}${month.rating ? `: ${RATING_LOOK[month.rating].label}` : ""}`}
            onClick={() => startDate && today && selectStartDate(dateInMonth(startDate, month, today))}
            className="cursor-pointer rounded-md border border-line bg-surface px-1.5 pt-2 pb-2.5 text-center aria-pressed:border-2 aria-pressed:border-brand aria-pressed:bg-[#f4f8fc] aria-pressed:shadow-[0_2px_8px_rgba(0,91,159,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span aria-hidden="true" className={cn("block h-1.5 rounded-full", month.rating ? RATING_LOOK[month.rating].bar : "bg-line")} />
            <span className="mt-2 block font-display text-sm font-bold text-ink">{MONTH_NAMES[month.month].slice(0, 3)}</span>
            <span className="block text-[11px] text-muted-foreground">{month.year}</span>
          </button>
        ))}
      </div>
      {months.some((month) => month.rating) && (
        <ul className="flex flex-wrap gap-3.5 text-xs text-text">
          {RATINGS.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={cn("h-1.5 w-3.5 rounded-full", RATING_LOOK[item].bar)} />
              {RATING_LOOK[item].label}
            </li>
          ))}
        </ul>
      )}

      <div className="grid items-end gap-3 sm:grid-cols-[240px_minmax(0,1fr)]">
        <label htmlFor={dateId} className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wider text-text uppercase">Start day in Kathmandu</span>
          <input
            id={dateId}
            type="date"
            value={startDate ?? ""}
            min={today ?? undefined}
            max={latest}
            disabled={!today}
            onChange={(event) => {
              const value = event.target.value;
              if (today && isCalendarDate(value) && value >= today) selectStartDate(value);
            }}
            className="h-12 rounded-md border border-line-strong bg-surface px-3 text-[15px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-ring"
          />
        </label>
        <p aria-live="polite" className="flex items-center gap-3.5 rounded-lg border border-[#d3e3f1] bg-[#f4f8fc] px-4 py-3">
          <span aria-hidden="true" className="inline-flex size-10.5 flex-none items-center justify-center rounded-md bg-surface text-brand">
            <Icon name="route" size={22} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-base font-bold text-ink">
              {startDate ? `${formatTripDate(startDate)} – ${formatTripDate(endDate(startDate, days))}` : "Pick a month"}
            </span>
            <span className="text-caption text-text">
              {days} days{rating && ` · ${MONTH_NOTES[rating]}`}
            </span>
          </span>
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-4.5 gap-y-2 border-t border-line pt-3 text-caption text-text">
        {PERKS.map((perk) => (
          <li key={perk} className="inline-flex items-center gap-1.5">
            <Icon name="check_circle" size={16} className="flex-none text-whatsapp" />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
};
