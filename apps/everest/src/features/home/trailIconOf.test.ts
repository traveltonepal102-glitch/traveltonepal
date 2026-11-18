import { describe, expect, it } from "vitest";

import { trailIconOf } from "./trailIconOf";

describe("trailIconOf", () => {
  it("draws the editor's icons with the website's own", () => {
    expect(trailIconOf("wb_twilight")).toBe("sun");
    expect(trailIconOf("medical_services")).toBe("shield");
    expect(trailIconOf("payments")).toBe("tag");
  });

  it("falls back to a document for an icon it doesn't know or none", () => {
    expect(trailIconOf("rocket_launch")).toBe("doc");
    expect(trailIconOf(undefined)).toBe("doc");
  });
});
