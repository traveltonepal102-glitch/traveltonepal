import { z } from "zod";

import { readText, requiredText, text } from "@/lib/forms/formFields";
import { legalTextField } from "@/lib/richText/legalText";

import { LEGAL_PAGES, PAGE_LIMITS as LIMIT } from "../constants";
import type { LegalPagesValues } from "../types";

const legalPage = z.object({
  heading: requiredText(LIMIT.legalTitle, "Write the page title."),
  intro: text(LIMIT.legalIntro),
  body: legalTextField(LIMIT.legalText),
  lawyerChecked: z.boolean(),
  lastUpdated: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.")]),
  autoDate: z.boolean(),
});

/** Pages › Legal pages, checked on the server before saving: the four pages. */
export const legalPagesSchema = z.object({
  terms: legalPage,
  privacy: legalPage,
  impressum: legalPage,
  cookies: legalPage,
}) satisfies z.ZodType<LegalPagesValues, unknown>;

/** The legal editor's FormData: each page's fields start with its slug ("terms.body"); switches send "on". */
export const readLegalPagesForm = (formData: FormData) =>
  Object.fromEntries(
    LEGAL_PAGES.map(({ slug }) => [
      slug,
      {
        heading: readText(formData, `${slug}.heading`),
        intro: readText(formData, `${slug}.intro`),
        body: readText(formData, `${slug}.body`),
        lawyerChecked: readText(formData, `${slug}.lawyerChecked`) === "on",
        lastUpdated: readText(formData, `${slug}.lastUpdated`).trim(),
        autoDate: readText(formData, `${slug}.autoDate`) === "on",
      },
    ]),
  );
