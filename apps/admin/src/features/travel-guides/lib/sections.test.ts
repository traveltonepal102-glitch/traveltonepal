import { describe, expect, it } from "vitest";

import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import { storedSection } from "../services/storedSections";
import type { ArticleSection } from "../types";
import { readMinutes } from "./readTime";
import { copySection, newSection } from "./sectionDrafts";

const doc = (words: number) => ({ type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text: Array(words).fill("word").join(" ") }] }] });

describe("readMinutes", () => {
  it("counts the intro and the body at 200 words a minute, at least 1", () => {
    const sections: ArticleSection[] = [
      { id: null, type: "text", heading: "Autumn views", tocLabel: "", body: doc(398) },
      { id: null, type: "trek", trekId: "t1" },
      { id: null, type: "faq", items: [{ question: "Winter?", answer: doc(99) }] },
      { id: null, type: "paragraph", body: doc(200) },
    ];
    expect(readMinutes({ intro: "", sections: [] })).toBe(1);
    expect(readMinutes({ intro: "", sections })).toBe(4);
    expect(readMinutes({ intro: "One two.", sections: sections.slice(0, 1) })).toBe(3);
  });
});

describe("section drafts", () => {
  it("starts each kind empty, and copies a section as a new one", () => {
    expect(newSection("paragraph")).toEqual({ id: null, type: "paragraph", body: EMPTY_RICH_TEXT });
    expect(newSection("quick")).toEqual({ id: null, type: "quick", body: EMPTY_RICH_TEXT });
    expect(newSection("trek")).toEqual({ id: null, type: "trek", trekId: null });
    const faq = newSection("faq");
    expect(faq.type === "faq" && faq.items).toHaveLength(1);
    expect(copySection({ id: "s1", type: "text", heading: "Spring", tocLabel: "", body: EMPTY_RICH_TEXT })).toMatchObject({ id: null, heading: "Spring" });
  });
});

describe("storedSection", () => {
  it("reads a saved section, and an unreadable one as empty to fix in the editor", () => {
    expect(storedSection({ id: "s1", type: "trek", trek_id: "t1", settings: {} }, {})).toEqual({ id: "s1", type: "trek", trekId: "t1" });
    expect(storedSection({ id: "s2", type: "text", trek_id: null, settings: {} }, { heading: "Autumn", tocLabel: "Autumn", body: doc(2) })).toMatchObject({ heading: "Autumn" });
    expect(storedSection({ id: "s3", type: "faq", trek_id: null, settings: {} }, undefined)).toEqual({ id: "s3", type: "faq", items: [] });
    expect(storedSection({ id: "s4", type: "quick", trek_id: null, settings: {} }, { body: "not a document" })).toEqual({ id: "s4", type: "quick", body: EMPTY_RICH_TEXT });
    expect(storedSection({ id: "s5", type: "paragraph", trek_id: null, settings: {} }, { body: doc(2) })).toEqual({ id: "s5", type: "paragraph", body: doc(2) });
  });
});
