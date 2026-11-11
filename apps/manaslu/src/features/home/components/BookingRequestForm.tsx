"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { useState } from "react";
import type { FormEvent } from "react";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { MAX_REQUESTS_LENGTH, buildBookingMessage, formatStartDate } from "../bookingMessage";
import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

type BookingRequestFormProps = { trekName: string; days: number };

const LABEL = "flex flex-col gap-1.5 text-sm leading-5 font-semibold text-ink";
// 16px text: smaller makes iPhones zoom in when a field is tapped.
const FIELD = "min-h-12 w-full rounded-[10px] border border-solid border-field bg-snow px-3.5 text-base font-normal text-ink";

/**
 * The fuller request: name, country and special requests on top of the group and day chosen on the page. It only writes
 * the first message, on WhatsApp or by email: nothing is stored on this website.
 */
export const BookingRequestForm = ({ trekName, days }: BookingRequestFormProps) => {
  const { travellers, startDate } = useBooking();
  const [error, setError] = useState("");

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    const message = buildBookingMessage({
      trekName,
      days,
      groupSize: travellersText(travellers),
      startDate,
      name,
      country: String(fields.get("country") ?? ""),
      requests: String(fields.get("requests") ?? ""),
    });
    const isEmail = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "email";
    window.location.href = isEmail ? getEmailUrl({ subject: `Booking request: ${trekName}`, body: message }) : getWhatsAppUrl(message);
  };

  return (
    <form noValidate onSubmit={send} className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <label className={LABEL}>
          Full name
          <input name="name" autoComplete="name" maxLength={80} aria-invalid={error ? true : undefined} aria-describedby={error ? "request-error" : undefined} className={FIELD} />
          {error && (
            <span id="request-error" role="alert" className="font-normal text-saffron-ink">
              {error}
            </span>
          )}
        </label>
        <label className={LABEL}>
          Country
          <input name="country" autoComplete="country-name" maxLength={60} className={FIELD} />
        </label>
      </div>
      <label className={LABEL}>
        Special requests
        <textarea name="requests" rows={3} maxLength={MAX_REQUESTS_LENGTH} placeholder="An extra rest day, vegetarian meals, a side trip…" className={`${FIELD} py-3`} />
      </label>
      <p className="text-[15px] leading-5.5 text-muted">
        For {travellersText(travellers)}
        {startDate ? `, starting ${formatStartDate(startDate)}` : ""}. Change the group and the day in the booking card.
      </p>
      <div className="actions">
        <button type="submit" value="whatsapp" className={`${whatsAppButton} cursor-pointer border-0`}>
          <WhatsAppLogo />
          Send on WhatsApp
        </button>
        <button type="submit" value="email" className={`${outlineButton} cursor-pointer`}>
          <TrailIcon name="mail" />
          Send by email
        </button>
      </div>
      <p className="flex items-center gap-1.5 text-sm leading-5 text-muted">
        <TrailIcon name="lock" size={14} />
        Nothing is stored on this website.
      </p>
    </form>
  );
};
