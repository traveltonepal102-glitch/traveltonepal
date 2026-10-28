import { z } from "zod";

import { readText, requiredText, text } from "@/lib/forms/formFields";

import { ADVENTURE_LIMITS as LIMIT, SECTION_LIMITS, STEP_COUNT } from "../constants";
import type { AdventureSectionValues, AdventureValues } from "../types";

const isOn = z.string().transform((value) => value === "on");

const position = z
  .string()
  .trim()
  .transform(Number)
  .pipe(z.number("Enter a number.").int("Enter a whole number.").min(1, "Use 1 or more.").max(LIMIT.position, `Use ${LIMIT.position} or less.`));

const photoId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid("Choose the photo again.").nullable());

/** The adventure form (read with readAdventureForm). Checked again on the server before saving. */
export const adventureSchema = z
  .object({
    title: requiredText(LIMIT.title, "Enter the adventure's name."),
    tag: text(LIMIT.tag),
    summary: requiredText(LIMIT.summary, "Write a sentence or two about it."),
    photoId,
    photoAlt: text(LIMIT.photoAlt),
    position,
    isShown: isOn,
  })
  .refine((values) => !values.isShown || values.photoId !== null, {
    path: ["photoId"],
    message: "Choose a photo before showing it on the website.",
  }) satisfies z.ZodType<AdventureValues, unknown>;

/** The adventure form's FormData as the schema expects it. */
export const readAdventureForm = (formData: FormData) => ({
  title: readText(formData, "title"),
  tag: readText(formData, "tag"),
  summary: readText(formData, "summary"),
  photoId: readText(formData, "photoId"),
  photoAlt: readText(formData, "photoAlt"),
  position: readText(formData, "position"),
  isShown: readText(formData, "isShown"),
});

const step = z.object({
  title: requiredText(SECTION_LIMITS.stepTitle, "Give the step a title."),
  text: text(SECTION_LIMITS.stepText),
});

/** The section's words (read with readSectionForm). Steps are "step1Title", "step1Text"… in the form. */
export const adventureSectionSchema = z.object({
  eyebrow: requiredText(SECTION_LIMITS.eyebrow, "Enter the small label above the heading."),
  heading: requiredText(SECTION_LIMITS.heading, "Enter the heading."),
  intro: text(SECTION_LIMITS.intro),
  askTitle: requiredText(SECTION_LIMITS.askTitle, "Enter the last card's title."),
  askText: text(SECTION_LIMITS.askText),
  stepsTitle: requiredText(SECTION_LIMITS.stepsTitle, "Enter the steps' heading."),
  steps: z.array(step).length(STEP_COUNT),
  note: text(SECTION_LIMITS.note),
}) satisfies z.ZodType<AdventureSectionValues, unknown>;

/** The step's field names: "step1Title", "step1Text" (1-based, as the form shows them). */
export const stepField = (index: number, part: "Title" | "Text") => `step${index + 1}${part}`;

/** The section form's FormData as the schema expects it. */
export const readSectionForm = (formData: FormData) => ({
  eyebrow: readText(formData, "eyebrow"),
  heading: readText(formData, "heading"),
  intro: readText(formData, "intro"),
  askTitle: readText(formData, "askTitle"),
  askText: readText(formData, "askText"),
  stepsTitle: readText(formData, "stepsTitle"),
  steps: Array.from({ length: STEP_COUNT }, (_, index) => ({
    title: readText(formData, stepField(index, "Title")),
    text: readText(formData, stepField(index, "Text")),
  })),
  note: readText(formData, "note"),
});
