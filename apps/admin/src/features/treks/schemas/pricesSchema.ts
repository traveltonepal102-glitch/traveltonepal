import { z } from "zod";

import { readList, requiredText, text, wholeNumber } from "@/lib/forms/formFields";

import { MAX_GROUP_PRICES, PRICE_LIMITS as LIMIT } from "../constants";

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
