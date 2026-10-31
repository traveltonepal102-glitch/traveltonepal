import { z } from "zod";

import { libraryVideoId } from "@/features/videos/schemas/videoSchema";
import { requiredText, text } from "@/lib/forms/formFields";
import { isRichTextEmpty } from "@/lib/richText/richText";

import {
  COMPARE_TREKS,
  MAX_CHECK_ITEMS,
  MAX_COST_ROWS,
  MAX_DAYS_SHOWN,
  MAX_FAQ_ITEMS,
  MAX_GALLERY_PHOTOS,
  MAX_SECTIONS,
  MEET_GUIDES,
  SECTION_KINDS,
  SECTION_LIMITS as LIMIT,
} from "../sectionKinds";
import type { ArticleSection } from "../types";
import { embedSection, htmlSection } from "./htmlAndEmbedSchemas";
import { pickedId, pickedIds, richText, sectionId } from "./sectionFields";
import { tableSection } from "./tableSchema";

const costRow = z.object({ item: text(LIMIT.costItem), price: text(LIMIT.costPrice) }).superRefine((row, context) => {
  if (Boolean(row.item) === Boolean(row.price)) return;
  context.addIssue({ code: "custom", path: [row.item ? "price" : "item"], message: "Write the item and its price, or remove the line." });
});

const faqItem = z
  .object({ question: text(LIMIT.question), answer: richText(LIMIT.answer) })
  .superRefine((item, context) => {
    const hasAnswer = !isRichTextEmpty(item.answer);
    if (Boolean(item.question) === hasAnswer) return;
    if (item.question) context.addIssue({ code: "custom", path: ["answer"], message: "Write the answer, or remove this question." });
    else context.addIssue({ code: "custom", path: ["question"], message: "Write the question, or remove it." });
  });

const sectionSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      id: sectionId,
      type: z.literal("text"),
      heading: z.string().trim().min(1, "Write the heading.").max(LIMIT.heading, `Use ${LIMIT.heading} characters or fewer.`),
      tocLabel: text(LIMIT.tocLabel),
      body: richText(LIMIT.text, "Write the text, or remove this section."),
    }),
    z.object({ id: sectionId, type: z.literal("paragraph"), body: richText(LIMIT.text, "Write the text, or remove this section.") }),
    z.object({ id: sectionId, type: z.literal("quick"), body: richText(LIMIT.quickAnswer, "Write the answer, or remove this section.") }),
    z.object({
      id: sectionId,
      type: z.literal("callout"),
      tone: z.enum(["note", "warning"], "Pick note or warning."),
      body: richText(LIMIT.calloutText, "Write the note, or remove this section."),
    }),
    z.object({
      id: sectionId,
      type: z.literal("check"),
      heading: text(LIMIT.heading),
      items: z
        .array(text(LIMIT.checkItem))
        .transform((items) => items.filter(Boolean))
        .refine((items) => items.length > 0, "Add an item, or remove this section.")
        .refine((items) => items.length <= MAX_CHECK_ITEMS, `Up to ${MAX_CHECK_ITEMS} items.`),
    }),
    tableSection,
    htmlSection,
    z.object({
      id: sectionId,
      type: z.literal("months"),
      heading: requiredText(LIMIT.heading, "Write the heading."),
      view: z.enum(["strip", "table"], "Pick how the months show."),
    }),
    z.object({
      id: sectionId,
      type: z.literal("cta"),
      heading: requiredText(LIMIT.ctaHeading, "Write the heading."),
      buttonText: requiredText(LIMIT.ctaButton, "Write the button text."),
      message: requiredText(LIMIT.ctaMessage, "Write the message that opens in WhatsApp."),
    }),
    z.object({
      id: sectionId,
      type: z.literal("trek"),
      trekId: z
        .string()
        .nullable()
        .refine((value) => Boolean(value), "Pick the trek.")
        .pipe(z.uuid("Pick the trek from the list.")),
    }),
    z.object({ id: sectionId, type: z.literal("quote"), text: requiredText(LIMIT.quote, "Write the sentence.") }),
    z.object({
      id: sectionId,
      type: z.literal("days"),
      trekId: pickedId("Pick the trek."),
      dayIds: pickedIds(1, MAX_DAYS_SHOWN, `Pick 1 to ${MAX_DAYS_SHOWN} days.`),
    }),
    z.object({ id: sectionId, type: z.literal("altitude"), trekId: pickedId("Pick the trek."), heading: text(LIMIT.heading) }),
    z
      .object({
        id: sectionId,
        type: z.literal("cost"),
        heading: text(LIMIT.heading),
        rows: z
          .array(costRow)
          .transform((rows) => rows.filter((row) => row.item))
          .refine((rows) => rows.length > 0, "Add a cost, or remove this section.")
          .refine((rows) => rows.length <= MAX_COST_ROWS, `Up to ${MAX_COST_ROWS} lines.`),
        totalLabel: text(LIMIT.costTotalLabel),
        total: text(LIMIT.costPrice),
      })
      .refine((section) => Boolean(section.totalLabel) === Boolean(section.total), { path: ["total"], message: "Write the total and its label, or neither." }),
    z.object({
      id: sectionId,
      type: z.literal("compare"),
      trekIds: pickedIds(COMPARE_TREKS.min, COMPARE_TREKS.max, `Pick ${COMPARE_TREKS.min} or ${COMPARE_TREKS.max} treks.`),
    }),
    z.object({ id: sectionId, type: z.literal("tip"), guideId: pickedId("Pick the guide."), text: requiredText(LIMIT.tip, "Write the tip.") }),
    z.object({ id: sectionId, type: z.literal("gquote"), guideId: pickedId("Pick the guide."), text: requiredText(LIMIT.guideQuote, "Write the guide's words.") }),
    z.object({
      id: sectionId,
      type: z.literal("meet"),
      heading: text(LIMIT.heading),
      guideIds: pickedIds(MEET_GUIDES.min, MEET_GUIDES.max, `Pick ${MEET_GUIDES.min} to ${MEET_GUIDES.max} guides.`),
    }),
    z.object({
      id: sectionId,
      type: z.literal("image"),
      photoId: pickedId("Choose the photo."),
      caption: text(LIMIT.caption),
      alt: requiredText(LIMIT.photoAlt, "Describe the photo for Google and screen readers."),
    }),
    z.object({
      id: sectionId,
      type: z.literal("gallery"),
      photoIds: pickedIds(2, MAX_GALLERY_PHOTOS, `Choose 2 to ${MAX_GALLERY_PHOTOS} photos.`),
    }),
    z.object({ id: sectionId, type: z.literal("map"), title: text(LIMIT.mapTitle), place: requiredText(LIMIT.mapPlace, "Write the place for the map.") }),
    embedSection,
    z.object({
      id: sectionId,
      type: z.literal("video"),
      youtubeId: libraryVideoId,
      title: requiredText(LIMIT.videoTitle, "Write the video's title."),
    }),
    z.object({
      id: sectionId,
      type: z.literal("faq"),
      items: z
        .array(faqItem)
        .transform((items) => items.filter((item) => item.question))
        .refine((items) => items.length > 0, "Add a question, or remove this section.")
        .refine((items) => items.length <= MAX_FAQ_ITEMS, `Up to ${MAX_FAQ_ITEMS} questions.`),
    }),
  ],
  "This kind of section can't be saved yet.",
);

const ONCE_PER_ARTICLE = SECTION_KINDS.filter((kind) => kind.isOncePerArticle && kind.type);

/**
 * The article body, sent as one JSON field ("sections") in page order. Errors keep the section's number,
 * e.g. sections.2.heading. A quick answer and the questions for Google come once per article.
 */
export const sectionsField = z
  .string()
  .transform((json, context): unknown => {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      context.addIssue({ code: "custom", message: "The article body couldn't be read. Reload the page and try again." });
      return z.NEVER;
    }
  })
  .pipe(z.array(sectionSchema).max(MAX_SECTIONS, `Up to ${MAX_SECTIONS} sections.`))
  .superRefine((sections, context) => {
    for (const kind of ONCE_PER_ARTICLE) {
      if (sections.filter((section) => section.type === kind.type).length > 1) {
        context.addIssue({ code: "custom", message: `Only one “${kind.name}” section per guide.` });
      }
    }
  }) satisfies z.ZodType<ArticleSection[], unknown>;
