import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { adventureSchema, adventureSectionSchema, readAdventureForm, readSectionForm, stepField } from "./adventureSchema";

const PHOTO_ID = "6f1c9a2e-4b7d-4e8a-9c3f-2d5b8e1a7c40";

const adventureForm = (fields: Record<string, string> = {}) => {
  const formData = new FormData();
  const values = { title: " Rock climbing ", tag: "Near Kathmandu · Oct–May", summary: "Climb limestone crags.", photoId: PHOTO_ID, photoAlt: "", position: "4", isShown: "on", ...fields };
  for (const [name, value] of Object.entries(values)) formData.set(name, value);
  return readAdventureForm(formData);
};

const sectionForm = (fields: Record<string, string> = {}) => {
  const formData = new FormData();
  const values: Record<string, string> = { eyebrow: "Beyond the trekking trail", heading: "Tell us your dream", intro: "", askTitle: "Something else in mind?", askText: "", stepsTitle: "How it works", note: "" };
  for (const index of [0, 1, 2]) {
    values[stepField(index, "Title")] = `Step ${index + 1}`;
    values[stepField(index, "Text")] = "";
  }
  for (const [name, value] of Object.entries({ ...values, ...fields })) formData.set(name, value);
  return readSectionForm(formData);
};

describe("adventureSchema", () => {
  it("reads a shown card with its photo", () => {
    expect(adventureSchema.parse(adventureForm())).toEqual({
      title: "Rock climbing",
      tag: "Near Kathmandu · Oct–May",
      summary: "Climb limestone crags.",
      photoId: PHOTO_ID,
      photoAlt: "",
      position: 4,
      isShown: true,
    });
  });

  it("keeps a card without a photo, hidden", () => {
    expect(adventureSchema.parse(adventureForm({ photoId: "", isShown: "" }))).toMatchObject({ photoId: null, isShown: false });
  });

  it("won't show a card without a photo", () => {
    const result = adventureSchema.safeParse(adventureForm({ photoId: "" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).photoId).toBe("Choose a photo before showing it on the website.");
  });

  it("needs a title, a text and a position from 1 to 99", () => {
    const result = adventureSchema.safeParse(adventureForm({ title: " ", summary: "", position: "0" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(Object.keys(toFieldErrors(result.error)).sort()).toEqual(["position", "summary", "title"]);
    expect(adventureSchema.safeParse(adventureForm({ position: "100" })).success).toBe(false);
    expect(adventureSchema.safeParse(adventureForm({ position: "2.5" })).success).toBe(false);
  });
});

describe("adventureSectionSchema", () => {
  it("reads the words with three steps", () => {
    const values = adventureSectionSchema.parse(sectionForm({ [stepField(1, "Text")]: " We talk to guides. " }));
    expect(values.steps).toEqual([
      { title: "Step 1", text: "" },
      { title: "Step 2", text: "We talk to guides." },
      { title: "Step 3", text: "" },
    ]);
  });

  it("names an untitled step's field", () => {
    const result = adventureSectionSchema.safeParse(sectionForm({ [stepField(2, "Title")]: "", heading: "" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(Object.keys(toFieldErrors(result.error)).sort()).toEqual(["heading", "steps.2.title"]);
  });
});
