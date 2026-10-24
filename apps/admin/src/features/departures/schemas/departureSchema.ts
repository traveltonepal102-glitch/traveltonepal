import { z } from "zod";

import { DEPARTURE_STATUS_VALUES, PRICE_LIMITS } from "@/features/treks/constants";
import { calendarDate, optionalWholeNumber, readText, text } from "@/lib/forms/formFields";

import { DEPARTURE_LIMITS } from "../constants";
import { MAX_REPEATED_DATES } from "../lib/dates";
import type { DepartureFormValues, NewDepartures } from "../types";

const trekId = z.uuid("Pick the trek.");
const status = z.enum(DEPARTURE_STATUS_VALUES, "Pick the date's status.");

/** "Add date" and "Edit" (read with readDepartureForm). Checked again on the server before saving. */
export const departureSchema = z.object({
  trekId,
  startDate: calendarDate,
  status,
  note: text(PRICE_LIMITS.note),
  specialPriceUsd: optionalWholeNumber({ min: 1, max: 100000, label: "special price" }),
  teamNote: text(DEPARTURE_LIMITS.teamNote),
}) satisfies z.ZodType<DepartureFormValues, unknown>;

export const readDepartureForm = (formData: FormData) => ({
  trekId: readText(formData, "trekId"),
  startDate: readText(formData, "startDate"),
  status: readText(formData, "status"),
  note: readText(formData, "note"),
  specialPriceUsd: readText(formData, "specialPriceUsd"),
  teamNote: readText(formData, "teamNote"),
});

/** Several dates for one trek (repeat, copy a season, copy to next year): each day once, up to 60. */
export const newDeparturesSchema = z.object({
  trekId,
  status,
  entries: z
    .array(z.object({ startDate: calendarDate, note: text(PRICE_LIMITS.note) }))
    .min(1, "Pick at least one date.")
    .max(MAX_REPEATED_DATES, `Up to ${MAX_REPEATED_DATES} dates at once.`)
    .refine((entries) => new Set(entries.map((entry) => entry.startDate)).size === entries.length, "A date is in the list twice."),
}) satisfies z.ZodType<NewDepartures, unknown>;
