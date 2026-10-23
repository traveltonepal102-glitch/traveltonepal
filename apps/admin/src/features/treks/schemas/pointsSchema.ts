import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";

import { TREK_LIMITS as LIMIT } from "../constants";

/**
 * A list of titled points (highlights, "Is this trek for you?"…). A point needs both parts; a fully empty row
 * is ignored. Errors keep the row number shown in the editor.
 */
export const pointsSchema = (maxItems: number) =>
  z
    .array(
      z.object({ title: text(LIMIT.pointTitle), text: text(LIMIT.pointText) }).superRefine((point, context) => {
        if (Boolean(point.title) === Boolean(point.text)) return;
        const missing = point.title ? "text" : "title";
        context.addIssue({ code: "custom", path: [missing], message: `Write the ${missing}, or remove this point.` });
      }),
    )
    .transform((points) => points.filter((point) => point.title))
    .refine((points) => points.length <= maxItems, `Keep it to ${maxItems} points.`);

/** A point list's fields in FormData: <prefix>Title and <prefix>Text, one pair per row in order. */
export const readPoints = (formData: FormData, prefix: string) => {
  const texts = readList(formData, `${prefix}Text`);
  return readList(formData, `${prefix}Title`).map((title, index) => ({ title, text: texts[index] ?? "" }));
};
