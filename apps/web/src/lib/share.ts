/**
 * Links that let a visitor share a page with someone else. Not the office contact links
 * (those are getWhatsAppUrl / getEmailUrl in @ttn/config/contact).
 */

/** WhatsApp's "send to…" picker with the text ready, e.g. a title and its URL. */
export const whatsAppShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

/** A new email with no recipient, the subject and body filled in. */
export const emailShareUrl = ({ subject, body }: { subject: string; body: string }) =>
  // encodeURIComponent, not URLSearchParams: mail apps show URLSearchParams' "+" literally instead of spaces.
  `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
