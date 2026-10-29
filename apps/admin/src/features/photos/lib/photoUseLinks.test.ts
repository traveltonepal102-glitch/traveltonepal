import { describe, expect, it } from "vitest";

import type { PhotoUse } from "../types";
import { formatFileSize } from "./formatFileSize";
import { photoUseHref, photoUseLabel } from "./photoUseLinks";

const photoUse = (kind: PhotoUse["kind"], itemId: string, itemLabel = "Name", detail = "Cover"): PhotoUse => ({ photoId: "p", kind, itemId, itemLabel, detail });

describe("photoUseHref", () => {
  it("opens the editor of what uses the photo", () => {
    expect(photoUseHref(photoUse("trek", "t1"))).toBe("/treks/t1");
    expect(photoUseHref(photoUse("region", "r1"))).toBe("/regions/r1");
    expect(photoUseHref(photoUse("guide", "g1"))).toBe("/travel-guides/g1");
    expect(photoUseHref(photoUse("adventure", "a1"))).toBe("/adventures?adventure=a1");
    expect(photoUseHref(photoUse("adventure", "section"))).toBe("/adventures");
    expect(photoUseHref(photoUse("trekking_guide", "x"))).toBe("/trekking-guides?guide=x");
    expect(photoUseHref(photoUse("settings", "settings"))).toBe("/settings");
  });

  it("opens each kind of page in its own editor", () => {
    expect(photoUseHref(photoUse("page", "about"))).toBe("/pages/about");
    expect(photoUseHref(photoUse("page", "home"))).toBe("/pages/lists?page=home");
    expect(photoUseHref(photoUse("page", "privacy"))).toBe("/pages/legal?page=privacy");
  });
});

describe("photoUseLabel", () => {
  it("names the thing and the place on it, pages by their Pages name, people by their role", () => {
    expect(photoUseLabel(photoUse("trek", "t1", "Mardi Himal Trek", "Day 3"))).toBe("Mardi Himal Trek · Day 3");
    expect(photoUseLabel(photoUse("page", "about", "about", "Photo 1"))).toBe("About us · Photo 1");
    expect(photoUseLabel(photoUse("trekking_guide", "x", "Pema Sherpa", "Guide photo"))).toBe("Pema Sherpa · Trekking guide");
  });
});

describe("formatFileSize", () => {
  it("writes KB under a megabyte, else MB", () => {
    expect(formatFileSize(703_200)).toBe("687 KB");
    expect(formatFileSize(100)).toBe("1 KB");
    expect(formatFileSize(2_400_000)).toBe("2.3 MB");
  });
});
