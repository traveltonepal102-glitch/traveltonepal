import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import type { TrekSummary } from "./types";

type TrekName = Pick<TrekSummary, "name">;

const inquiryMessage = (trek: TrekName) => `Hello! I would like to know more about the ${trek.name}.`;
const readinessMessage = (trek: TrekName, contactName: string) =>
  `Hello ${contactName}! I would like a free preparation check for the ${trek.name}. Am I fit and ready for it?`;

/** WhatsApp chat that opens with a message naming the trek. */
export const trekInquiryUrl = (trek: TrekName) => getWhatsAppUrl(inquiryMessage(trek));

/** The same question by email, the trek in the subject. */
export const trekInquiryEmailUrl = (trek: TrekName) => getEmailUrl({ subject: `Question about the ${trek.name}`, body: inquiryMessage(trek) });

/** WhatsApp chat about changing the standard itinerary of this trek. */
export const trekCustomizeUrl = (trek: TrekName) =>
  getWhatsAppUrl(`Hello! I would like to customize the ${trek.name} (dates, pace or side trips).`);

/** WhatsApp chat asking a named person for the free fitness and readiness check before this trek. */
export const trekReadinessCheckUrl = (trek: TrekName, contactName: string) => getWhatsAppUrl(readinessMessage(trek, contactName));

/** The same readiness check asked by email. */
export const trekReadinessCheckEmailUrl = (trek: TrekName, contactName: string) =>
  getEmailUrl({ subject: `Preparation check for the ${trek.name}`, body: readinessMessage(trek, contactName) });
