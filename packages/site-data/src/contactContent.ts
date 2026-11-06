import { MAX_VISITOR_TIME_ZONES, VISITOR_TIME_ZONES } from "@ttn/config/visitorTimeZones";
import { isRichTextEmpty } from "@ttn/ui/lib/richText";
import type { RichTextDoc } from "@ttn/ui/lib/richText";
import { z } from "zod";

import { listOf } from "./jsonList";
import type { VisitorZone } from "./officeHours";
import { readPageRichText } from "./pageRichText";

export type NextStep = { when: string; title: string; text: string };

export type ContactFaqItem = { question: string; answer: RichTextDoc };

/** What only the Contact page has, as saved in the admin's Pages › Contact. */
export type ContactContent = {
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

const text = z.string().trim().catch("");
const required = z.string().trim().min(1);

const contentSchema = z.object({
  replyTimes: z.object({ whatsApp: text, email: text }).catch({ whatsApp: "", email: "" }),
  officeDirections: text,
  nextSteps: z.unknown().optional(),
  faqs: z.unknown().optional(),
  timeZones: z.array(z.string()).catch([]),
  timeNote: text,
  faqHeading: text,
});

const MAX_NEXT_STEPS = 3;

/** The saved time zones that are in the list, in the order picked (at most four). */
const visitorZones = (timeZones: readonly string[]): VisitorZone[] =>
  timeZones
    .flatMap((timeZone) => VISITOR_TIME_ZONES.filter((zone) => zone.timeZone === timeZone))
    .slice(0, MAX_VISITOR_TIME_ZONES)
    .map(({ place, timeZone }) => ({ place, timeZone }));

/** The Contact page's `content`, read leniently: broken or empty items are left out. */
export const readContactContent = (value: unknown): ContactContent => {
  const content = contentSchema.catch(contentSchema.parse({})).parse(value ?? {});
  return {
    replyTimes: content.replyTimes,
    officeDirections: content.officeDirections,
    nextSteps: listOf(content.nextSteps, z.object({ when: text, title: required, text })).slice(0, MAX_NEXT_STEPS),
    faqs: listOf(content.faqs, z.object({ question: required, answer: z.unknown().transform(readPageRichText) })).filter((faq) => !isRichTextEmpty(faq.answer)),
    timeZones: visitorZones([...new Set(content.timeZones)]),
    timeNote: content.timeNote,
    faqHeading: content.faqHeading,
  };
};
