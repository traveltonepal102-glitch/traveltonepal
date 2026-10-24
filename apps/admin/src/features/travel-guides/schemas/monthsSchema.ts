import { z } from "zod";

import { text } from "@/lib/forms/formFields";

import { emptyMonths } from "../constants";
import { CROWD_VALUES, SECTION_LIMITS as LIMIT } from "../sectionKinds";
import type { MonthEntry } from "../types";

const monthSchema = z.object({
  rating: z.enum(["best", "possible", "avoid"], "Pick Best, Possible or Not ideal."),
  onTheTrail: text(LIMIT.monthNote),
  crowds: z.union([z.literal(""), z.enum(CROWD_VALUES)], "Pick the crowds from the list."),
});

/** The guide's 12 months (Jan–Dec), sent as one JSON field ("months"; none sent: empty months). Errors keep the month: months.9.onTheTrail. */
export const monthsField = z
  .string()
  .transform((json, context): unknown => {
    if (!json) return emptyMonths();
    try {
      return JSON.parse(json);
    } catch {
      context.addIssue({ code: "custom", message: "The months couldn't be read. Reload the page and try again." });
      return z.NEVER;
    }
  })
  .pipe(z.array(monthSchema).length(12, "Fill in all 12 months.")) satisfies z.ZodType<MonthEntry[], unknown>;
