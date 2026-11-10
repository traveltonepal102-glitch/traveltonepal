import { describe, expect, it } from "vitest";

import { photoTextSchema, readPhotoTextForm } from "./photoTextSchema";

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(values)) data.set(name, value);
  return data;
};

describe("photoTextSchema", () => {
  it("trims each field and allows them empty", () => {
    const parsed = photoTextSchema.parse(readPhotoTextForm(form({ altText: "  Trekkers below Larkya La  ", caption: "", place: " Larkya La " })));
    expect(parsed).toEqual({ altText: "Trekkers below Larkya La", caption: "", place: "Larkya La" });
  });

  it("reads a missing field as empty", () => {
    expect(photoTextSchema.parse(readPhotoTextForm(form({})))).toEqual({ altText: "", caption: "", place: "" });
  });

  it("refuses text longer than the database takes", () => {
    const result = photoTextSchema.safeParse({ altText: "a".repeat(151), caption: "c".repeat(301), place: "p".repeat(81) });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["altText", "caption", "place"]);
  });
});
