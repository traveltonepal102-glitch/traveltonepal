import { z } from "zod";

import { photoSelectionSchema, readPhotoSelection } from "@/features/photos/schemas/photoSelectionSchema";
import { optionalWholeNumber, readList, readText, requiredText, slugField, text } from "@/lib/forms/formFields";
import { isRichTextEmpty, richTextField } from "@/lib/richText/richText";

import {
  MAX_BEST_FOR,
  MAX_COMPARE_REGIONS,
  MAX_FAQS,
  MAX_NEARBY_TREKS,
  MAX_PINNED_ARTICLES,
  MAX_WHY_POINTS,
  REGION_DIFFICULTY_VALUES,
  REGION_LIMITS as LIMIT,
  WHY_POINT_ICON_VALUES,
} from "../constants";
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

/** A "why trek here" card needs a title and a line; a fully empty card is ignored. */
const whyPointsSchema = z
  .array(
    z.object({ icon: z.enum(WHY_POINT_ICON_VALUES, "Pick an icon."), title: text(LIMIT.whyTitle), text: text(LIMIT.whyText) }).superRefine((point, context) => {
      if (Boolean(point.title) === Boolean(point.text)) return;
      const missing = point.title ? "text" : "title";
      context.addIssue({ code: "custom", path: [missing], message: `Write the ${missing}, or remove this card.` });
    }),
  )
  .transform((points) => points.filter((point) => point.title))
  .refine((points) => points.length <= MAX_WHY_POINTS, `Up to ${MAX_WHY_POINTS} cards.`);

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
    shortName: text(LIMIT.shortName),
    summary: text(LIMIT.summary),
    heroHighlight: text(LIMIT.heroHighlight),
    overviewHeading: text(LIMIT.overviewHeading),
    whyPoints: whyPointsSchema,
    maxAltitudeM: optionalWholeNumber({ min: 500, max: 9000, label: "highest point" }),
    trekLength: text(LIMIT.fact),
    difficulty: z
      .string()
      .transform((value) => value || null)
      .pipe(z.enum(REGION_DIFFICULTY_VALUES, "Pick the difficulty.").nullable()),
    gettingThere: text(LIMIT.fact),
    isFlight: z.enum(["drive", "fly"]).transform((value) => value === "fly"),
    gettingThereDetails: text(LIMIT.factDetails),
    permits: text(LIMIT.fact),
    fromKathmandu: text(LIMIT.fromKathmandu),
    nearestAirport: text(LIMIT.nearestAirport),
    permitsDetails: text(LIMIT.permitsDetails),
    whereYouSleep: text(LIMIT.whereYouSleep),
    compareRegionIds: z
      .array(z.uuid("Pick the regions from the list."))
      .transform((ids) => [...new Set(ids)])
      .refine((ids) => ids.length <= MAX_COMPARE_REGIONS, `Pick up to ${MAX_COMPARE_REGIONS} regions.`),
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
    featuredTrekId: z
      .string()
      .transform((value) => value || null)
      .pipe(z.uuid("Pick the featured trek from the list.").nullable()),
    featuredTrekLabel: text(LIMIT.featuredTrekLabel),
    featuredTrekPitch: text(LIMIT.featuredTrekPitch),
    nearbyTreks: z
      .array(z.object({ trekId: z.uuid("Pick the nearby treks from the list."), label: text(LIMIT.nearbyLabel), note: text(LIMIT.nearbyNote) }))
      .refine((treks) => new Set(treks.map((trek) => trek.trekId)).size === treks.length, "A trek is in the list twice. Remove one.")
      .refine((treks) => treks.length <= MAX_NEARBY_TREKS, `Suggest up to ${MAX_NEARBY_TREKS} nearby treks.`),
    customRoutePitch: text(LIMIT.customRoutePitch),
    pinnedArticleIds: z
      .array(z.uuid("Pin travel guides from the list."))
      .transform((ids) => [...new Set(ids)])
      .refine((ids) => ids.length <= MAX_PINNED_ARTICLES, `Pin up to ${MAX_PINNED_ARTICLES} travel guides.`),
    // The switches send the guides that show; the region stores the ones it hides.
    guidesListed: z.array(z.uuid()),
    guidesShown: z.array(z.uuid()),
    photos: photoSelectionSchema("region"),
  })
  .superRefine((values, context) => {
    // A pin needs both numbers (the database checks this too).
    if ((values.latitude === null) === (values.longitude === null)) return;
    const missing = values.latitude === null ? "latitude" : "longitude";
    context.addIssue({ code: "custom", path: [missing], message: "Enter both latitude and longitude, or neither." });
  })
  .transform(({ guidesListed, guidesShown, ...values }) => ({
    ...values,
    hiddenGuideIds: [...new Set(guidesListed.filter((id) => !guidesShown.includes(id)))],
  })) satisfies z.ZodType<RegionFormValues, unknown>;

/** "Why trek here" cards in FormData: whyIcon, whyTitle and whyText, one of each per card in order. */
const readWhyPoints = (formData: FormData) => {
  const icons = readList(formData, "whyIcon");
  const texts = readList(formData, "whyText");
  return readList(formData, "whyTitle").map((title, index) => ({ icon: icons[index] ?? "", title, text: texts[index] ?? "" }));
};

/** Nearby treks in FormData: nearbyTrekId, nearbyTrekLabel and nearbyTrekNote, one of each per row in order. */
const readNearbyTreks = (formData: FormData) => {
  const labels = readList(formData, "nearbyTrekLabel");
  const notes = readList(formData, "nearbyTrekNote");
  return readList(formData, "nearbyTrekId").map((trekId, index) => ({ trekId, label: labels[index] ?? "", note: notes[index] ?? "" }));
};

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
    shortName: readText(formData, "shortName"),
    summary: readText(formData, "summary"),
    heroHighlight: readText(formData, "heroHighlight"),
    overviewHeading: readText(formData, "overviewHeading"),
    whyPoints: readWhyPoints(formData),
    maxAltitudeM: readText(formData, "maxAltitudeM"),
    trekLength: readText(formData, "trekLength"),
    difficulty: readText(formData, "difficulty"),
    gettingThere: readText(formData, "gettingThere"),
    isFlight: readText(formData, "access") || "drive",
    gettingThereDetails: readText(formData, "gettingThereDetails"),
    permits: readText(formData, "permits"),
    fromKathmandu: readText(formData, "fromKathmandu"),
    nearestAirport: readText(formData, "nearestAirport"),
    permitsDetails: readText(formData, "permitsDetails"),
    whereYouSleep: readText(formData, "whereYouSleep"),
    compareRegionIds: readList(formData, "compareRegionId"),
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
    featuredTrekId: readText(formData, "featuredTrekId"),
    featuredTrekLabel: readText(formData, "featuredTrekLabel"),
    featuredTrekPitch: readText(formData, "featuredTrekPitch"),
    nearbyTreks: readNearbyTreks(formData),
    customRoutePitch: readText(formData, "customRoutePitch"),
    pinnedArticleIds: readList(formData, "pinnedArticleId"),
    guidesListed: readList(formData, "regionGuideListed"),
    guidesShown: readList(formData, "regionGuideShown"),
    photos: readPhotoSelection(formData),
  };
};
