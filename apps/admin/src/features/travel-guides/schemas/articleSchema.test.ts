import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { articleSchema, readArticleForm } from "./articleSchema";

const ID = (n: number) => `00000000-0000-4000-8000-0000000000${String(n).padStart(2, "0")}`;

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = { title: "Best time to trek Langtang", slug: "best-time-to-trek-langtang", topic: "best-time", status: "draft", publishMode: "now", ...fields };
  for (const [name, value] of Object.entries(base)) for (const item of [value].flat()) form.append(name, item);
  return form;
};

const parse = (fields?: Record<string, string | string[]>) => articleSchema.safeParse(readArticleForm(buildForm(fields)));

const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

const QUICK = JSON.stringify([{ id: null, type: "quick", body: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "October." }] }] } }]);

const PUBLISHABLE = {
  status: "published",
  intro: "Spring or autumn?",
  cardText: "What each month is like.",
  coverPhotoId: ID(1),
  coverAlt: "Langtang in October",
  authorId: ID(2),
  sections: QUICK,
};

describe("articleSchema", () => {
  it("saves a draft with only a title and a web address", () => {
    expect(parse().data).toMatchObject({ siteRegionId: null, alsoOnMainSite: false, publishedOn: null, isFeatured: false, startHerePosition: null, facts: [], relatedIds: [], sections: [] });
    expect(errorsOf({ title: " ", slug: "Best Time!" })).toMatchObject({ title: "Write the title.", slug: expect.stringMatching(/lowercase letters/) });
  });

  it("needs the intro, card text, photo with its description, the author and a section to publish", () => {
    expect(errorsOf({ status: "published" })).toMatchObject({
      intro: "Write the intro before publishing.",
      cardText: "Write the card text before publishing.",
      coverPhotoId: "Add the photo before publishing.",
      authorId: "Pick who wrote it before publishing.",
      sections: "Add at least one section to the article body before publishing.",
    });
    expect(errorsOf({ ...PUBLISHABLE, coverAlt: "" }).coverAlt).toBe("Describe the photo before publishing.");
    expect(parse(PUBLISHABLE).success).toBe(true);
  });

  it("needs a date for “On a date I choose”, and keeps none otherwise", () => {
    expect(errorsOf({ publishMode: "date" }).publishedOn).toBe("Pick the date it goes live.");
    expect(errorsOf({ publishMode: "date", publishedOn: "2027-02-30" }).publishedOn).toBe("Pick a real date.");
    expect(parse({ publishMode: "date", publishedOn: "2027-01-05" }).data?.publishedOn).toBe("2027-01-05");
    expect(parse({ publishMode: "now", publishedOn: "2027-01-05" }).data?.publishedOn).toBeNull();
  });

  it("shows on the main site only as a region site's copy", () => {
    expect(parse({ alsoOnMainSite: "on" }).data?.alsoOnMainSite).toBe(false);
    expect(parse({ siteRegionId: ID(3), alsoOnMainSite: "on" }).data).toMatchObject({ siteRegionId: ID(3), alsoOnMainSite: true });
  });

  it("reads key facts, dropping empty rows and flagging half-filled ones", () => {
    const facts = { factIcon: ["wb_sunny", "altitude", "water_drop"], factLabel: ["Best months", "", "Wettest"], factValue: ["Oct–Nov", "", ""] };
    const errors = errorsOf(facts);
    expect(errors["facts.2.value"]).toBe("Write the label and the value, or remove this fact.");
    expect(parse({ ...facts, factLabel: ["Best months", "", ""] }).data?.facts).toEqual([{ icon: "wb_sunny", label: "Best months", value: "Oct–Nov" }]);
    expect(errorsOf({ factIcon: ["rocket"], factLabel: ["A"], factValue: ["B"] })["facts.0.icon"]).toBe("Pick an icon.");
  });

  it("takes up to 3 related guides once each, and a Start here number from 1 to 6", () => {
    expect(parse({ relatedId: [ID(4), ID(5), ID(4)] }).data?.relatedIds).toEqual([ID(4), ID(5)]);
    expect(errorsOf({ relatedId: [ID(4), ID(5), ID(6), ID(7)] }).relatedIds).toBe("Pick up to 3 guides.");
    expect(parse({ startHerePosition: "3" }).data?.startHerePosition).toBe(3);
    expect(errorsOf({ startHerePosition: "7" }).startHerePosition).toBe("Pick a number from the list.");
  });
});
