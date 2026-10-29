import { describe, expect, it } from "vitest";

import { daysTipText, howToChooseTips } from "./howToChoose";
import { TREKS } from "./treks";
import type { TrekSummary } from "./types";

const trek = (name: string, days: number): TrekSummary => ({ ...TREKS[0], slug: name.toLowerCase().replaceAll(" ", "-"), name, days });

describe("daysTipText", () => {
  it("names only the treks given, by the filter's lengths", () => {
    expect(daysTipText([trek("Langtang Valley Trek", 10)])).toBe("10–15 days: Langtang Valley Trek.");
    expect(daysTipText([trek("Poon Hill", 5), trek("Langtang Valley Trek", 10), trek("Manaslu Circuit", 16)])).toBe(
      "2–9 days: Poon Hill. 10–15 days: Langtang Valley Trek. 16+ days: Manaslu Circuit.",
    );
  });

  it("joins names with “or” and names at most three per length, in the order given", () => {
    const short = ["A", "B", "C", "D"].map((name) => trek(name, 7));
    expect(daysTipText(short.slice(0, 2))).toBe("2–9 days: A or B.");
    expect(daysTipText(short)).toBe("2–9 days: A, B or C.");
  });

  it("puts each trek in the right length at the edges (1, 2, 9, 10, 15 and 16 days)", () => {
    expect(
      daysTipText([trek("One", 1), trek("Two", 2), trek("Nine", 9), trek("Ten", 10), trek("Fifteen", 15), trek("Sixteen", 16)]),
    ).toBe("1 day: One. 2–9 days: Two or Nine. 10–15 days: Ten or Fifteen. 16+ days: Sixteen.");
  });

  it("describes the lengths without naming treks when there are none", () => {
    expect(daysTipText([])).toBe("Day hikes take 1 day, short treks 2–9 days, classic ones 10–15 days, and long, remote ones 16 days or more.");
  });
});

describe("howToChooseTips", () => {
  it("links to the results and to the guides on each topic, never to a guide page that may not exist", () => {
    expect(howToChooseTips([]).map((tip) => tip.href)).toEqual(["#trek-results", "/travel-guides?topic=health#all-guides", "/travel-guides?topic=best-time#all-guides"]);
  });
});
