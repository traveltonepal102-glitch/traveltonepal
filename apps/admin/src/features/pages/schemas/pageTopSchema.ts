import { z } from "zod";

import { readList, readText, requiredText, text } from "@/lib/forms/formFields";

import { PAGE_LIMITS as LIMIT } from "../constants";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A picked photo or person: a library id, or nothing. */
export const optionalId = z
  .string()
  .trim()
  .transform((value) => value || null)
  .refine((value) => value === null || uuid.test(value), "Pick it again from the list.");

/** The top of the page and its Google result, the same on every page. */
export const pageTopFields = {
  eyebrow: text(LIMIT.eyebrow),
  heading: requiredText(LIMIT.heading, "Write the page's main heading."),
  intro: text(LIMIT.intro),
  seoTitle: text(LIMIT.seoTitle),
  seoDescription: text(LIMIT.seoDescription),
  seoKeyword: text(LIMIT.seoKeyword),
  photoId: optionalId,
};

/** The top's fields; `prefix` when one form holds several pages ("home." → "home.heading"). */
export const readPageTop = (formData: FormData, prefix = "") => ({
  eyebrow: readText(formData, `${prefix}eyebrow`),
  heading: readText(formData, `${prefix}heading`),
  intro: readText(formData, `${prefix}intro`),
  seoTitle: readText(formData, `${prefix}seoTitle`),
  seoDescription: readText(formData, `${prefix}seoDescription`),
  seoKeyword: readText(formData, `${prefix}seoKeyword`),
  photoId: readText(formData, `${prefix}photoId`),
});

/** Rows sent as repeated fields (e.g. milestoneYear, milestoneTitle…), zipped back into objects. */
export const readRows = <Key extends string>(formData: FormData, prefix: string, keys: readonly Key[]) => {
  const columns = keys.map((key) => readList(formData, `${prefix}${key[0].toUpperCase()}${key.slice(1)}`));
  const count = Math.max(0, ...columns.map((column) => column.length));
  return Array.from({ length: count }, (_, row) => Object.fromEntries(keys.map((key, index) => [key, columns[index][row] ?? ""])) as Record<Key, string>);
};

/**
 * Fixed rows of a list (e.g. four milestones): an empty row is left out; a row with words but no title gets an error
 * on its title, at its place in the form ("milestones.2.title").
 */
export const optionalRows = <Row extends { title: string }>(row: z.ZodType<Row, Record<string, string>>, max: number, titleMessage: string) =>
  z
    .array(row)
    .max(max, `Up to ${max}.`)
    .superRefine((rows, context) =>
      rows.forEach((item, index) => {
        const hasWords = Object.values(item).some((value) => typeof value === "string" && value.trim());
        if (hasWords && !item.title) context.addIssue({ code: "custom", path: [index, "title"], message: titleMessage });
      }),
    )
    .transform((rows) => rows.filter((item) => item.title));
