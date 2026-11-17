"use client";

import { useId } from "react";

import { formatUsdCode } from "@/lib/format";

import { BookingContactButtons } from "./BookingContactButtons";
import { useBooking } from "./BookingContext";

type BookingCardProps = { trekName: string; shortName: string; days: number };

const FIELD = "min-h-12 w-full rounded-xl border-[1.5px] border-solid border-field bg-snow px-3.5 font-[inherit] text-base text-ink";

/**
 * The booking card at the top (design: price per person, then the group sizes as a list of radio buttons with dotted
 * leaders, always open so every price is in view). The group picked sets the price here, in the menu and in the price
 * list; the day and the group go into the WhatsApp message and the email.
 */
export const BookingCard = ({ trekName, shortName, days }: BookingCardProps) => {
  const { prices, chosenIndex, choose, today, startDate, setStartDate } = useBooking();
  const id = useId();
  const chosen = prices[chosenIndex];

  return (
    <div className="flex flex-col gap-3.5 rounded-3xl border border-solid border-line bg-snow px-5.5 py-6 shadow-raised">
      <h2 id="book-h" className="text-center font-body! text-[13px]! leading-4.5! font-semibold tracking-[0.14em] text-muted uppercase">
        {shortName} · {days} days
      </h2>
      {chosen && (
        <p className="m-0 flex max-w-none flex-col items-center text-center">
          <span>
            <strong className="text-[38px] leading-11 font-semibold text-ink">{formatUsdCode(chosen.priceUsd)}</strong>
            <span className="text-xl text-muted"> / person</span>
          </span>
          <span className="text-sm leading-5 text-muted">for {chosen.label} · private trek</span>
        </p>
      )}

      {prices.length > 1 && (
        <fieldset className="m-0 rounded-xl border-0 bg-cream px-2.5 pt-3 pb-2">
          <legend className="sr-only">Choose your group size</legend>
          <p aria-hidden="true" className="m-0 flex max-w-none justify-between border-0 border-b-[1.5px] border-solid border-maroon px-2 pb-2 text-[15px] leading-5 font-semibold text-maroon">
            <span>Choose your group size</span>
            <span>Price per person</span>
          </p>
          <ul className="m-0 flex list-none flex-col p-0 pt-1">
            {prices.map((price, index) => {
              const isChosen = index === chosenIndex;
              return (
                <li key={price.label}>
                  <label className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md px-2 text-base ${isChosen ? "bg-paper font-semibold text-maroon shadow-[inset_3px_0_0_var(--color-maroon)]" : "text-ink hover:bg-paper"}`}>
                    <input type="radio" name={`${id}-group`} checked={isChosen} onChange={() => choose(index)} className="peer sr-only" />
                    <span aria-hidden="true" className="inline-flex size-5 flex-none items-center justify-center rounded-full border-2 border-solid border-field bg-snow peer-checked:border-maroon peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron">
                      {isChosen && <span className="size-2.5 rounded-full bg-maroon" />}
                    </span>
                    <span>{price.label}</span>
                    <span aria-hidden="true" className="flex-1 translate-y-1 border-0 border-b-2 border-dotted border-field" />
                    <span>{formatUsdCode(price.priceUsd)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <p className="m-0 px-2 pt-1.5 text-[13px] leading-4.5 text-muted">Bigger groups pay less per person.</p>
        </fieldset>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-date`} className="text-[15px] leading-5 font-semibold text-ink">
          Start date
        </label>
        <input id={`${id}-date`} type="date" value={startDate} min={today || undefined} onChange={(event) => setStartDate(event.target.value)} className={FIELD} />
        <span className="text-[13px] leading-4.5 text-muted">Private trek: start on any day you like.</span>
      </div>

      <div className="flex flex-col gap-2">
        <BookingContactButtons trekName={trekName} days={days} />
      </div>
      <p className="m-0 max-w-none text-center text-[13px] leading-4.5 text-muted">Nothing to pay now: this only starts the conversation.</p>
    </div>
  );
};
