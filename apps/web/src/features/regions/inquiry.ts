import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

const inquiryMessage = (regionName: string) => `Hello! I would like to plan a trek in the ${regionName} region.`;

/** WhatsApp chat that opens with a message about trekking in the region. */
export const regionInquiryUrl = (regionName: string) => getWhatsAppUrl(inquiryMessage(regionName));

/** The same question by email, the region in the subject. */
export const regionInquiryEmailUrl = (regionName: string) =>
  getEmailUrl({ subject: `Planning a trek in the ${regionName} region`, body: inquiryMessage(regionName) });
