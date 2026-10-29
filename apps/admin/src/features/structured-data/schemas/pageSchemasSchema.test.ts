import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { SCHEMA_FIELDS, pageSchemasSchema, readPageSchemasForm } from "./pageSchemasSchema";

type Block = { label: string; json: string; isShown: "on" | "off" };

const VIDEO = { "@type": "VideoObject", name: "Langtang Valley in 2 minutes" };

const form = (blocks: Block[]) => {
  const formData = new FormData();
  for (const block of blocks) {
    formData.append(SCHEMA_FIELDS.label, block.label);
    formData.append(SCHEMA_FIELDS.json, block.json);
    formData.append(SCHEMA_FIELDS.isShown, block.isShown);
  }
  return readPageSchemasForm(formData);
};

const block = (overrides: Partial<Block> = {}): Block => ({ label: " Trek video ", json: JSON.stringify(VIDEO), isShown: "on", ...overrides });

describe("pageSchemasSchema", () => {
  it("reads the blocks in order, checked and trimmed", () => {
    expect(pageSchemasSchema.parse(form([block(), block({ label: "Hidden", isShown: "off" })]))).toEqual({
      schemas: [
        { label: "Trek video", data: VIDEO, isShown: true },
        { label: "Hidden", data: VIDEO, isShown: false },
      ],
    });
  });

  it("reads a page with no blocks", () => {
    expect(pageSchemasSchema.parse(form([]))).toEqual({ schemas: [] });
  });

  it("puts each problem on its block's field", () => {
    const result = pageSchemasSchema.safeParse(form([block(), block({ label: "", json: '{ "name": "x" }' })]));
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(toFieldErrors(result.error)).toEqual({ "schemas.1.label": expect.any(String), "schemas.1.json": expect.stringMatching(/@type/) });
  });

  it("allows 10 blocks on a page", () => {
    expect(pageSchemasSchema.safeParse(form(Array.from({ length: 10 }, () => block()))).success).toBe(true);
    expect(pageSchemasSchema.safeParse(form(Array.from({ length: 11 }, () => block()))).success).toBe(false);
  });
});
