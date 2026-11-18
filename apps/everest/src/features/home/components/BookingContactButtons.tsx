"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { buildBookingMessage } from "../bookingMessage";
import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

/** "Per WhatsApp buchen" and "Per E-Mail buchen": both start with the trek, the travellers and the day chosen on the page. */
export const BookingContactButtons = ({ trekName, days }: { trekName: string; days: number }) => {
  const { travellers, startDate } = useBooking();
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <>
      <a href={getWhatsAppUrl(message)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
        <WhatsAppLogo />
        Per WhatsApp buchen
      </a>
      <a href={getEmailUrl({ subject: `Buchung: ${trekName}`, body: message })} rel="nofollow" className={outlineButton}>
        <TrailIcon name="mail" />
        Per E-Mail buchen
      </a>
    </>
  );
};
