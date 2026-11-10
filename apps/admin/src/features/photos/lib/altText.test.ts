import { describe, expect, it } from "vitest";

import { photoAltText } from "./altText";

describe("photoAltText", () => {
  it("names the place and the region", () => {
    expect(photoAltText({ place: " Kyanjin Gompa " }, "Langtang region")).toBe("Kyanjin Gompa, Langtang region");
  });

  it("uses the photo's own alt text when it has one", () => {
    expect(photoAltText({ place: "Kyanjin Gompa", altText: " Prayer flags above Kyanjin Gompa " }, "Langtang region")).toBe("Prayer flags above Kyanjin Gompa");
    expect(photoAltText({ place: "Kyanjin Gompa", altText: "  " }, "Langtang region")).toBe("Kyanjin Gompa, Langtang region");
  });

  it("falls back to the region when no place is given", () => {
    expect(photoAltText({ place: "" }, "Langtang region")).toBe("Langtang region");
    expect(photoAltText({ place: "   " }, "Langtang region")).toBe("Langtang region");
  });
});
