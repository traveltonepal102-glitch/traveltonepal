import { describe, expect, it } from "vitest";

import { datesJsonLd, toPageDates, webPageJsonLd } from "./webPage";

describe("toPageDates", () => {
  it("writes Postgres times as plain UTC times", () => {
    expect(toPageDates("2026-10-20 08:00:00.123456+05:45", "2026-10-31T12:30:00.5+00:00")).toEqual({
      published: "2026-10-20T02:15:00Z",
      modified: "2026-10-31T12:30:00Z",
    });
  });

  it("keeps a day as a day", () => {
    expect(toPageDates("2026-10-20T08:00:00Z", "2026-11-02")).toEqual({ published: "2026-10-20T08:00:00Z", modified: "2026-11-02" });
  });

  it("never has a page changed before it was published", () => {
    expect(toPageDates("2026-10-26T06:00:00Z", "2026-10-26")).toEqual({ published: "2026-10-26T06:00:00Z", modified: "2026-10-26T06:00:00Z" });
    expect(toPageDates("2026-10-26T06:00:00Z", "not a date")).toEqual({ published: "2026-10-26T06:00:00Z", modified: "2026-10-26T06:00:00Z" });
  });

  it("has no dates without a published date", () => {
    expect(toPageDates("", "2026-10-26T06:00:00Z")).toBeUndefined();
  });
});

describe("webPageJsonLd", () => {
  it("names the page with its full address and dates", () => {
    expect(webPageJsonLd({ type: "CollectionPage", path: "/treks", name: "Nepal treks", dates: { published: "2026-10-26", modified: "2026-11-02" } })).toEqual({
      "@type": "CollectionPage",
      url: expect.stringMatching(/^https?:\/\/.+\/treks$/),
      name: "Nepal treks",
      datePublished: "2026-10-26",
      dateModified: "2026-11-02",
    });
  });

  it("leaves the dates out when there are none", () => {
    expect(datesJsonLd(undefined)).toEqual({});
    expect(datesJsonLd({ published: "2026-10-26" })).toEqual({ datePublished: "2026-10-26" });
  });
});
