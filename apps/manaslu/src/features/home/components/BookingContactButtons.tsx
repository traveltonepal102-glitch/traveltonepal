"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { buildBookingMessage } from "../bookingMessage";
import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

/** "Book on WhatsApp" and "Book by email": both start with the trek, the travellers and the day chosen on the page. */
export const BookingContactButtons = ({ trekName, days }: { trekName: string; days: number }) => {
  const { travellers, startDate } = useBooking();
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <>
      <a href={getWhatsAppUrl(message)} rel="nofollow" className={whatsAppButton}>
        <WhatsAppLogo />
        Book on WhatsApp
      </a>
      <a href={getEmailUrl({ subject: `Booking the ${trekName}`, body: message })} rel="nofollow" className={outlineButton}>
        <TrailIcon name="mail" />
        Book by email
      </a>
    </>
  );
};
