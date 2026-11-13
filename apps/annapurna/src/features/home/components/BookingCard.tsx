"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useId } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatUsd } from "@/lib/format";

import { buildBookingMessage } from "../bookingMessage";
import { MAX_TRAVELLERS, nextGroupTip, travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

type BookingCardProps = { trekName: string; shortName: string; days: number };

const LABEL = "text-sm leading-5 font-semibold text-ink";
const FIELD = "min-h-12 w-full rounded-[10px] border border-solid border-field bg-snow px-3.5 text-ink";
const STEP = "size-11 cursor-pointer border-0 bg-transparent text-[22px] leading-none text-navy disabled:cursor-not-allowed disabled:opacity-40";
const MIN_TRAVELLERS = 1;

/** The sticky card: the start day and travellers set the price and the total; the message on WhatsApp or by email carries them. */
export const BookingCard = ({ trekName, shortName, days }: BookingCardProps) => {
  const { prices, ranges, travellers, setTravellers, chosenIndex, today, startDate, setStartDate } = useBooking();
  const id = useId();
  const chosen = prices[chosenIndex];
  const tip = nextGroupTip(ranges, prices, travellers);
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <div className="overflow-hidden rounded-2xl border border-solid border-line bg-snow shadow-raised">
      <div className="flex flex-col gap-0.5 bg-navy-deep px-5.5 pt-5 pb-4.5 text-snow">
        <h2 id="book-h" className="font-body! text-[15px]! leading-5! font-semibold text-on-navy-muted!">
          Book the {shortName}
        </h2>
        {chosen && (
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="font-display text-[38px] leading-11 font-[640]">{formatUsd(chosen.priceUsd)}</span>
            <span className="text-[15px] text-on-navy-muted">per person · {chosen.label}</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 px-5.5 pt-4.5 pb-5.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-date`} className={LABEL}>
            Start date
          </label>
          <input id={`${id}-date`} type="date" value={startDate} min={today || undefined} onChange={(event) => setStartDate(event.target.value)} className={FIELD} />
          <span className="text-eyebrow text-muted">Private trek: start on any day you like.</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex flex-col">
            <span id={`${id}-travellers`} className={LABEL}>
              Travellers
            </span>
            {chosen?.team && <span className="text-eyebrow text-muted">{chosen.team}</span>}
          </span>
          <span role="group" aria-labelledby={`${id}-travellers`} className="inline-flex flex-none items-center rounded-[10px] border border-solid border-field">
            <button type="button" aria-label="One traveller fewer" disabled={travellers <= MIN_TRAVELLERS} onClick={() => setTravellers(travellers - 1)} className={STEP}>
              −
            </button>
            <output aria-live="polite" className="min-w-8 text-center font-semibold text-ink">
              {travellers}
            </output>
            <button type="button" aria-label="One more traveller" disabled={travellers >= MAX_TRAVELLERS} onClick={() => setTravellers(travellers + 1)} className={STEP}>
              +
            </button>
          </span>
        </div>

        {tip && (
          <p className="flex gap-2 rounded-[10px] bg-cream px-3 py-2.5 text-sm leading-5 text-cream-ink">
            <TrailIcon name="tag" size={16} className="mt-0.5" />
            Add {tip.more} more and the price drops to {formatUsd(tip.priceUsd)} per person.
          </p>
        )}

        {chosen && (
          <dl className="flex flex-col gap-2 border-t border-solid border-line pt-3.5 text-[15px] leading-5.5">
            <div className="flex justify-between gap-3">
              <dt>{formatUsd(chosen.priceUsd)} × {travellersText(travellers)}</dt>
              <dd className="text-ink">{formatUsd(chosen.priceUsd * travellers)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-line pt-2.5">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-display text-[26px] leading-7.5 font-[640] text-ink">{formatUsd(chosen.priceUsd * travellers)}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col gap-2 border-t border-solid border-line pt-4">
          <a href={getWhatsAppUrl(message)} className={whatsAppButton}>
            <WhatsAppLogo />
            Book on WhatsApp
          </a>
          <a href={getEmailUrl({ subject: `Booking the ${trekName}`, body: message })} className={outlineButton}>
            <TrailIcon name="mail" />
            Book by email
          </a>
          <p className="text-center text-eyebrow text-muted">Nothing to pay now: this only starts the conversation.</p>
        </div>
      </div>
    </div>
  );
};
