import { getWhatsAppUrl } from "@ttn/config/contact";

/** WhatsApp chat that opens with a message about trekking in the region. */
export const regionInquiryUrl = (regionName: string) =>
  getWhatsAppUrl(`Hello! I would like to plan a trek in the ${regionName} region.`);
