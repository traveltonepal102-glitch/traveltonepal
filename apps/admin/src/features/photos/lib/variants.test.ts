import { describe, expect, it } from "vitest";

import { pickVariant, pickVariantWidths, photoUrl } from "./variants";

describe("pickVariantWidths", () => {
  it("makes every standard width a large photo covers", () => {
    expect(pickVariantWidths(3000)).toEqual([400, 800, 1200, 1600, 2400]);
    expect(pickVariantWidths(2400)).toEqual([400, 800, 1200, 1600, 2400]);
  });

  it("adds the photo's own width instead of upscaling", () => {
    expect(pickVariantWidths(1000)).toEqual([400, 800, 1000]);
    expect(pickVariantWidths(800)).toEqual([400, 800]);
    expect(pickVariantWidths(600)).toEqual([400, 600]);
  });
});

describe("pickVariant", () => {
  it("serves the smallest file that is wide enough, so pages don't download more than they show", () => {
    const widths = [400, 800, 1200, 1600, 2400];
    expect(pickVariant(widths, 384)).toBe(400);
    expect(pickVariant(widths, 828)).toBe(1200);
    expect(pickVariant(widths, 3840)).toBe(2400);
  });

  it("builds the file address", () => {
    expect(photoUrl({ baseUrl: "https://images.example.com/abc", variantWidths: [400, 1000] }, 600)).toBe(
      "https://images.example.com/abc/1000.webp",
    );
  });
});
