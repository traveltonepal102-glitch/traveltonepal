import { describe, expect, it } from "vitest";

import { listedPins, togglePin } from "./articlePins";

describe("togglePin", () => {
  it("pins at the end and unpins, keeping the others in order", () => {
    expect(togglePin([], "a")).toEqual(["a"]);
    expect(togglePin(["a"], "b")).toEqual(["a", "b"]);
    expect(togglePin(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("ignores a fourth pin", () => {
    expect(togglePin(["a", "b", "c"], "d")).toEqual(["a", "b", "c"]);
  });
});

describe("listedPins", () => {
  it("drops a pin whose guide is no longer about the region", () => {
    expect(listedPins(["a", "gone", "b"], ["b", "a"])).toEqual(["a", "b"]);
    expect(listedPins([], ["a"])).toEqual([]);
  });
});
