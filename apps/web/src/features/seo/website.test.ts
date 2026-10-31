import { describe, expect, it } from "vitest";

import { ORGANIZATION_ID } from "./organization";
import { websiteJsonLd } from "./website";

describe("websiteJsonLd", () => {
  it("names the site, its other spellings and the company behind it", () => {
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      name: "Travel To Nepal",
      alternateName: ["TravelToNepal", "Travel to Nepal Treks"],
      publisher: { "@id": ORGANIZATION_ID },
    });
  });

  it("points at the home page", () => {
    const { url, "@id": id } = websiteJsonLd();
    expect(new URL(String(url)).pathname).toBe("/");
    expect(id).toBe(`${url}#website`);
  });
});
