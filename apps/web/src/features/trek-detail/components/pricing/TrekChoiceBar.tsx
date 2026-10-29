"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatTripDate, formatUsd } from "@/features/treks/format";

import { buildDateCheckMessage } from "../../requestMessage";
import type { GroupPrice } from "../../types";
import { useBookingSelection } from "../booking/BookingSelection";

const ACTION =
  "inline-flex min-h-11 items-center gap-2 rounded-md px-4.5 text-body-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type TrekChoiceBarProps = {
  trekName: string;
  days: number;
  groupPrices: readonly GroupPrice[];
};

/** Under the group rates: the visitor's group, start day and price, and a message asking about that date (WhatsApp or email). */
export const TrekChoiceBar = ({ trekName, days, groupPrices }: TrekChoiceBarProps) => {
  const { groupIndex, startDate } = useBookingSelection();
  const tier = groupPrices[groupIndex];
  if (!tier || !startDate) return null;

  const start = formatTripDate(startDate);
  const message = buildDateCheckMessage({ trekName, days, groupSize: `${tier.label} (${formatUsd(tier.priceUsd)} per person)`, startDate: start });

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-[#d3e3f1] bg-[#f4f8fc] px-5 py-4 shadow-card sm:flex-row sm:items-center">
      <p aria-live="polite" className="text-body-sm text-text">
        Your trek: <strong className="text-ink">{tier.label}</strong> · starts <strong className="text-ink">{start}</strong> ·{" "}
        <strong className="text-brand">{formatUsd(tier.priceUsd)} per person</strong>
      </p>
      <div className="flex flex-none flex-wrap gap-2">
        <a
          href={getWhatsAppUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${ACTION} bg-whatsapp text-white hover:bg-whatsapp/90`}
        >
          <WhatsAppLogo size={18} />
          Check this date on WhatsApp
          <span className="sr-only">(opens WhatsApp)</span>
        </a>
        <a href={getEmailUrl({ subject: `${trekName} on ${start}`, body: message })} className={`${ACTION} border border-line-strong bg-surface text-ink hover:bg-page`}>
          <Icon name="mail" size={18} className="text-brand" />
          Email
        </a>
      </div>
    </div>
  );
};
