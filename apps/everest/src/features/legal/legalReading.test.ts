import { describe, expect, it } from "vitest";

import { legalReadingMinutes } from "./legalReading";

const paragraph = (words: number) => ({ type: "paragraph" as const, content: [{ type: "text" as const, text: Array.from({ length: words }, () => "Wort").join(" ") }] });

describe("legalReadingMinutes", () => {
  it("counts the lead and every section at 200 words a minute", () => {
    expect(legalReadingMinutes({ lead: [paragraph(100)], sections: [{ id: "a", heading: "Zwei Worte", blocks: [paragraph(498)] }] })).toBe(3);
  });

  it("says at least one minute, also for an empty page", () => {
    expect(legalReadingMinutes({ lead: [], sections: [] })).toBe(1);
  });
});
