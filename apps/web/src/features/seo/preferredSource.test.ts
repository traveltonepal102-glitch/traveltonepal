import { describe, expect, it } from "vitest";

import { preferredSourceUrl } from "./preferredSource";

describe("preferredSourceUrl", () => {
  it("names the site's domain, without www", () => {
    expect(preferredSourceUrl(new URL("https://www.traveltonepal.com"))).toBe("https://www.google.com/preferences/source?q=traveltonepal.com");
    expect(preferredSourceUrl(new URL("https://langtangtrek.com/treks"))).toBe("https://www.google.com/preferences/source?q=langtangtrek.com");
  });
});
