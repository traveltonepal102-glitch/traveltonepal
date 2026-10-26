import { legalTextDocSchema, legalTextToPlainText } from "@ttn/ui/lib/legalText";
import type { LegalTextDoc } from "@ttn/ui/lib/legalText";
import { z } from "zod";

/** The legal pages' text as the admin saves it: the format and its check are shared with the website (@ttn/ui/lib/legalText). */
export type { LegalBlock, LegalTable, LegalTextDoc } from "@ttn/ui/lib/legalText";
export { EMPTY_LEGAL_TEXT, isSectionHeading, legalTextToPlainText, splitLegalSections, toLegalTextDoc } from "@ttn/ui/lib/legalText";

/** The longest JSON the server reads for one legal page (a long text with tables and formatting). */
const MAX_JSON_LENGTH = 400_000;

/** A form field holding a legal text as JSON (what LegalTextEditor posts), checked like the website reads it. */
export const legalTextField = (maxCharacters: number) =>
  z
    .string()
    .max(MAX_JSON_LENGTH, "This text is too long.")
    .transform((json, context): LegalTextDoc => {
      let value: unknown;
      try {
        value = JSON.parse(json);
      } catch {
        value = undefined;
      }
      const result = legalTextDocSchema.safeParse(value);
      if (result.success) return result.data;
      context.addIssue({ code: "custom", message: "This text has formatting that can't be saved. Links must start with https://, mailto: or /." });
      return z.NEVER;
    })
    .refine((doc) => legalTextToPlainText(doc).length <= maxCharacters, `Use ${maxCharacters} characters or fewer.`)
    .refine((doc) => legalTextToPlainText(doc).length > 0, "Write the page's text.");
