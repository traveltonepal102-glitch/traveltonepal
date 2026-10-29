import { z } from "zod";

import { isRichTextEmpty, richTextDocSchema, richTextToPlainText } from "@/lib/richText/richText";

/** The saved section's id, or null for a new one. */
export const sectionId = z
  .string()
  .nullable()
  .transform((value) => value || null)
  .pipe(z.uuid("Reload the page and try again.").nullable());

/** A rich text document of at most `max` characters of words; `required` also refuses an empty one. */
export const richText = (max: number, emptyMessage?: string) =>
  richTextDocSchema
    .refine((doc) => richTextToPlainText(doc).length <= max, `Use ${max.toLocaleString("en")} characters or fewer.`)
    .refine((doc) => !emptyMessage || !isRichTextEmpty(doc), emptyMessage ?? "");

/** An id picked from a list; `message` when nothing is picked. */
export const pickedId = (message: string) =>
  z
    .string()
    .nullable()
    .refine((value) => Boolean(value), message)
    .pipe(z.uuid("Pick it again from the list."));

/** Several ids picked from a list, each once, between `min` and `max`. */
export const pickedIds = (min: number, max: number, message: string) =>
  z
    .array(z.uuid("Pick them again from the list."))
    .transform((ids) => [...new Set(ids)])
    .refine((ids) => ids.length >= min && ids.length <= max, message);
