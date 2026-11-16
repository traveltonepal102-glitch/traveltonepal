"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useId } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatPrice } from "@/lib/format";

import { buildBookingMessage } from "../bookingMessage";
import { MAX_TRAVELLERS, nextGroupTip, travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";
import { GroupPriceTable } from "./GroupPriceTable";

type BookingCardProps = { trekName: string; shortName: string; days: number };

const LABEL = "text-sm leading-5 font-semibold text-ink";
const FIELD = "min-h-12 w-full rounded-[10px] border border-solid border-field bg-snow px-3.5 text-ink";
const STEP = "size-11 cursor-pointer border-0 bg-transparent text-[22px] leading-none text-navy disabled:cursor-not-allowed disabled:opacity-40";
const MIN_TRAVELLERS = 1;

/**
 * The sticky card, read top to bottom: the price per person for the travellers chosen, the start day, the travellers,
 * every group's price (GroupPriceTable: picking one sets the travellers), the total, and WhatsApp or email, whose
 * message carries the day and the group.
 */
export const BookingCard = ({ trekName, shortName, days }: BookingCardProps) => {
  const { prices, ranges, travellers, setTravellers, chosenIndex, choose, today, startDate, setStartDate } = useBooking();
  const id = useId();
  const chosen = prices[chosenIndex];
  const tip = nextGroupTip(ranges, prices, travellers);
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <div className="overflow-hidden rounded-2xl border border-solid border-line bg-snow shadow-raised">
      <div className="flex flex-col gap-1 border-b border-solid border-line px-5.5 pt-5 pb-4">
        <h2 id="book-h" className="font-body! text-[15px]! leading-5! font-semibold text-muted!">
          {shortName} buchen
        </h2>
        {chosen && (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-[40px] leading-12 font-[680] text-ink">{formatPrice(chosen.price, chosen.currency)}</span>
              <span className="text-[17px] text-muted">pro Person</span>
            </p>
            <p className="text-eyebrow text-muted">
              Privattrek · Preis für {travellersText(travellers)}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 px-5.5 pt-4.5 pb-5.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-date`} className={LABEL}>
            Startdatum
          </label>
          <input id={`${id}-date`} type="date" value={startDate} min={today || undefined} onChange={(event) => setStartDate(event.target.value)} className={FIELD} />
          <span className="text-eyebrow text-muted">Privattrek: Sie starten an einem Tag Ihrer Wahl.</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex flex-col">
            <span id={`${id}-travellers`} className={LABEL}>
              Personen
            </span>
            {chosen?.team && <span className="text-eyebrow text-muted">{chosen.team}</span>}
          </span>
          <span role="group" aria-labelledby={`${id}-travellers`} className="inline-flex flex-none items-center rounded-[10px] border border-solid border-field">
            <button type="button" aria-label="Eine Person weniger" disabled={travellers <= MIN_TRAVELLERS} onClick={() => setTravellers(travellers - 1)} className={STEP}>
              −
            </button>
            <output aria-live="polite" className="min-w-8 text-center font-semibold text-ink">
              {travellers}
            </output>
            <button type="button" aria-label="Eine Person mehr" disabled={travellers >= MAX_TRAVELLERS} onClick={() => setTravellers(travellers + 1)} className={STEP}>
              +
            </button>
          </span>
        </div>

        {prices.length > 1 && <GroupPriceTable prices={prices} chosenIndex={chosenIndex} onChoose={choose} />}

        {tip && (
          <p className="flex gap-2 rounded-[10px] bg-cream px-3 py-2.5 text-sm leading-5 text-cream-ink">
            <TrailIcon name="tag" size={16} className="mt-0.5" />
            Mit {tip.more === 1 ? "einer weiteren Person" : `${tip.more} weiteren Personen`} sinkt der Preis auf {formatPrice(tip.price, tip.currency)} pro Person.
          </p>
        )}

        {chosen && (
          <dl className="flex flex-col gap-2 border-t border-solid border-line pt-3.5 text-[15px] leading-5.5">
            <div className="flex justify-between gap-3">
              <dt>{formatPrice(chosen.price, chosen.currency)} × {travellersText(travellers)}</dt>
              <dd className="text-ink">{formatPrice(chosen.price * travellers, chosen.currency)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-line pt-2.5">
              <dt className="font-semibold text-ink">Gesamt</dt>
              <dd className="font-display text-[26px] leading-7.5 font-[640] text-ink">{formatPrice(chosen.price * travellers, chosen.currency)}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col gap-2 border-t border-solid border-line pt-4">
          <a href={getWhatsAppUrl(message)} rel="nofollow" className={whatsAppButton}>
            <WhatsAppLogo />
            Per WhatsApp anfragen
          </a>
          <a href={getEmailUrl({ subject: `Buchungsanfrage: ${trekName}`, body: message })} rel="nofollow" className={outlineButton}>
            <TrailIcon name="mail" />
            Per E-Mail anfragen
          </a>
          <p className="text-center text-eyebrow text-muted">Jetzt nichts zu zahlen: Sie nehmen nur unverbindlich Kontakt auf.</p>
        </div>
      </div>
    </div>
  );
};
