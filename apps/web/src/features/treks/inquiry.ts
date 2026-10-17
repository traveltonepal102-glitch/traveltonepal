import { getWhatsAppUrl } from "@ttn/config/contact";

import type { TrekSummary } from "./types";

/** WhatsApp chat that opens with a message naming the trek. */
export const trekInquiryUrl = (trek: Pick<TrekSummary, "name">) =>
  getWhatsAppUrl(`Hello! I would like to know more about the ${trek.name}.`);
