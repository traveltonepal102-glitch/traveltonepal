import { getWhatsAppUrl } from "@ttn/config/contact";

import type { TrekSummary } from "./types";

/** WhatsApp chat that opens with a message naming the trek. */
export const trekInquiryUrl = (trek: Pick<TrekSummary, "name">) =>
  getWhatsAppUrl(`Hello! I would like to know more about the ${trek.name}.`);

/** WhatsApp chat about changing the standard itinerary of this trek. */
export const trekCustomizeUrl = (trek: Pick<TrekSummary, "name">) =>
  getWhatsAppUrl(`Hello! I would like to customize the ${trek.name} (dates, pace or side trips).`);

/** WhatsApp chat asking a named person for the free fitness and readiness check before this trek. */
export const trekReadinessCheckUrl = (trek: Pick<TrekSummary, "name">, contactName: string) =>
  getWhatsAppUrl(`Hello ${contactName}! I would like a free preparation check for the ${trek.name}. Am I fit and ready for it?`);
