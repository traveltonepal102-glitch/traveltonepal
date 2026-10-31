import { PHOTO_FILE_NAME_MAX_LENGTH, PHOTO_FILE_NAME_PATTERN } from "@ttn/ui/lib/photos";
import { describe, expect, it } from "vitest";

import { photoFileNameFrom } from "./photoFileName";

describe("photoFileNameFrom", () => {
  it("makes a slug of the uploaded file's name, without its type", () => {
    expect(photoFileNameFrom("tilicho-lake-annapurna-circuit-trek.webp", "nepal")).toBe("tilicho-lake-annapurna-circuit-trek");
    expect(photoFileNameFrom("Thorong La Pass (5,416 m).JPG", "nepal")).toBe("thorong-la-pass-5-416-m");
    expect(photoFileNameFrom("Ränge über Manang.jpeg", "nepal")).toBe("range-uber-manang");
  });

  it("uses the fallback for names a camera or phone made", () => {
    for (const name of ["IMG_2345.jpg", "DSC01234.JPG", "PXL_20261012_093011.jpg", "WhatsApp Image 2026-10-12 at 09.30.11.jpeg", "image.png", "images3.jpeg", "image 5 .jpeg", "1.jpg", "-.jpg", ""]) {
      expect(photoFileNameFrom(name, "langtang")).toBe("langtang");
    }
  });

  it("keeps a camera name with words that describe the photo", () => {
    expect(photoFileNameFrom("IMG_2345 Kyanjin Gompa.jpg", "nepal")).toBe("img-2345-kyanjin-gompa");
  });

  it("stays a valid file name when cut to the longest length", () => {
    const name = photoFileNameFrom(`${"annapurna-".repeat(10)}view.jpg`, "nepal");
    expect(name.length).toBeLessThanOrEqual(PHOTO_FILE_NAME_MAX_LENGTH);
    expect(name).toMatch(PHOTO_FILE_NAME_PATTERN);
  });
});
