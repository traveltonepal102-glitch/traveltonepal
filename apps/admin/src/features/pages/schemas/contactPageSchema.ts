import { MAX_VISITOR_TIME_ZONES, VISITOR_TIME_ZONES } from "@ttn/config/visitorTimeZones";
import { z } from "zod";

import { readList, readText, text } from "@/lib/forms/formFields";
import { isRichTextEmpty, richTextField } from "@/lib/richText/richText";

import { MAX_CONTACT_FAQS, NEXT_STEP_ROWS, PAGE_LIMITS as LIMIT } from "../constants";
import type { ContactPageValues } from "../types";
import { optionalRows, pageTopFields, readPageTop, readRows } from "./pageTopSchema";

const step = z.object({ when: text(LIMIT.stepWhen), title: text(LIMIT.stepTitle), text: text(LIMIT.stepText) });

/** A question and its answer: both, or neither (an empty row is left out); each question once. */
const faqs = z
  .array(z.object({ question: text(LIMIT.faqQuestion), answer: richTextField(LIMIT.faqAnswer) }))
  .superRefine((rows, context) =>
    rows.forEach((row, index) => {
      const hasAnswer = !isRichTextEmpty(row.answer);
      if (Boolean(row.question) === hasAnswer) return;
      const missing = row.question ? "answer" : "question";
      context.addIssue({ code: "custom", path: [index, missing], message: `Write the ${missing}, or remove the ${missing === "answer" ? "question" : "answer"}.` });
    }),
  )
  .superRefine((rows, context) =>
    rows.forEach((row, index) => {
      const isRepeat = row.question && rows.findIndex((other) => other.question.toLowerCase() === row.question.toLowerCase()) < index;
      if (isRepeat) context.addIssue({ code: "custom", path: [index, "question"], message: "This question is already in the list." });
    }),
  )
  .transform((rows) => rows.filter((row) => row.question))
  .refine((rows) => rows.length <= MAX_CONTACT_FAQS, `Up to ${MAX_CONTACT_FAQS} questions.`);

/** Pages › Contact, checked on the server before saving. */
export const contactPageSchema = z.object({
  ...pageTopFields,
  replyWhatsApp: text(LIMIT.replyTime),
  replyEmail: text(LIMIT.replyTime),
  nextSteps: optionalRows(step, NEXT_STEP_ROWS, "Give the step a title, or clear it."),
  officeDirections: text(LIMIT.officeDirections),
  timeZones: z
    .array(z.string())
    .transform((zones) => VISITOR_TIME_ZONES.map((zone) => zone.timeZone).filter((zone) => zones.includes(zone)))
    .refine((zones) => zones.length <= MAX_VISITOR_TIME_ZONES, `Pick up to ${MAX_VISITOR_TIME_ZONES} places.`),
  timeNote: text(LIMIT.timeNote),
  faqHeading: text(LIMIT.sectionHeading),
  faqs,
}) satisfies z.ZodType<ContactPageValues, unknown>;

/** The Contact form's FormData as the schema expects it (questions come from FaqListEditor: faqQuestion, faqAnswer). */
export const readContactForm = (formData: FormData) => ({
  ...readPageTop(formData),
  replyWhatsApp: readText(formData, "replyWhatsApp"),
  replyEmail: readText(formData, "replyEmail"),
  nextSteps: readRows(formData, "step", ["when", "title", "text"] as const),
  officeDirections: readText(formData, "officeDirections"),
  timeZones: readList(formData, "timeZone"),
  timeNote: readText(formData, "timeNote"),
  faqHeading: readText(formData, "faqHeading"),
  faqs: readRows(formData, "faq", ["question", "answer"] as const),
});
