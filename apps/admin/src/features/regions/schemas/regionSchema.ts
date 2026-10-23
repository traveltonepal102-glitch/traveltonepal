import { z } from "zod";

import { photoSelectionSchema, readPhotoSelection } from "@/features/photos/schemas/photoSelectionSchema";
import { readList, readText, requiredText, slugField, text } from "@/lib/forms/formFields";
import { isRichTextEmpty, richTextField } from "@/lib/richText/richText";

import { MAX_BEST_FOR, MAX_FAQS, REGION_LIMITS as LIMIT } from "../constants";
import type { RegionFormValues } from "../types";

/** Empty → null; otherwise a number in range (the database checks the same range). */
const coordinate = (min: number, max: number, example: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .pipe(
      z
        .number({ error: `Enter a number, like ${example}.` })
        .min(min, `In Nepal this is between ${min} and ${max}.`)
        .max(max, `In Nepal this is between ${min} and ${max}.`)
        .nullable(),
    );

/** A row needs both parts; a fully empty row is ignored. Errors keep the row number shown in the editor. */
const faqRowSchema = z
  .object({ question: text(LIMIT.faqQuestion), answer: richTextField(LIMIT.faqAnswer) })
  .superRefine((faq, context) => {
    const hasAnswer = !isRichTextEmpty(faq.answer);
    if (Boolean(faq.question) === hasAnswer) return;
    const missing = faq.question ? "answer" : "question";
    context.addIssue({ code: "custom", path: [missing], message: `Write the ${missing}, or remove this row.` });
  });

const faqsSchema = z
  .array(faqRowSchema)
  .transform((rows) => rows.filter((row) => row.question))
  .refine((rows) => rows.length <= MAX_FAQS, `Keep it to ${MAX_FAQS} questions.`);

/** The region editor's form (read with readRegionForm). Checked again on the server before saving. */
export const regionSchema = z
  .object({
    name: requiredText(LIMIT.name, "Enter the region name."),
    district: text(LIMIT.district),
    slug: slugField("mardi-himal"),
    latitude: coordinate(26, 31, "28.2100"),
    longitude: coordinate(80, 89, "85.5600"),
    pinLabel: text(LIMIT.pinLabel),
    tagline: text(LIMIT.tagline),
    introduction: richTextField(LIMIT.introduction),
    bestFor: z
      .array(text(LIMIT.bestForItem))
      .transform((items) => [...new Set(items.filter(Boolean))])
      .pipe(z.array(z.string()).max(MAX_BEST_FOR, `Pick up to ${MAX_BEST_FOR}.`)),
    highestPoint: text(LIMIT.fact),
    trekLength: text(LIMIT.fact),
    difficulty: text(LIMIT.fact),
    gettingThere: text(LIMIT.fact),
    gettingThereDetails: text(LIMIT.factDetails),
    permits: text(LIMIT.fact),
    monthRatings: z.array(z.enum(["best", "possible", "avoid"])).length(12, "Rate all 12 months."),
    seasons: z.object({
      spring: text(LIMIT.seasonNote),
      monsoon: text(LIMIT.seasonNote),
      autumn: text(LIMIT.seasonNote),
      winter: text(LIMIT.seasonNote),
    }),
    faqs: faqsSchema,
    seoKeyword: text(LIMIT.seoKeyword),
    seoTitle: text(LIMIT.seoTitle),
    seoDescription: text(LIMIT.seoDescription),
    photos: photoSelectionSchema("region"),
  })
  .superRefine((values, context) => {
    // A pin needs both numbers (the database checks this too).
    if ((values.latitude === null) === (values.longitude === null)) return;
    const missing = values.latitude === null ? "latitude" : "longitude";
    context.addIssue({ code: "custom", path: [missing], message: "Enter both latitude and longitude, or neither." });
  }) satisfies z.ZodType<RegionFormValues, unknown>;

/** The editor's FormData as the schema expects it. */
export const readRegionForm = (formData: FormData) => {
  const questions = readList(formData, "faqQuestion");
  const answers = readList(formData, "faqAnswer");

  return {
    name: readText(formData, "name"),
    district: readText(formData, "district"),
    slug: readText(formData, "slug"),
    latitude: readText(formData, "latitude"),
    longitude: readText(formData, "longitude"),
    pinLabel: readText(formData, "pinLabel"),
    tagline: readText(formData, "tagline"),
    introduction: readText(formData, "introduction"),
    bestFor: readList(formData, "bestFor"),
    highestPoint: readText(formData, "highestPoint"),
    trekLength: readText(formData, "trekLength"),
    difficulty: readText(formData, "difficulty"),
    gettingThere: readText(formData, "gettingThere"),
    gettingThereDetails: readText(formData, "gettingThereDetails"),
    permits: readText(formData, "permits"),
    monthRatings: readList(formData, "monthRatings"),
    seasons: {
      spring: readText(formData, "seasons.spring"),
      monsoon: readText(formData, "seasons.monsoon"),
      autumn: readText(formData, "seasons.autumn"),
      winter: readText(formData, "seasons.winter"),
    },
    faqs: questions.map((question, index) => ({ question, answer: answers[index] ?? "" })),
    seoKeyword: readText(formData, "seoKeyword"),
    seoTitle: readText(formData, "seoTitle"),
    seoDescription: readText(formData, "seoDescription"),
    photos: readPhotoSelection(formData),
  };
};
