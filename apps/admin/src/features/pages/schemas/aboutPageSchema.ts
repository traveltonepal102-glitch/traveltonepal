import { z } from "zod";

import { readList, readText, text } from "@/lib/forms/formFields";
import { richTextField } from "@/lib/richText/richText";

import { MAX_MILESTONES, MAX_STORY_PHOTOS, PAGE_LIMITS as LIMIT, PROMISE_ICONS, PROMISE_ROWS } from "../constants";
import type { AboutPageValues } from "../types";
import { optionalId, optionalRows, pageTopFields, readPageTop, readRows } from "./pageTopSchema";

const milestone = z.object({ year: text(LIMIT.milestoneYear), title: text(LIMIT.milestoneTitle), text: text(LIMIT.milestoneText) });

const promise = z.object({
  icon: z.string().refine((icon) => PROMISE_ICONS.some((choice) => choice.value === icon), "Pick an icon."),
  title: text(LIMIT.promiseTitle),
  text: text(LIMIT.promiseText),
});

const sectionHeading = text(LIMIT.sectionHeading);
const sectionIntro = text(LIMIT.sectionIntro);

/** Pages › About, checked on the server before saving. */
export const aboutPageSchema = z.object({
  ...pageTopFields,
  trekkersGuided: text(LIMIT.trekkersGuided),
  storyHeading: sectionHeading,
  storyText: richTextField(LIMIT.storyText),
  storyTeaser: text(LIMIT.storyTeaser),
  quote: text(LIMIT.quote),
  founderAuthorId: optionalId,
  storyPhotoIds: z
    .array(optionalId)
    .transform((ids) => [...new Set(ids.filter((id): id is string => id !== null))])
    .refine((ids) => ids.length <= MAX_STORY_PHOTOS, `Up to ${MAX_STORY_PHOTOS} photos.`),
  milestones: optionalRows(milestone, MAX_MILESTONES, "Give the moment a title, or remove it."),
  promisesHeading: sectionHeading,
  promisesIntro: sectionIntro,
  promises: optionalRows(promise, PROMISE_ROWS, "Give the promise a title, or clear its text."),
  teamHeading: sectionHeading,
  teamIntro: sectionIntro,
  reviewsHeading: sectionHeading,
  licencesHeading: sectionHeading,
  licencesIntro: sectionIntro,
}) satisfies z.ZodType<AboutPageValues, unknown>;

/** The About form's FormData as the schema expects it. */
export const readAboutForm = (formData: FormData) => ({
  ...readPageTop(formData),
  trekkersGuided: readText(formData, "trekkersGuided"),
  storyHeading: readText(formData, "storyHeading"),
  storyText: readText(formData, "storyText"),
  storyTeaser: readText(formData, "storyTeaser"),
  quote: readText(formData, "quote"),
  founderAuthorId: readText(formData, "founderAuthorId"),
  storyPhotoIds: readList(formData, "storyPhotoId"),
  milestones: readRows(formData, "milestone", ["year", "title", "text"] as const),
  promisesHeading: readText(formData, "promisesHeading"),
  promisesIntro: readText(formData, "promisesIntro"),
  promises: readRows(formData, "promise", ["icon", "title", "text"] as const),
  teamHeading: readText(formData, "teamHeading"),
  teamIntro: readText(formData, "teamIntro"),
  reviewsHeading: readText(formData, "reviewsHeading"),
  licencesHeading: readText(formData, "licencesHeading"),
  licencesIntro: readText(formData, "licencesIntro"),
});
