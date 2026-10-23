import { z } from "zod";

import { readList, requiredText, text, wholeNumber } from "@/lib/forms/formFields";

import { MAX_DEPARTURES, MAX_GROUP_PRICES, PRICE_LIMITS as LIMIT } from "../constants";

const optionalId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid("A row couldn't be read. Reload the page and try again.").nullable());

const groupPriceSchema = z.object({
  id: optionalId,
  label: requiredText(LIMIT.label, "Write the group size, e.g. 3–5 people."),
  shortLabel: requiredText(LIMIT.shortLabel, "Write a short label, e.g. 3–5 Pax."),
  priceUsd: wholeNumber({ min: 1, max: 100000, label: "price" }),
  team: text(LIMIT.team),
  isDefault: z.string().transform((value) => value === "true"),
});

/** Price per person by group size. With any rows, exactly one is "Most popular" (it is the "From" price). */
export const groupPricesSchema = z
  .array(groupPriceSchema)
  .max(MAX_GROUP_PRICES, `Up to ${MAX_GROUP_PRICES} group sizes.`)
  .refine((prices) => !prices.length || prices.filter((price) => price.isDefault).length === 1, "Choose the most popular group size.");

/** A real calendar day as "YYYY-MM-DD" (the date picker's format). */
const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "Pick a real date.")
  .refine((value) => value >= "2020-01-01" && value <= "2100-12-31", "Pick a date between 2020 and 2100.");

const departureSchema = z.object({
  id: optionalId,
  startDate: calendarDate,
  isGuaranteed: z.string().transform((value) => value === "true"),
  note: text(LIMIT.note),
});

/** Fixed departure dates, one per day (the database checks it too), sorted by date. */
export const departuresSchema = z
  .array(departureSchema)
  .max(MAX_DEPARTURES, `Up to ${MAX_DEPARTURES} dates.`)
  .superRefine((departures, context) => {
    const seen = new Set<string>();
    departures.forEach((departure, index) => {
      if (seen.has(departure.startDate)) {
        context.addIssue({ code: "custom", path: [index, "startDate"], message: "There is already a departure on this day." });
      }
      seen.add(departure.startDate);
    });
  })
  .transform((departures) => [...departures].sort((a, b) => a.startDate.localeCompare(b.startDate)));

/** The group price rows in the editor's FormData: one value per row for each field, in order. */
export const readGroupPrices = (formData: FormData) => {
  const [labels, shortLabels, prices, teams, defaults] = ["priceLabel", "priceShortLabel", "priceUsd", "priceTeam", "priceIsDefault"].map((name) =>
    readList(formData, name),
  );
  return readList(formData, "priceId").map((id, index) => ({
    id,
    label: labels[index] ?? "",
    shortLabel: shortLabels[index] ?? "",
    priceUsd: prices[index] ?? "",
    team: teams[index] ?? "",
    isDefault: defaults[index] ?? "false",
  }));
};

/** The departure rows in the editor's FormData. */
export const readDepartures = (formData: FormData) => {
  const [dates, guaranteed, notes] = ["departureDate", "departureGuaranteed", "departureNote"].map((name) => readList(formData, name));
  return readList(formData, "departureId").map((id, index) => ({
    id,
    startDate: dates[index] ?? "",
    isGuaranteed: guaranteed[index] ?? "false",
    note: notes[index] ?? "",
  }));
};
