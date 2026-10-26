import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { SitePageTop } from "@/features/site-pages/types";

export type NextStep = { when: string; title: string; text: string };

export type ContactFaqItem = { question: string; answer: RichTextDoc };

/** A place the Contact page shows the office hours for ("Time difference"). */
export type VisitorZone = { place: string; timeZone: string };

/** The Contact page as saved in the admin's Pages › Contact (contact details themselves are in Site settings). */
export type ContactPageContent = {
  /** `eyebrow` is the green line above the heading while the office is open. */
  top: SitePageTop;
  replyTimes: { whatsApp: string; email: string };
  /** Short directions under the office address; "" for none. */
  officeDirections: string;
  nextSteps: NextStep[];
  faqs: ContactFaqItem[];
  timeZones: VisitorZone[];
  /** The line under the time difference table; "" uses the design's wording. */
  timeNote: string;
  /** "" uses the design's wording. */
  faqHeading: string;
};
