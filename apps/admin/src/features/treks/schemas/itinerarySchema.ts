import { z } from "zod";

import { optionalWholeNumber, readList, requiredText, text, wholeNumber } from "@/lib/forms/formFields";
import { richTextField } from "@/lib/richText/richText";

import { MAX_DAYS, TREK_LIMITS as LIMIT } from "../constants";

const optionalId = (message: string) =>
  z
    .string()
    .transform((value) => value || null)
    .pipe(z.uuid(message).nullable());

const daySchema = z
  .object({
    id: optionalId("A day couldn't be read. Reload the page and try again."),
    place: text(LIMIT.dayPlace),
    title: requiredText(LIMIT.dayTitle, "Write the day's title, or delete the day."),
    subtitle: text(LIMIT.daySubtitle),
    duration: text(LIMIT.dayDuration),
    altitudeM: wholeNumber({ min: 0, max: 9000, label: "highest point" }),
    sleepAltitudeM: optionalWholeNumber({ min: 0, max: 9000, label: "sleep altitude" }),
    isHighPoint: z.string().transform((value) => value === "true"),
    description: richTextField(LIMIT.dayDescription),
    photoId: optionalId("The day's photo couldn't be read. Pick it again."),
  })
  .superRefine((day, context) => {
    if (day.sleepAltitudeM === null || day.sleepAltitudeM <= day.altitudeM) return;
    context.addIssue({ code: "custom", path: ["sleepAltitudeM"], message: "The sleep altitude can't be higher than the day's highest point." });
  });

/** The day-by-day plan, in order. One highlight day at most (the database checks it too). */
export const itinerarySchema = z
  .array(daySchema)
  .max(MAX_DAYS, `A trek can have up to ${MAX_DAYS} days.`)
  .refine((days) => days.filter((day) => day.isHighPoint).length <= 1, "Only one day can be the highlight day.");

/** The days in the editor's FormData: one value per day for each day field, in order. */
export const readItinerary = (formData: FormData) => {
  const field = (name: string) => readList(formData, name);
  const [places, titles, subtitles, durations, altitudes, sleeps, highPoints, descriptions, photoIds] = [
    "dayPlace",
    "dayTitle",
    "daySubtitle",
    "dayDuration",
    "dayAltitude",
    "daySleepAltitude",
    "dayHighPoint",
    "dayDescription",
    "dayPhotoId",
  ].map(field);

  return field("dayId").map((id, index) => ({
    id,
    place: places[index] ?? "",
    title: titles[index] ?? "",
    subtitle: subtitles[index] ?? "",
    duration: durations[index] ?? "",
    altitudeM: altitudes[index] ?? "",
    sleepAltitudeM: sleeps[index] ?? "",
    isHighPoint: highPoints[index] ?? "false",
    description: descriptions[index] ?? "",
    photoId: photoIds[index] ?? "",
  }));
};
