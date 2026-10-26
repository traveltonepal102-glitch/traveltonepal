import { CONSENT_MAX_AGE_LABEL, CONSENT_STORAGE_KEY } from "@/features/consent/consent";

import type { SiteSettings } from "@/features/site-settings/types";

import { companyLegalName } from "../legalCompany";
import type { LegalDoc } from "../types";

/**
 * Template from the website design (Legal.dc.html), corrected to what this website really does: no
 * analytics, no click counting and no video embeds (add them here, and in the cookie settings,
 * before adding them to the site). [BRACKETED] values wait for the owner and a data protection specialist.
 */
export const privacyDoc = (settings: SiteSettings): LegalDoc => ({
  slug: "privacy",
  title: "Privacy policy",
  updated: "[DATE]",
  intro: "How we handle your personal data when you visit this website or contact us. In short: we collect as little as possible.",
  ownerNote: "Template text. Have this policy checked by a data protection specialist before going live.",
  sections: [
    {
      id: "controller",
      heading: "Who is responsible",
      paragraphs: [
        `${companyLegalName(settings)}, ${settings.contact.officeAddress}. Email: ${settings.contact.email}. [EU representative under Art. 27 GDPR, if required: NAME, ADDRESS].`,
      ],
    },
    {
      id: "what-we-do-not-do",
      heading: "What this website does not do",
      list: [
        "There are no user accounts and no online payments on this website.",
        "Our contact and booking request forms do not send or store anything on our servers. They only open WhatsApp or your email app with your message.",
        "We do not use analytics, advertising or tracking tools.",
        "Fonts are hosted on our own server, so no data goes to Google Fonts.",
      ],
    },
    {
      id: "server-logs",
      heading: "Server log files",
      paragraphs: [
        "When you open a page, our hosting provider automatically records technical data such as IP address, date and time, page and browser. This is needed to deliver the site securely (Art. 6(1)(f) GDPR) and is deleted after [N] days. Hosting: [PROVIDER], [REGION].",
      ],
    },
    {
      id: "contacting-us",
      heading: "Contacting us by WhatsApp or email",
      paragraphs: [
        "If you write to us, we use your name, contact details and message only to answer you and plan your trek (Art. 6(1)(b) GDPR). WhatsApp is a service of WhatsApp Ireland Ltd. (Meta); data may be transferred to the USA. If you prefer, contact us by email instead.",
      ],
    },
    {
      id: "cookies-and-maps",
      heading: "Cookies and Google Maps",
      paragraphs: [
        `This website sets no cookies of its own. It remembers your cookie choice in your browser's storage ("${CONSENT_STORAGE_KEY}", kept for ${CONSENT_MAX_AGE_LABEL}), which is needed to respect that choice.`,
        "Interactive Google Maps (Google Ireland Ltd.) load only after you click to load a map or allow external media in the cookie settings (Art. 6(1)(a) GDPR). Google then receives your IP address and may set cookies; data may be transferred to the USA. You can change your choice at any time under Cookie settings.",
      ],
    },
    {
      id: "retention",
      heading: "How long we keep data",
      paragraphs: [
        "We keep messages about a trek for as long as needed to plan it and to meet legal record-keeping duties in Nepal, then delete them. [RETENTION PERIODS].",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      paragraphs: [
        "You can ask us at any time for access to your data, correction, deletion, restriction or a copy (data portability), and you can object to processing or withdraw your consent. You also have the right to complain to a data protection supervisory authority, for example the one where you live.",
      ],
    },
  ],
});
