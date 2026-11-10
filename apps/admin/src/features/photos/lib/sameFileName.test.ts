import { describe, expect, it } from "vitest";

import type { NamedPhoto } from "../types";
import { fileNameKey, findSameName } from "./sameFileName";

const photo = (id: string, originalName: string): NamedPhoto => ({
  id,
  width: 1600,
  height: 1200,
  baseUrl: `https://photos.example/${id}`,
  variantWidths: [400],
  fileName: null,
  placeholder: "",
  place: "",
  altText: "",
  caption: "",
  originalName,
});

describe("fileNameKey", () => {
  it("ignores letter case and spaces around the name", () => {
    expect(fileNameKey("  IMG_1234.JPG ")).toBe("img_1234.jpg");
  });
});

describe("findSameName", () => {
  const library = [photo("new", "langtang.jpg"), photo("old", "Langtang.JPG"), photo("other", "IMG_1.jpg")];

  it("finds the newest photo uploaded from a file with the same name", () => {
    expect(findSameName("LANGTANG.jpg", library)?.id).toBe("new");
  });

  it("finds nothing for a new name, or a name that only looks alike", () => {
    expect(findSameName("langtang-valley.jpg", library)).toBeNull();
    expect(findSameName("IMG_1.jpeg", library)).toBeNull();
    expect(findSameName("IMG_1.jpg", [])).toBeNull();
  });
});
