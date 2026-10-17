"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { formatUsd } from "@/features/treks/format";

import type { DepartureOption } from "../../pricing";
import { SEASON_OPTIONS, buildTrekRequestMessage, trekRequestSchema } from "../../requestMessage";
import type { TrekRequestFields } from "../../requestMessage";
import type { GroupPrice } from "../../types";
import { useBookingSelection } from "../booking/BookingSelection";

export type TrekRequestOptions = {
  trekName: string;
  days: number;
  groupPrices: readonly GroupPrice[];
  departures: readonly DepartureOption[];
};

export type SelectOption = { value: string; label: string };

const DEPARTURE_PREFIX = "departure:";
const NO_TIMING = "Not sure yet";

/** Opens WhatsApp in a new tab, or in this one when the browser blocks new tabs. */
const openWhatsApp = (url: string) => {
  const tab = window.open(url, "_blank");
  if (!tab) {
    window.location.href = url;
    return;
  }
  tab.opener = null;
};

/**
 * A booking request form: the typed fields (React Hook Form + zod), group size and departure shared
 * with the booking card, and the WhatsApp message or email they become. Nothing is sent to this site.
 */
export const useTrekRequest = ({ trekName, days, groupPrices, departures }: TrekRequestOptions) => {
  const { groupIndex, selectGroup, departureIndex, selectDeparture } = useBookingSelection();
  /** A season, or null while one of the fixed departures is the choice. */
  const [season, setSeason] = useState<string | null>(departures.length > 0 ? null : NO_TIMING);
  const form = useForm<TrekRequestFields>({
    resolver: zodResolver(trekRequestSchema),
    defaultValues: { name: "", country: "", requests: "" },
    mode: "onTouched",
  });
  const typed = useWatch({ control: form.control });

  const tier = groupPrices[groupIndex];
  const departure = departures[departureIndex];
  const messageFor = (fields: TrekRequestFields) =>
    buildTrekRequestMessage({
      ...fields,
      trekName,
      days,
      groupSize: tier ? `${tier.label} (${formatUsd(tier.priceUsd)} per person)` : "",
      timing: season ?? (departure ? `Departure ${departure.label}` : NO_TIMING),
    });

  const changeTiming = (value: string) => {
    if (!value.startsWith(DEPARTURE_PREFIX)) return setSeason(value);
    selectDeparture(Number(value.slice(DEPARTURE_PREFIX.length)));
    setSeason(null);
  };

  const groupOptions: SelectOption[] = groupPrices.map((option, index) => ({
    value: String(index),
    label: `${option.label} – ${formatUsd(option.priceUsd)}${index > 0 ? " pp" : ""}`,
  }));
  const timingOptions: SelectOption[] = [
    ...departures.map((option, index) => ({
      value: `${DEPARTURE_PREFIX}${index}`,
      label: `Departure ${option.label}${option.isGuaranteed ? " (guaranteed)" : ""}`,
    })),
    ...SEASON_OPTIONS.map((option) => ({ value: option, label: option })),
  ];

  return {
    form,
    group: { value: String(groupIndex), options: groupOptions, onChange: (value: string) => selectGroup(Number(value)) },
    timing: { value: season ?? `${DEPARTURE_PREFIX}${departureIndex}`, options: timingOptions, onChange: changeTiming },
    onSubmit: form.handleSubmit((fields) => openWhatsApp(getWhatsAppUrl(messageFor(fields)))),
    emailHref: getEmailUrl({
      subject: `Booking request: ${trekName}`,
      body: messageFor({ name: typed.name ?? "", country: typed.country ?? "", requests: typed.requests ?? "" }),
    }),
  };
};
