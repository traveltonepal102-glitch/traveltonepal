import { z } from "zod";

import { readList, requiredText } from "@/lib/forms/formFields";

import { SCHEMA_LIMITS } from "../constants";
import { parseSchemaJson } from "../lib/schemaJson";
import type { SchemaBlockValues } from "../types";

const schemaData = z.string().transform((text, context) => {
  const result = parseSchemaJson(text);
  if (result.ok) return result.data;
  context.addIssue({ code: "custom", message: result.message });
  return z.NEVER;
});

const block = z
  .object({
    label: requiredText(SCHEMA_LIMITS.label, 'Give it a name, like "Trek video".'),
    json: schemaData,
    isShown: z.string().transform((value) => value === "on"),
  })
  .transform(({ label, json, isShown }) => ({ label, data: json, isShown }));

/** One page's blocks, in order (read with readPageSchemasForm). Checked again on the server before saving. */
export const pageSchemasSchema = z.object({
  schemas: z.array(block).max(SCHEMA_LIMITS.blocks, `Use ${SCHEMA_LIMITS.blocks} schemas or fewer on one page.`),
}) satisfies z.ZodType<{ schemas: SchemaBlockValues[] }, unknown>;

/** Field names of one block, repeated in order. "schemaShown" is a hidden field: "on" or "off". */
export const SCHEMA_FIELDS = { label: "schemaLabel", json: "schemaJson", isShown: "schemaShown" } as const;

/** The form's FormData as the schema expects it. */
export const readPageSchemasForm = (formData: FormData) => {
  const labels = readList(formData, SCHEMA_FIELDS.label);
  const jsons = readList(formData, SCHEMA_FIELDS.json);
  const shown = readList(formData, SCHEMA_FIELDS.isShown);
  return { schemas: labels.map((label, index) => ({ label, json: jsons[index] ?? "", isShown: shown[index] ?? "off" })) };
};
