"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useForm, useWatch } from "react-hook-form";

import { formatTripDate, formatUsd } from "@/features/treks/format";

import { buildTrekRequestMessage, trekRequestSchema } from "../../requestMessage";
import type { TrekRequestFields } from "../../requestMessage";
import type { GroupPrice } from "../../types";
import { useBookingSelection } from "../booking/BookingSelection";

export type TrekRequestOptions = {
  trekName: string;
  days: number;
  groupPrices: readonly GroupPrice[];
};

export type SelectOption = { value: string; label: string };

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
 * A booking request form: the typed fields (React Hook Form + zod), group size and start day shared
 * with the booking card, and the WhatsApp message or email they become. Nothing is sent to this site.
 * A blank preferred time falls back to the start day chosen on the page, else "Not sure yet".
 */
export const useTrekRequest = ({ trekName, days, groupPrices }: TrekRequestOptions) => {
  const { groupIndex, selectGroup, startDate } = useBookingSelection();
  const form = useForm<TrekRequestFields>({
    resolver: zodResolver(trekRequestSchema),
    defaultValues: { name: "", country: "", timing: "", requests: "" },
    mode: "onTouched",
  });
  const typed = useWatch({ control: form.control });

  const tier = groupPrices[groupIndex];
  const start = startDate ? `Start ${formatTripDate(startDate)}` : null;
  const messageFor = (fields: TrekRequestFields) =>
    buildTrekRequestMessage({
      ...fields,
      trekName,
      days,
      groupSize: tier?.label ?? "",
      timing: fields.timing.trim() || start || NO_TIMING,
    });

  const groupOptions: SelectOption[] = groupPrices.map((option, index) => ({
    value: String(index),
    label: `${option.label} – ${formatUsd(option.priceUsd)}${index > 0 ? " pp" : ""}`,
  }));

  return {
    form,
    group: { value: String(groupIndex), options: groupOptions, onChange: (value: string) => selectGroup(Number(value)) },
    onSubmit: form.handleSubmit((fields) => openWhatsApp(getWhatsAppUrl(messageFor(fields)))),
    emailHref: getEmailUrl({
      subject: `Booking request: ${trekName}`,
      body: messageFor({ name: typed.name ?? "", country: typed.country ?? "", timing: typed.timing ?? "", requests: typed.requests ?? "" }),
    }),
  };
};
