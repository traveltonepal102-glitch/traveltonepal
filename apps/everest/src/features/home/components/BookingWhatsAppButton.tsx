"use client";

import { getWhatsAppUrl } from "@ttn/config/contact";

import { whatsAppButton } from "@/components/ui/buttonStyles";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { buildBookingMessage } from "../bookingMessage";
import { travellersText } from "../groupSizes";
import { useBooking } from "./BookingContext";

type BookingWhatsAppButtonProps = { trekName: string; days: number; className?: string };

/** "Per WhatsApp buchen" outside the booking card (the menu at the top, a phone's bar): the same message, with the group and day chosen on the page. */
export const BookingWhatsAppButton = ({ trekName, days, className = "" }: BookingWhatsAppButtonProps) => {
  const { travellers, startDate } = useBooking();
  const message = buildBookingMessage({ trekName, days, groupSize: travellersText(travellers), startDate });

  return (
    <a href={getWhatsAppUrl(message)} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} whitespace-nowrap ${className}`}>
      <WhatsAppLogo />
      Per WhatsApp buchen
    </a>
  );
};
