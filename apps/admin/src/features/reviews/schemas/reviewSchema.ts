import { z } from "zod";

import { readText, requiredText, text } from "@/lib/forms/formFields";
import { todayInNepal } from "@/utils/formatDateTime";

import { REVIEW_LIMITS as LIMIT, REVIEW_SOURCE_VALUES } from "../constants";
import type { ReviewRating, ReviewValues } from "../types";

const isOn = z.string().transform((value) => value === "on");

/** A review's own address on the review site (only https; the database checks the same). */
const reviewLink = z
  .string()
  .trim()
  .min(1, "Paste the link to this review: on Google, Share review › Copy link.")
  .max(LIMIT.url, `Use ${LIMIT.url} characters or fewer.`)
  .pipe(z.url({ protocol: /^https$/, error: "Paste the full link, starting with https://." }));

const stars = z
  .string()
  .transform(Number)
  .pipe(z.number().int().min(1, "Pick the stars the reviewer gave.").max(5, "Pick the stars the reviewer gave."));

/** "YYYY-MM-DD", a real day, not after today in Nepal. */
const reviewDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the date the review was written.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "Pick a real date.")
  .refine((value) => value >= "2000-01-01", "Pick a date from 2000 on.")
  .refine((value) => value <= todayInNepal(), "The date can't be in the future.");

const optionalId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid("Pick the trek from the list.").nullable());

/** The review form (read with readReviewForm). Checked again on the server before saving. */
export const reviewSchema = z.object({
  source: z.enum(REVIEW_SOURCE_VALUES, "Pick where the review was posted."),
  url: reviewLink,
  reviewerName: requiredText(LIMIT.name, "Enter the reviewer's name as the review site shows it."),
  reviewerCountry: text(LIMIT.country),
  rating: stars,
  title: text(LIMIT.title),
  quote: requiredText(LIMIT.quote, "Paste the review text, word for word."),
  reviewedOn: reviewDate,
  trekId: optionalId,
  isShown: isOn,
}) satisfies z.ZodType<ReviewValues, unknown>;

/** The review form's FormData as the schema expects it. */
export const readReviewForm = (formData: FormData) => ({
  source: readText(formData, "source"),
  url: readText(formData, "url"),
  reviewerName: readText(formData, "reviewerName"),
  reviewerCountry: readText(formData, "reviewerCountry"),
  rating: readText(formData, "rating"),
  title: readText(formData, "title"),
  quote: readText(formData, "quote"),
  reviewedOn: readText(formData, "reviewedOn"),
  trekId: readText(formData, "trekId"),
  isShown: readText(formData, "isShown"),
});

/** "4.9" or "4,9" → 4.9; one decimal, 1.0–5.0, as review sites show it. */
const overallRating = z
  .string()
  .trim()
  .transform((value) => Number(value.replace(",", ".")))
  .pipe(z.number("Enter the rating as a number, e.g. 4.9.").min(1, "The rating is between 1.0 and 5.0.").max(5, "The rating is between 1.0 and 5.0."))
  .refine((value) => Number.isInteger(value * 10), "Use one decimal, e.g. 4.9.");

const reviewCount = z
  .string()
  .trim()
  .transform((value) => Number(value.replace(/[,\s]/g, "")))
  .pipe(z.number("Enter the number of reviews.").int("Enter a whole number.").min(1, "Enter at least 1.").max(100000, "That's too many."));

/**
 * The overall ratings form: per review site, a rating and a count, both or neither (neither: not shown). Field
 * names are "<source>Rating" and "<source>Count".
 */
export const readRatingsForm = (formData: FormData) => {
  const ratings: ReviewRating[] = [];
  const fieldErrors: Record<string, string> = {};

  for (const source of REVIEW_SOURCE_VALUES) {
    const ratingText = readText(formData, `${source}Rating`).trim();
    const countText = readText(formData, `${source}Count`).trim();
    if (!ratingText && !countText) continue;
    if (!ratingText) fieldErrors[`${source}Rating`] = "Enter the rating too, or clear both.";
    if (!countText) fieldErrors[`${source}Count`] = "Enter the number of reviews too, or clear both.";
    if (!ratingText || !countText) continue;

    const rating = overallRating.safeParse(ratingText);
    const count = reviewCount.safeParse(countText);
    if (!rating.success) fieldErrors[`${source}Rating`] = rating.error.issues[0]?.message ?? "Check the rating.";
    if (!count.success) fieldErrors[`${source}Count`] = count.error.issues[0]?.message ?? "Check the number.";
    if (rating.success && count.success) ratings.push({ source, rating: rating.data, reviewCount: count.data });
  }

  return Object.keys(fieldErrors).length ? ({ ok: false, fieldErrors } as const) : ({ ok: true, ratings } as const);
};
