/**
 * Office contact details: the ONE place to change them for every site
 * (TRD: constants in code, not admin settings). Header, footer, buttons and links all read from here.
 */
const PHONE_COUNTRY_CODE = "977"; // Nepal
const PHONE_LOCAL_NUMBER = "9843197197";

export const CONTACT = {
  email: "traveltonepal102@gmail.com",
  /** Shown to visitors, e.g. "+977 9843197197". */
  phoneDisplay: `+${PHONE_COUNTRY_CODE} ${PHONE_LOCAL_NUMBER}`,
  /** Digits only with country code, as wa.me and tel: links need it. */
  phoneDigits: `${PHONE_COUNTRY_CODE}${PHONE_LOCAL_NUMBER}`,
  /** Nepal government trekking agency registration number. TEMPORARY: replace with the real one. */
  registrationNumber: "123456",
} as const;

/** wa.me link that opens a WhatsApp chat with the office, with an optional first message. */
export const getWhatsAppUrl = (message?: string): string => {
  const base = `https://wa.me/${CONTACT.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const getEmailUrl = (): string => `mailto:${CONTACT.email}`;
