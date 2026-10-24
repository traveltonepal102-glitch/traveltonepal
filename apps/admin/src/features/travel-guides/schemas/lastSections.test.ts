import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { storedSection, toStoredSection } from "../services/storedSections";
import { sectionsField } from "./sectionsSchema";

const ID = (n: number) => `00000000-0000-4000-8000-0000000000${String(n).padStart(2, "0")}`;

/** As in the travel guide form, so errors carry their "sections." path. */
const form = z.object({ sections: sectionsField });
const parse = (sections: unknown[]) => form.safeParse({ sections: JSON.stringify(sections) });
const errorsOf = (sections: unknown[]) => {
  const result = parse(sections);
  if (result.success) throw new Error("expected the sections to be rejected");
  return toFieldErrors(result.error);
};

describe("the last eleven kinds of section", () => {
  it("reads each kind, trimming words, keeping picks once and the video's id only", () => {
    const result = parse([
      { id: null, type: "quote", text: " The valley is quietest in November. " },
      { id: null, type: "days", trekId: ID(1), dayIds: [ID(2), ID(3), ID(2)] },
      { id: null, type: "cost", heading: "What it costs", rows: [{ item: "Park permit", price: "$30" }, { item: "", price: "" }], totalLabel: "Total", total: "$30" },
      { id: null, type: "compare", trekIds: [ID(1), ID(4)] },
      { id: null, type: "tip", guideId: ID(5), text: "Start at 7 am." },
      { id: null, type: "meet", heading: "", guideIds: [ID(5), ID(6)] },
      { id: null, type: "image", photoId: ID(7), caption: "", alt: "Langtang village" },
      { id: null, type: "gallery", photoIds: [ID(7), ID(8)] },
      { id: null, type: "map", title: "", place: "Syabrubesi, Nepal" },
      { id: null, type: "video", youtubeId: "https://youtu.be/dQw4w9WgXcQ", title: "Kyanjin Ri" },
    ]);
    expect(result.data?.sections).toMatchObject([
      { type: "quote", text: "The valley is quietest in November." },
      { type: "days", dayIds: [ID(2), ID(3)] },
      { type: "cost", rows: [{ item: "Park permit", price: "$30" }] },
      { type: "compare", trekIds: [ID(1), ID(4)] },
      { type: "tip", guideId: ID(5) },
      { type: "meet", guideIds: [ID(5), ID(6)] },
      { type: "image", photoId: ID(7) },
      { type: "gallery", photoIds: [ID(7), ID(8)] },
      { type: "map", place: "Syabrubesi, Nepal" },
      { type: "video", youtubeId: "dQw4w9WgXcQ" },
    ]);
  });

  it("checks what each kind needs, at the section's number", () => {
    expect(
      errorsOf([
        { id: null, type: "quote", text: "" },
        { id: null, type: "days", trekId: null, dayIds: [] },
        { id: null, type: "cost", heading: "", rows: [{ item: "Permit", price: "" }], totalLabel: "Total", total: "" },
        { id: null, type: "compare", trekIds: [ID(1)] },
        { id: null, type: "gquote", guideId: null, text: "" },
        { id: null, type: "meet", heading: "", guideIds: [ID(1), ID(2), ID(3), ID(4), ID(5)] },
        { id: null, type: "image", photoId: null, caption: "", alt: "" },
        { id: null, type: "gallery", photoIds: [ID(7)] },
        { id: null, type: "map", title: "", place: "" },
        { id: null, type: "video", youtubeId: "https://vimeo.com/1", title: "" },
      ]),
    ).toMatchObject({
      "sections.0.text": "Write the sentence.",
      "sections.1.trekId": "Pick the trek.",
      "sections.1.dayIds": "Pick 1 to 6 days.",
      "sections.2.rows.0.price": "Write the item and its price, or remove the line.",
      "sections.3.trekIds": "Pick 2 or 3 treks.",
      "sections.4.guideId": "Pick the guide.",
      "sections.4.text": "Write the guide's words.",
      "sections.5.guideIds": "Pick 2 to 4 guides.",
      "sections.6.photoId": "Choose the photo.",
      "sections.6.alt": "Describe the photo for Google and screen readers.",
      "sections.7.photoIds": "Choose 2 to 20 photos.",
      "sections.8.place": "Write the place for the map.",
      "sections.9.youtubeId": "Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…",
      "sections.9.title": "Write the video's title.",
    });
  });

  it("asks for the cost total and its label together", () => {
    expect(errorsOf([{ id: null, type: "cost", heading: "", rows: [{ item: "Permit", price: "$30" }], totalLabel: "Total", total: "" }])["sections.0.total"]).toBe(
      "Write the total and its label, or neither.",
    );
  });

  it("stores guides and photos as links, and reads them back in order", () => {
    const tip = toStoredSection({ id: null, type: "tip", guideId: ID(5), text: "Start early." });
    expect(tip).toMatchObject({ guide_ids: [ID(5)], photo_ids: [], content: { text: "Start early." } });
    const gallery = toStoredSection({ id: "s1", type: "gallery", photoIds: [ID(8), ID(7)] });
    expect(gallery).toMatchObject({ photo_ids: [ID(8), ID(7)], content: {} });
    expect(toStoredSection({ id: null, type: "days", trekId: ID(1), dayIds: [ID(2)] })).toMatchObject({ trek_id: ID(1), settings: { dayIds: [ID(2)] } });
    expect(storedSection({ id: "s2", type: "meet", trek_id: null, settings: {}, guideIds: [ID(6), ID(5)] }, { heading: "Our guides" })).toEqual({
      id: "s2",
      type: "meet",
      heading: "Our guides",
      guideIds: [ID(6), ID(5)],
    });
    expect(storedSection({ id: "s3", type: "video", trek_id: null, settings: { youtubeId: "dQw4w9WgXcQ" } }, { title: "Kyanjin Ri" })).toEqual({
      id: "s3",
      type: "video",
      youtubeId: "dQw4w9WgXcQ",
      title: "Kyanjin Ri",
    });
  });
});
