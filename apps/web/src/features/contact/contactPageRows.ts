import { MAX_VISITOR_TIME_ZONES, VISITOR_TIME_ZONES } from "@ttn/config/visitorTimeZones";
import { z } from "zod";

import { isRichTextEmpty } from "@ttn/ui/lib/richText";

import { readPageRichText } from "@/features/site-pages/pageRichText";
import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import { listOf } from "@/lib/jsonList";
import type { WebSitePageRow } from "@/lib/supabase/database.types";

import type { ContactPageContent, VisitorZone } from "./types";

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

/** The web_site_pages row of the Contact page, as the page shows it; broken or empty items are left out. */
export const toContactPage = (row: WebSitePageRow, photosBaseUrl: string): ContactPageContent => {
  const content = contentSchema.catch(contentSchema.parse({})).parse(row.content ?? {});
  return {
    top: toSitePageTop(row, photosBaseUrl, "Kathmandu"),
    replyTimes: content.replyTimes,
    officeDirections: content.officeDirections,
    nextSteps: listOf(content.nextSteps, z.object({ when: text, title: required, text })).slice(0, MAX_NEXT_STEPS),
    faqs: listOf(content.faqs, z.object({ question: required, answer: z.unknown().transform(readPageRichText) })).filter((faq) => !isRichTextEmpty(faq.answer)),
    timeZones: visitorZones([...new Set(content.timeZones)]),
    timeNote: content.timeNote,
    faqHeading: content.faqHeading,
  };
};
