import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";

import type { SitePage } from "../types";
import { aboutContentOf, contactContentOf, toAboutValues, toContactValues } from "./pageContent";

const doc = (...paragraphs: string[]): RichTextDoc => ({ type: "doc", content: paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })) });

const page = (content: unknown): SitePage => ({
  slug: "about",
  top: { eyebrow: "", heading: "Heading", intro: "", seoTitle: "", seoDescription: "", seoKeyword: "", photoId: null },
  photo: null,
  founderAuthorId: null,
  storyPhotos: [],
  content,
  updatedAt: "2026-10-26T08:00:00Z",
});

describe("page content", () => {
  it("reads back what the About form saves", () => {
    const saved = {
      ...toAboutValues(page({})),
      storyHeading: "Our story",
      storyText: doc("One.", "Two."),
      milestones: [{ year: "2015", title: "Founded", text: "" }],
      promisesHeading: "What you can expect",
      promises: [{ icon: "chat", title: "Real people", text: "On WhatsApp." }],
      teamIntro: "Local guides.",
    };
    expect(toAboutValues(page(aboutContentOf(saved)))).toEqual(saved);
  });

  it("reads back what the Contact form saves", () => {
    const saved = { ...toContactValues(page({})), replyWhatsApp: "Fast", timeNote: "We reply in the morning.", faqs: [{ question: "Free?", answer: doc("Yes.") }], timeZones: ["Europe/Berlin"] };
    expect(toContactValues(page(contactContentOf(saved)))).toEqual(saved);
  });

  it("turns text saved before rich text into paragraphs", () => {
    expect(toAboutValues(page({ story: ["First.", " ", "Second."] })).storyText).toEqual(doc("First.", "Second."));
    expect(toContactValues(page({ faqs: [{ question: "Free?", answer: "Yes." }] })).faqs).toEqual([{ question: "Free?", answer: doc("Yes.") }]);
  });

  it("opens a broken row as empty parts, keeping the good items", () => {
    const values = toAboutValues(page({ story: "not a list", milestones: [{ title: "Kept" }, 42], promises: null }));
    expect(values).toMatchObject({ promises: [], milestones: [{ year: "", title: "Kept", text: "" }] });
    expect(toContactValues(page("nonsense"))).toMatchObject({ faqs: [], nextSteps: [], timeZones: [], replyWhatsApp: "" });
  });
});
