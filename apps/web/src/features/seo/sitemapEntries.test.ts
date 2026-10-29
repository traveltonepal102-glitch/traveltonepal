import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemapEntries";

const SITE = new URL("https://traveltonepal.com");

describe("sitemapEntries", () => {
  const entries = sitemapEntries(
    {
      treks: [
        { slug: "langtang-valley", hasPage: true, updatedAt: "2026-10-24T09:05:11Z" },
        { slug: "no-page-yet", hasPage: false },
      ],
      regions: [
        { slug: "langtang", hasPage: true },
        { slug: "dolpo", hasPage: false },
      ],
      guideSlugs: ["best-time-to-trek-langtang", "best-time-to-trek-langtang"],
    },
    SITE,
  );
  const urls = entries.map((entry) => entry.url);

  it("lists the fixed pages first, as full URLs, without the noindex ones", () => {
    expect(urls.slice(0, 8)).toEqual([
      "https://traveltonepal.com/",
      "https://traveltonepal.com/treks",
      "https://traveltonepal.com/regions",
      "https://traveltonepal.com/travel-guides",
      "https://traveltonepal.com/about",
      "https://traveltonepal.com/contact",
      "https://traveltonepal.com/privacy",
      "https://traveltonepal.com/terms",
    ]);
    expect(urls).not.toContain("https://traveltonepal.com/impressum");
    expect(urls).not.toContain("https://traveltonepal.com/cookies");
  });

  it("leaves out pages that name another page as their main version", () => {
    const source = { treks: [{ slug: "langtang-valley", hasPage: true }], regions: [], guideSlugs: [] };
    const left = sitemapEntries(source, SITE, new Set(["/treks/langtang-valley", "/contact"])).map((entry) => entry.url);
    expect(left).not.toContain("https://traveltonepal.com/treks/langtang-valley");
    expect(left).not.toContain("https://traveltonepal.com/contact");
    expect(left).toContain("https://traveltonepal.com/treks");
  });

  it("lists only treks and regions that have a page, a trek with the day it was last saved", () => {
    expect(entries).toContainEqual({ url: "https://traveltonepal.com/treks/langtang-valley", lastModified: "2026-10-24T09:05:11Z" });
    expect(urls).toContain("https://traveltonepal.com/regions/langtang");
    expect(urls.some((url) => url.includes("no-page-yet") || url.includes("dolpo"))).toBe(false);
  });

  it("lists every address once", () => {
    expect(urls.filter((url) => url.endsWith("/travel-guides/best-time-to-trek-langtang"))).toHaveLength(1);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
