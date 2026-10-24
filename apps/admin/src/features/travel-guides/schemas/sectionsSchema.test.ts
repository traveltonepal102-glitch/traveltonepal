import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import { sectionsField } from "./sectionsSchema";

const TREK = "00000000-0000-4000-8000-000000000041";
const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

/** As in the travel guide form, so errors carry their "sections." path. */
const form = z.object({ sections: sectionsField });
const parse = (sections: unknown[]) => form.safeParse({ sections: JSON.stringify(sections) });

const errorsOf = (sections: unknown[]) => {
  const result = parse(sections);
  if (result.success) throw new Error("expected the sections to be rejected");
  return toFieldErrors(result.error);
};

describe("sectionsField", () => {
  it("reads each kind of section in order, dropping the editor's keys and empty questions", () => {
    const result = parse([
      { id: null, key: "k1", type: "quick", body: doc("October and November.") },
      { id: null, key: "k2", type: "text", heading: " Autumn ", tocLabel: "", body: doc("Clear skies.") },
      { id: null, key: "k3", type: "trek", trekId: TREK },
      { id: null, key: "k4", type: "faq", items: [{ key: "q1", question: "Winter?", answer: doc("Yes.") }, { key: "q2", question: "", answer: EMPTY_RICH_TEXT }] },
      { id: null, key: "k5", type: "paragraph", body: doc("Pack layers.") },
      { id: null, key: "k6", type: "paragraph", body: doc("Book early.") },
    ]);
    expect(result.data?.sections).toEqual([
      { id: null, type: "quick", body: doc("October and November.") },
      { id: null, type: "text", heading: "Autumn", tocLabel: "", body: doc("Clear skies.") },
      { id: null, type: "trek", trekId: TREK },
      { id: null, type: "faq", items: [{ question: "Winter?", answer: doc("Yes.") }] },
      { id: null, type: "paragraph", body: doc("Pack layers.") },
      { id: null, type: "paragraph", body: doc("Book early.") },
    ]);
    expect(sectionsField.safeParse("").data).toEqual([]);
  });

  it("checks each section at its own number", () => {
    const errors = errorsOf([
      { id: null, type: "text", heading: "", tocLabel: "", body: EMPTY_RICH_TEXT },
      { id: null, type: "quick", body: EMPTY_RICH_TEXT },
      { id: null, type: "trek", trekId: null },
      { id: null, type: "faq", items: [{ question: "Winter?", answer: EMPTY_RICH_TEXT }] },
      { id: null, type: "paragraph", body: EMPTY_RICH_TEXT },
    ]);
    expect(errors).toMatchObject({
      "sections.0.heading": "Write the heading.",
      "sections.0.body": "Write the text, or remove this section.",
      "sections.1.body": "Write the answer, or remove this section.",
      "sections.2.trekId": "Pick the trek.",
      "sections.3.items.0.answer": "Write the answer, or remove this question.",
      "sections.4.body": "Write the text, or remove this section.",
    });
  });

  it("needs a question in a questions section, and refuses unknown kinds and broken JSON", () => {
    expect(errorsOf([{ id: null, type: "faq", items: [] }])["sections.0.items"]).toBe("Add a question, or remove this section.");
    expect(errorsOf([{ id: null, type: "rocket", place: "Kyanjin" }])).toHaveProperty(["sections.0.type"]);
    expect(sectionsField.safeParse("[{").success).toBe(false);
  });

  it("takes one quick answer and one questions section per guide", () => {
    const quick = { id: null, type: "quick", body: doc("Autumn.") };
    expect(errorsOf([quick, quick]).sections).toBe("Only one “Quick answer” section per guide.");
  });
});
