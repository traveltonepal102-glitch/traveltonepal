import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";
import type { RichTextDoc } from "@/lib/richText/richText";

import { readRegionForm, regionSchema } from "./regionSchema";

const richText = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
const EMPTY_ANSWER = JSON.stringify(EMPTY_RICH_TEXT);

const MONTHS = ["avoid", "avoid", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"];

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = { name: "Langtang", slug: "langtang", monthRatings: MONTHS, ...fields };
  for (const [name, value] of Object.entries(base)) {
    for (const item of Array.isArray(value) ? value : [value]) form.append(name, item);
  }
  return form;
};

const parse = (fields?: Record<string, string | string[]>) => regionSchema.safeParse(readRegionForm(buildForm(fields)));

const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("regionSchema", () => {
  it("accepts a region with only the name, web address and months", () => {
    const result = parse();
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ name: "Langtang", slug: "langtang", latitude: null, faqs: [], bestFor: [] });
  });

  it("tidies the input: trims text, lowercases the web address, reads numbers", () => {
    const result = parse({ name: "  Langtang ", slug: " Langtang-Valley ", latitude: "28.21", longitude: "85.56" });
    expect(result.data).toMatchObject({ name: "Langtang", slug: "langtang-valley", latitude: 28.21, longitude: 85.56 });
  });

  it("requires the name and a clean web address", () => {
    expect(errorsOf({ name: " " }).name).toBe("Enter the region name.");
    expect(errorsOf({ slug: "" }).slug).toBe("Enter the web address.");
    for (const slug of ["mardi himal", "mardi_himal", "-mardi", "mardi--himal", "märdi"]) {
      expect(errorsOf({ slug }).slug).toMatch(/lowercase letters/);
    }
  });

  it("checks the map pin: numbers, inside Nepal, both or neither", () => {
    expect(errorsOf({ latitude: "north", longitude: "85.5" }).latitude).toMatch(/Enter a number/);
    expect(errorsOf({ latitude: "40", longitude: "85.5" }).latitude).toMatch(/between 26 and 31/);
    expect(errorsOf({ latitude: "28.2" }).longitude).toMatch(/both latitude and longitude/);
  });

  it("enforces the length limits", () => {
    expect(errorsOf({ tagline: "x".repeat(141) }).tagline).toBe("Use 140 characters or fewer.");
    expect(errorsOf({ seoTitle: "x".repeat(71) }).seoTitle).toBe("Use 70 characters or fewer.");
  });

  it("allows up to 3 'best for' chips, ignoring blanks and repeats", () => {
    expect(parse({ bestFor: ["Culture", "", "Culture", "No flights"] }).data?.bestFor).toEqual(["Culture", "No flights"]);
    expect(errorsOf({ bestFor: ["A", "B", "C", "D"] }).bestFor).toBe("Pick up to 3.");
  });

  it("needs all 12 months, each with a known rating", () => {
    expect(errorsOf({ monthRatings: MONTHS.slice(0, 11) }).monthRatings).toBe("Rate all 12 months.");
    expect(errorsOf({ monthRatings: [...MONTHS.slice(0, 11), "great"] })).toHaveProperty("monthRatings.11");
  });

  it("drops empty question rows and flags half-filled ones at their own row number", () => {
    const answer = richText("Yes, by law.");
    const result = parse({ faqQuestion: ["", "Do I need a guide?"], faqAnswer: [EMPTY_ANSWER, JSON.stringify(answer)] });
    expect(result.data?.faqs).toEqual([{ question: "Do I need a guide?", answer }]);

    const errors = errorsOf({ faqQuestion: ["", "", "When to go?"], faqAnswer: [EMPTY_ANSWER, EMPTY_ANSWER, EMPTY_ANSWER] });
    expect(errors["faqs.2.answer"]).toBe("Write the answer, or remove this row.");
  });

  it("reads the photos: cover, gallery order, and \"taken at\" only for photos in use", () => {
    const [cover, first, second, removed] = [1, 2, 3, 4].map((n) => `00000000-0000-4000-8000-00000000000${n}`);
    const result = parse({
      coverPhotoId: cover,
      galleryPhotoId: [second, first],
      [`photoPlace.${first}`]: "  Kyanjin Gompa  ",
      [`photoPlace.${removed}`]: "No longer in the region",
    });
    expect(result.data?.photos).toEqual({
      coverPhotoId: cover,
      galleryPhotoIds: [second, first],
      details: [{ id: first, place: "Kyanjin Gompa" }],
    });
    expect(parse().data?.photos).toEqual({ coverPhotoId: null, galleryPhotoIds: [], details: [] });
  });

  it("rejects bad photo ids, a photo used twice and too many photos", () => {
    const id = "00000000-0000-4000-8000-000000000001";
    expect(errorsOf({ galleryPhotoId: ["../etc/passwd"] })).toHaveProperty(["photos.galleryPhotoIds.0"]);
    expect(errorsOf({ coverPhotoId: id, galleryPhotoId: [id] })["photos.galleryPhotoIds"]).toMatch(/twice/);
    const many = Array.from({ length: 31 }, (_, n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`);
    expect(errorsOf({ galleryPhotoId: many })["photos.galleryPhotoIds"]).toMatch(/up to 30/);
  });

  it("reads the introduction as rich text and rejects unsafe links in it", () => {
    const introduction = richText("The valley next door to Kathmandu.");
    expect(parse({ introduction: JSON.stringify(introduction) }).data?.introduction).toEqual(introduction);

    const unsafe = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "x", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
    expect(errorsOf({ introduction: JSON.stringify(unsafe) }).introduction).toMatch(/Links must start with https/);
  });

  it("reads the featured trek and the nearby treks in order, each once", () => {
    const featured = "00000000-0000-4000-8000-000000000031";
    const nearby = "00000000-0000-4000-8000-000000000032";
    const result = parse({
      featuredTrekId: featured,
      featuredTrekLabel: " Our signature trek ",
      nearbyTrekId: [nearby],
      nearbyTrekLabel: ["Nearby · same trailhead"],
      nearbyTrekNote: ["Easy to combine."],
    });
    expect(result.data).toMatchObject({
      featuredTrekId: featured,
      featuredTrekLabel: "Our signature trek",
      nearbyTreks: [{ trekId: nearby, label: "Nearby · same trailhead", note: "Easy to combine." }],
    });
    expect(parse().data?.featuredTrekId).toBeNull();
    expect(errorsOf({ nearbyTrekId: [nearby, nearby], nearbyTrekLabel: ["", ""], nearbyTrekNote: ["", ""] }).nearbyTreks).toBe("A trek is in the list twice. Remove one.");
    expect(errorsOf({ featuredTrekId: "langtang" }).featuredTrekId).toBe("Pick the featured trek from the list.");
  });

  it("reads the pinned travel guides in order, each once, up to 3", () => {
    const id = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;
    expect(parse({ pinnedArticleId: [id(2), id(1), id(2)] }).data?.pinnedArticleIds).toEqual([id(2), id(1)]);
    expect(parse().data?.pinnedArticleIds).toEqual([]);
    expect(errorsOf({ pinnedArticleId: [id(1), id(2), id(3), id(4)] }).pinnedArticleIds).toBe("Pin up to 3 travel guides.");
    expect(errorsOf({ pinnedArticleId: ["not-an-id"] })["pinnedArticleIds.0"]).toBe("Pin travel guides from the list.");
  });

  it("stores the guides switched off, from every guide listed and the switches that are on", () => {
    const [a, b, c] = ["00000000-0000-4000-8000-000000000041", "00000000-0000-4000-8000-000000000042", "00000000-0000-4000-8000-000000000043"];
    expect(parse({ regionGuideListed: [a, b, c], regionGuideShown: [b] }).data?.hiddenGuideIds).toEqual([a, c]);
    expect(parse({ regionGuideListed: [a], regionGuideShown: [a] }).data?.hiddenGuideIds).toEqual([]);
  });

  it("reads the website's page fields: highest point, difficulty, drive or fly, cards and compare", () => {
    const other = "00000000-0000-4000-8000-000000000051";
    const result = parse({
      maxAltitudeM: "4,984",
      difficulty: "moderate",
      access: "fly",
      heroHighlight: " No flights needed ",
      whyIcon: ["landscape", "route"],
      whyTitle: ["Big mountains, fast", ""],
      whyText: ["Langtang Lirung after 4 days.", ""],
      compareRegionId: [other, other],
    });
    expect(result.data).toMatchObject({
      maxAltitudeM: 4984,
      difficulty: "moderate",
      isFlight: true,
      heroHighlight: "No flights needed",
      whyPoints: [{ icon: "landscape", title: "Big mountains, fast", text: "Langtang Lirung after 4 days." }],
      compareRegionIds: [other],
    });
    expect(parse().data).toMatchObject({ maxAltitudeM: null, difficulty: null, isFlight: false, whyPoints: [], compareRegionIds: [] });
  });

  it("checks the new fields", () => {
    expect(errorsOf({ maxAltitudeM: "12000" }).maxAltitudeM).toMatch(/between 500 and 9,000/);
    expect(errorsOf({ difficulty: "very hard" }).difficulty).toBe("Pick the difficulty.");
    expect(errorsOf({ whyIcon: ["landscape"], whyTitle: ["Gentle climb"], whyText: [""] })["whyPoints.0.text"]).toBe("Write the text, or remove this card.");
    const five = [1, 2, 3, 4, 5].map((n) => `00000000-0000-4000-8000-00000000006${n}`);
    expect(errorsOf({ compareRegionId: five }).compareRegionIds).toBe("Pick up to 4 regions.");
  });
});
