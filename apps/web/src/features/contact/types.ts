import type { ContactContent } from "@ttn/site-data/contactContent";

import type { SitePageTop } from "@/features/site-pages/types";

export type { ContactFaqItem, NextStep } from "@ttn/site-data/contactContent";
export type { VisitorZone } from "@ttn/site-data/officeHours";

/** The Contact page as saved in the admin's Pages › Contact (contact details themselves are in Site settings). */
export type ContactPageContent = ContactContent & {
  /** `eyebrow` is the green line above the heading while the office is open. */
  top: SitePageTop;
};
