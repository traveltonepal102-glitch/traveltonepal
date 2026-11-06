import { buildTripMessage as buildMessage } from "@ttn/site-data/tripMessage";
import type { TripDetails } from "@ttn/site-data/tripMessage";

import { SITE_NAME } from "@/lib/site";

export * from "@ttn/site-data/tripMessage";

/** The visitor's trip as the message they send us on WhatsApp or by email. */
export const buildTripMessage = (trip: TripDetails): string => buildMessage(trip, SITE_NAME);
