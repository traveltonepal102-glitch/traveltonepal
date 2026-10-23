import type { z } from "zod";

/** Field errors by field name ("slug", "faqs.2.answer"): the first problem per field. */
export type FieldErrors = Record<string, string>;

export const toFieldErrors = (error: z.ZodError): FieldErrors => {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    errors[field] ??= issue.message;
  }
  return errors;
};
