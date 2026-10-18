import { describe, expect, it } from "vitest";

import { regionListItems, trekCountLabel } from "./regionListItems";

describe("regionListItems", () => {
  const items = regionListItems();
  const langtang = items.find((item) => item.slug === "langtang");
  const everest = items.find((item) => item.slug === "everest");

  it("numbers the regions west to east", () => {
    expect(items.map((item) => item.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(langtang?.number).toBe(6);
  });

  it("links a region with a page to it, and others to their treks", () => {
    expect(langtang).toMatchObject({ hasPage: true, href: "/regions/langtang" });
    expect(everest).toMatchObject({ hasPage: false, href: "/treks?region=everest" });
  });

  it("links each trek to its page, or to WhatsApp while it has none", () => {
    expect(langtang?.treks).toEqual([
      expect.objectContaining({ name: "Langtang Valley Trek", days: 10, isInquiry: false, href: "/treks/langtang-valley" }),
    ]);
    expect(everest?.treks.map((trek) => trek.isInquiry)).toEqual([true, true]);
    expect(everest?.treks[0].href).toMatch(/^https:\/\/wa\.me\//);
  });

  it("embeds a keyless Google terrain map centred on the region", () => {
    const url = new URL(langtang?.mapEmbedUrl ?? "");
    expect(url.origin).toBe("https://maps.google.com");
    expect(Object.fromEntries(url.searchParams)).toEqual({ q: "28.21,85.56", z: "9", t: "p", output: "embed" });
  });

  it("counts treks in words", () => {
    expect(trekCountLabel(1)).toBe("1 trek");
    expect(trekCountLabel(3)).toBe("3 treks");
  });
});
