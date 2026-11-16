"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useId } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatPrice } from "@/lib/format";

import { buildBookingMessage } from "../bookingMessage";
import { useBooking } from "./BookingContext";
import { GroupPriceTable } from "./GroupPriceTable";

type BookingCardProps = { trekName: string; shortName: string; days: number };

const LABEL = "text-sm leading-5 font-semibold text-ink";
const FIELD = "min-h-12 w-full rounded-[10px] border border-solid border-field bg-snow px-3.5 text-ink";

/**
 * The sticky card, read top to bottom: the price per person for the group chosen, the start day, every group's price
 * (GroupPriceTable, one is chosen), and WhatsApp or email, whose message carries the day and the group. No total: a
 * group is a range ("3–5 Personen"), so the price is per person (decided 2026-11-16).
 */
export const BookingCard = ({ trekName, shortName, days }: BookingCardProps) => {
  const { prices, chosenIndex, choose, today, startDate, setStartDate } = useBooking();
  const id = useId();
  const chosen = prices[chosenIndex];
  const message = buildBookingMessage({ trekName, days, groupSize: chosen?.label ?? "", startDate });

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
              Privattrek · Preis für {chosen.label}
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

        {prices.length > 1 && <GroupPriceTable prices={prices} chosenIndex={chosenIndex} onChoose={choose} />}
        {chosen?.team && <p className="-mt-2 text-eyebrow text-muted">Team: {chosen.team}</p>}

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
