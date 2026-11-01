import { describe, expect, it } from "vitest";

import type { ArticleSection } from "../types";
import { sectionPhotoIds } from "./sectionPhotoIds";

describe("sectionPhotoIds", () => {
  it("lists the photos of the photo and gallery sections, each once, in page order", () => {
    const sections = [
      { id: "1", type: "image", photoId: "p1", caption: "", alt: "" },
      { id: "2", type: "gallery", photoIds: ["p2", "p1", "p3"] },
      { id: "3", type: "image", photoId: null, caption: "", alt: "" },
    ] satisfies ArticleSection[];
    expect(sectionPhotoIds(sections)).toEqual(["p1", "p2", "p3"]);
  });

  it("is empty for a guide without photo sections", () => {
    expect(sectionPhotoIds([])).toEqual([]);
  });
});
