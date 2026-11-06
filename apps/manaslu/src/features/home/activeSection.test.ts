import { describe, expect, it } from "vitest";

import { activeSectionAt } from "./activeSection";

const sections = [
  { id: "intro", top: 100, bottom: 400 },
  // A gap with a section the menu doesn't list.
  { id: "itinerary", top: 600, bottom: 900 },
  { id: "faq", top: 1000, bottom: 1200 },
];

describe("the section being read", () => {
  it("is none above the first section", () => {
    expect(activeSectionAt(sections, 50)).toBeNull();
  });

  it("is the last one that has reached the line", () => {
    expect(activeSectionAt(sections, 100)).toBe("intro");
    expect(activeSectionAt(sections, 700)).toBe("itinerary");
  });

  it("stays on the one before in a gap or a section without a link", () => {
    expect(activeSectionAt(sections, 500)).toBe("intro");
  });

  it("is none past the end of the last one", () => {
    expect(activeSectionAt(sections, 1100)).toBe("faq");
    expect(activeSectionAt(sections, 1300)).toBeNull();
  });

  it("is none without sections", () => {
    expect(activeSectionAt([], 100)).toBeNull();
  });
});
