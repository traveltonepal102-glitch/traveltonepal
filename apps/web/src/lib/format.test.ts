import { describe, expect, it } from "vitest";

import { capitalize, formatCount, formatCountWord } from "./format";
import { firstText } from "./rowText";

describe("count formatting", () => {
  it("writes counts up to ten in words", () => {
    expect(formatCountWord(0)).toBe("zero");
    expect(formatCountWord(6)).toBe("six");
    expect(formatCountWord(10)).toBe("ten");
    expect(formatCountWord(12)).toBe("12");
  });

  it("counts a noun, singular for one", () => {
    expect(formatCount(1, "trek")).toBe("1 trek");
    expect(formatCount(0, "trek")).toBe("0 treks");
    expect(formatCount(12, "trek")).toBe("12 treks");
    expect(formatCount(2, "valley", "valleys")).toBe("2 valleys");
  });

  it("capitalizes the first letter only", () => {
    expect(capitalize("nine regions")).toBe("Nine regions");
    expect(capitalize("")).toBe("");
  });
});

describe("firstText", () => {
  it("gives the first text that isn't blank, trimmed", () => {
    expect(firstText(" Sherpa villages ")).toBe("Sherpa villages");
    expect(firstText("", "  ", " Summary ")).toBe("Summary");
    expect(firstText(null, undefined, "x")).toBe("x");
  });

  it("gives nothing when every text is blank", () => {
    expect(firstText("", " \n ")).toBeUndefined();
    expect(firstText()).toBeUndefined();
  });
});
