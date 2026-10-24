import { z } from "zod";

import { optionalWholeNumber, readList, requiredText, text, wholeNumber } from "@/lib/forms/formFields";
import { richTextField } from "@/lib/richText/richText";

import { MAX_DAYS, MEAL_VALUES, TREK_LIMITS as LIMIT } from "../constants";

const optionalId = (message: string) =>
  z
    .string()
    .transform((value) => value || null)
    .pipe(z.uuid(message).nullable());

/**
 * A day as the design asks for it: the sleep altitude, and the highest point only when the day goes higher
 * (a day hike up and back). Saved as before: altitudeM is the day's highest point, sleepAltitudeM only when lower.
 */
const daySchema = z
  .object({
    id: optionalId("A day couldn't be read. Reload the page and try again."),
    place: text(LIMIT.dayPlace),
    title: requiredText(LIMIT.dayTitle, "Write the day's title, or delete the day."),
    subtitle: text(LIMIT.daySubtitle),
    duration: text(LIMIT.dayDuration),
    topAltitude: optionalWholeNumber({ min: 0, max: 9000, label: "highest point" }),
    sleepAltitude: wholeNumber({ min: 0, max: 9000, label: "sleep altitude" }),
    meals: z
      .string()
      .transform((value) => value.split(",").filter(Boolean))
      .pipe(z.array(z.enum(MEAL_VALUES, "Pick the meals from the list.")))
      .transform((meals) => MEAL_VALUES.filter((meal) => meals.includes(meal))),
    isHighPoint: z.string().transform((value) => value === "true"),
    description: richTextField(LIMIT.dayDescription),
    photoId: optionalId("The day's photo couldn't be read. Pick it again."),
  })
  .superRefine((day, context) => {
    if (day.topAltitude === null || day.topAltitude > day.sleepAltitude) return;
    context.addIssue({ code: "custom", path: ["topAltitude"], message: "Only fill this in when the day goes higher than where you sleep." });
  })
  .transform(({ topAltitude, sleepAltitude, ...day }) => ({
    ...day,
    altitudeM: topAltitude ?? sleepAltitude,
    sleepAltitudeM: topAltitude === null ? null : sleepAltitude,
  }));

/** The day-by-day plan, in order. One highlight day at most (the database checks it too). */
export const itinerarySchema = z
  .array(daySchema)
  .max(MAX_DAYS, `A trek can have up to ${MAX_DAYS} days.`)
  .refine((days) => days.filter((day) => day.isHighPoint).length <= 1, "Only one day can be the highlight day.");

/** The days in the editor's FormData: one value per day for each day field, in order (meals: "breakfast,dinner"). */
export const readItinerary = (formData: FormData) => {
  const field = (name: string) => readList(formData, name);
  const [places, titles, subtitles, durations, tops, sleeps, meals, highPoints, descriptions, photoIds] = [
    "dayPlace",
    "dayTitle",
    "daySubtitle",
    "dayDuration",
    "dayTopAltitude",
    "daySleepAltitude",
    "dayMeals",
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
    topAltitude: tops[index] ?? "",
    sleepAltitude: sleeps[index] ?? "",
    meals: meals[index] ?? "",
    isHighPoint: highPoints[index] ?? "false",
    description: descriptions[index] ?? "",
    photoId: photoIds[index] ?? "",
  }));
};
