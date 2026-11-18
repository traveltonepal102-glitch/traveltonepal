import { describe, expect, it } from "vitest";

import { regionName } from "./regionName";

describe("regionName", () => {
  it("writes an English region name the German way", () => {
    expect(regionName("Everest Region")).toBe("Everest-Region");
    expect(regionName("Solu region ")).toBe("Solu-Region");
  });

  it("keeps a name without the word Region", () => {
    expect(regionName("Khumbu")).toBe("Khumbu");
  });
});
