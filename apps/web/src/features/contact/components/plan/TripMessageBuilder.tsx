"use client";

import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";

import { EMPTY_TRIP, buildTripMessage, tripEmailSubject } from "../../tripMessage";
import type { TripDetails } from "../../tripMessage";
import { CARD } from "../styles";
import { MessagePreview } from "./MessagePreview";
import { TripFields } from "./TripFields";

/**
 * "Tell us about your trip": the fields write a message, shown live in the preview. The buttons open
 * WhatsApp or the visitor's email app with it; nothing is sent to or stored by this website.
 */
export const TripMessageBuilder = ({ trekOptions }: { trekOptions: readonly string[] }) => {
  const [trip, setTrip] = useState<TripDetails>(EMPTY_TRIP);
  const message = buildTripMessage(trip);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className={`${CARD} flex flex-col gap-3.5 shadow-card`}>
        <TripFields trip={trip} trekOptions={trekOptions} onChange={(patch) => setTrip((current) => ({ ...current, ...patch }))} />
        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <ButtonLink href={getWhatsAppUrl(message)} variant="whatsapp" icon="whatsapp" shape="rounded" isExternal className="sm:flex-1">
            Send on WhatsApp
          </ButtonLink>
          <ButtonLink href={getEmailUrl({ subject: tripEmailSubject(trip), body: message })} variant="secondary" icon="mail" shape="rounded">
            Send by email
          </ButtonLink>
        </div>
        <p className="inline-flex items-start gap-1.5 text-xs text-muted-foreground">
          <Icon name="lock" size={14} className="mt-0.5 flex-none" />
          Nothing is stored on this website. The message goes straight to WhatsApp or your email app.
        </p>
      </div>
      <MessagePreview message={message} />
    </div>
  );
};
