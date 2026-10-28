import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";

import type { SitePage } from "../types";
import { aboutContentOf, toAboutValues } from "./aboutContent";
import { contactContentOf, toContactValues } from "./pageContent";

const doc = (...paragraphs: string[]): RichTextDoc => ({ type: "doc", content: paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })) });

const page = (content: unknown): SitePage => ({
  slug: "about",
  top: { eyebrow: "", heading: "Heading", intro: "", seoTitle: "", seoDescription: "", seoKeyword: "", photoId: null },
  photo: null,
  founderAuthorId: null,
  photoSlots: [],
  content,
  updatedAt: "2026-10-26T08:00:00Z",
});

describe("page content", () => {
  it("reads back what the About form saves", () => {
    const empty = toAboutValues(page({}));
    const saved = {
      ...empty,
      statValue: "All",
      storyHeading: "Our story",
      storyText: doc("One.", "Two."),
      listen: { ...empty.listen, heading: "We listen first", questions: ["Why Nepal?", "", "", ""] },
      goals: [{ title: "Fair pay", text: "For the trail team." }, ...empty.goals.slice(1)],
      promises: [{ icon: "chat", title: "Real people", text: "On WhatsApp." }],
      teamIntro: "Local guides.",
    };
    expect(toAboutValues(page(aboutContentOf(saved)))).toEqual(saved);
  });

  it("gives every fixed list its full number of rows", () => {
    const values = toAboutValues(page({ listen: { steps: [{ title: "Listen", text: "" }] }, goals: "nope" }));
    expect(values.listen.steps).toEqual([{ title: "Listen", text: "" }, { title: "", text: "" }, { title: "", text: "" }]);
    expect(values.listen.questions).toEqual(["", "", "", ""]);
    expect(values.goals).toHaveLength(3);
    expect(values.photoIds).toEqual([null, null, null, null, null]);
  });

  it("reads back what the Contact form saves", () => {
    const saved = { ...toContactValues(page({})), replyWhatsApp: "Fast", timeNote: "We reply in the morning.", faqs: [{ question: "Free?", answer: doc("Yes.") }], timeZones: ["Europe/Berlin"] };
    expect(toContactValues(page(contactContentOf(saved)))).toEqual(saved);
  });

  it("turns text saved before rich text into paragraphs", () => {
    expect(toAboutValues(page({ storyText: "First.\n\nSecond." })).storyText).toEqual(doc("First.", "Second."));
    expect(toContactValues(page({ faqs: [{ question: "Free?", answer: "Yes." }] })).faqs).toEqual([{ question: "Free?", answer: doc("Yes.") }]);
  });

  it("opens a broken row as empty parts, keeping the good items", () => {
    const values = toAboutValues(page({ honest: "not an object", promises: [{ title: "Kept" }, 42] }));
    expect(values.honest.heading).toBe("");
    expect(values.honest.advice).toHaveLength(4);
    expect(values.promises).toEqual([{ icon: "", title: "Kept", text: "" }]);
    expect(toContactValues(page("nonsense"))).toMatchObject({ faqs: [], nextSteps: [], timeZones: [], replyWhatsApp: "" });
  });
});
