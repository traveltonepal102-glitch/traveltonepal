import { z } from "zod";

import { MAX_SLUG_LENGTH, SLUG_PATTERN } from "@/utils/slugify";

/** Trimmed text up to `max` characters ("" allowed). */
export const text = (max: number) => z.string().trim().max(max, `Use ${max} characters or fewer.`);

export const requiredText = (max: number, message: string) => text(max).min(1, message);

/** A web address part, e.g. "langtang-valley" (lowercased; the database checks the same pattern). */
export const slugField = (example: string) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter the web address.")
    .max(MAX_SLUG_LENGTH, `Use ${MAX_SLUG_LENGTH} characters or fewer.`)
    .regex(SLUG_PATTERN, `Use lowercase letters, numbers and dashes, like ${example}.`);

/** A real calendar day as "YYYY-MM-DD" (the date picker's format). */
export const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "Pick a real date.")
  .refine((value) => value >= "2020-01-01" && value <= "2100-12-31", "Pick a date between 2020 and 2100.");

type NumberRange = { min: number; max: number; label: string };

/** "4,773" or "4 773" → 4773 (people type numbers the way they read them). */
const toNumber = (value: string) => Number(value.replace(/[,\s]/g, ""));

const numberInRange = ({ min, max, label }: NumberRange) => {
  const rangeMessage = `The ${label} is between ${min.toLocaleString("en")} and ${max.toLocaleString("en")}.`;
  return z
    .number({ error: `Enter the ${label} as a number.` })
    .int(`Enter the ${label} as a whole number.`)
    .min(min, rangeMessage)
    .max(max, rangeMessage);
};

/** A required whole number typed in a form field, e.g. the number of days. */
export const wholeNumber = (range: NumberRange) =>
  z.string().trim().min(1, `Enter the ${range.label}.`).transform(toNumber).pipe(numberInRange(range));

/** An optional whole number: "" → null. */
export const optionalWholeNumber = (range: NumberRange) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : toNumber(value)))
    .pipe(numberInRange(range).nullable());

/** A form field's text ("" when missing or a file). */
export const readText = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

/** All values of a repeated form field, in order. */
export const readList = (formData: FormData, name: string) =>
  formData.getAll(name).filter((value): value is string => typeof value === "string");
