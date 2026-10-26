import { z } from "zod";

import { EMPTY_RICH_TEXT, isRichTextEmpty, richTextDocSchema } from "@/lib/richText/richText";
import type { RichTextDoc } from "@/lib/richText/richText";

import { toLegalTextDoc } from "@/lib/richText/legalText";

import type { AboutPageValues, ContactPageValues, LegalPageValues, SitePage } from "../types";

/**
 * A saved page's `content` as the form's values. Lenient: a missing or broken part becomes empty, so an old or
 * hand-edited row still opens in the editor (the website reads it the same way).
 */
const text = z.string().catch("");
const list = <T>(item: z.ZodType<T>) => z.array(z.unknown()).catch([]).transform((items) => items.flatMap((entry) => item.safeParse(entry).data ?? []));

/** Plain paragraphs (how the first texts were saved) as a rich text document. */
const paragraphsDoc = (paragraphs: readonly string[]): RichTextDoc => {
  const filled = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  return filled.length ? { type: "doc", content: filled.map((paragraph) => ({ type: "paragraph", content: [{ type: "text", text: paragraph }] })) } : EMPTY_RICH_TEXT;
};

/** A rich text document, or plain text saved before it became one. */
const richText = z.unknown().transform((value): RichTextDoc => {
  if (typeof value === "string") return paragraphsDoc(value.split(/\n\s*\n/));
  const doc = richTextDocSchema.safeParse(value);
  return doc.success && !isRichTextEmpty(doc.data) ? doc.data : EMPTY_RICH_TEXT;
});

const milestone = z.object({ year: text, title: text, text });
const promise = z.object({ icon: text, title: text, text });
const step = z.object({ when: text, title: text, text });
const faq = z.object({ question: text, answer: richText });

const aboutFields = z.object({
  trekkersGuided: text,
  storyHeading: text,
  storyText: z.unknown().optional(),
  story: z.array(text).catch([]),
  storyTeaser: text,
  quote: text,
  milestones: list(milestone),
  promisesHeading: text,
  promisesIntro: text,
  promises: list(promise),
  teamHeading: text,
  teamIntro: text,
  reviewsHeading: text,
  licencesHeading: text,
  licencesIntro: text,
});
const aboutContent = aboutFields.catch(() => aboutFields.parse({}));

const contactFields = z.object({
  replyTimes: z.object({ whatsApp: text, email: text }).catch({ whatsApp: "", email: "" }),
  nextSteps: list(step),
  officeDirections: text,
  timeZones: z.array(z.string()).catch([]),
  timeNote: text,
  faqHeading: text,
  faqs: list(faq),
});
const contactContent = contactFields.catch(() => contactFields.parse({}));

export const toAboutValues = (page: SitePage): AboutPageValues => {
  const { storyText, story, ...content } = aboutContent.parse(page.content ?? {});
  return {
    ...page.top,
    ...content,
    storyText: storyText === undefined ? paragraphsDoc(story) : richText.parse(storyText),
    founderAuthorId: page.founderAuthorId,
    storyPhotoIds: page.storyPhotos.map((photo) => photo.id),
  };
};

export const toContactValues = (page: SitePage): ContactPageValues => {
  const { replyTimes, ...content } = contactContent.parse(page.content ?? {});
  return { ...page.top, ...content, replyWhatsApp: replyTimes.whatsApp, replyEmail: replyTimes.email };
};

/** The About form's values as the page's saved `content` (the website reads these keys). */
export const aboutContentOf = (values: AboutPageValues) => ({
  trekkersGuided: values.trekkersGuided,
  storyHeading: values.storyHeading,
  storyText: values.storyText,
  storyTeaser: values.storyTeaser,
  quote: values.quote,
  milestones: values.milestones,
  promisesHeading: values.promisesHeading,
  promisesIntro: values.promisesIntro,
  promises: values.promises,
  teamHeading: values.teamHeading,
  teamIntro: values.teamIntro,
  reviewsHeading: values.reviewsHeading,
  licencesHeading: values.licencesHeading,
  licencesIntro: values.licencesIntro,
});

/** The Contact form's values as the page's saved `content` (the website reads these keys). */
export const contactContentOf = (values: ContactPageValues) => ({
  replyTimes: { whatsApp: values.replyWhatsApp, email: values.replyEmail },
  nextSteps: values.nextSteps,
  officeDirections: values.officeDirections,
  timeZones: values.timeZones,
  timeNote: values.timeNote,
  faqHeading: values.faqHeading,
  faqs: values.faqs,
});

const legalFields = z.object({
  body: z.unknown().optional(),
  lawyerChecked: z.boolean().catch(false),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).catch(""),
  autoDate: z.boolean().catch(true),
});
const legalContent = legalFields.catch(() => legalFields.parse({}));

export const toLegalValues = (page: SitePage): LegalPageValues => {
  const { body, ...content } = legalContent.parse(page.content ?? {});
  return { heading: page.top.heading, intro: page.top.intro, body: toLegalTextDoc(body), ...content };
};

/** A legal page's values as its saved `content` (the website reads body, lawyerChecked and lastUpdated). */
export const legalContentOf = (values: LegalPageValues) => ({
  body: values.body,
  lawyerChecked: values.lawyerChecked,
  lastUpdated: values.lastUpdated,
  autoDate: values.autoDate,
});

/** True when a legal page's words differ from what is saved (only then does "set to today" move the date). */
export const legalWordsChanged = (saved: LegalPageValues, next: LegalPageValues) =>
  saved.heading !== next.heading || saved.intro !== next.intro || JSON.stringify(saved.body) !== JSON.stringify(next.body);
