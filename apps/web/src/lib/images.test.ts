import { photoUrl } from "@ttn/ui/lib/photos";
import { describe, expect, it } from "vitest";

import { coverImage, imageFileUrl } from "./images";

const BASE = "https://example.supabase.co/storage/v1/object/public/photos";
const row = { cover_id: "p1", cover_width: 2400, cover_height: 1600, cover_variant_widths: [400, 800, 1200, 2400], cover_placeholder: "data:image/webp;base64,x", cover_place: "Kyanjin Gompa" };

describe("coverImage", () => {
  it("turns a row's cover photo into a picture with its image text", () => {
    expect(coverImage(row, BASE, "Langtang region")).toEqual({
      src: `${BASE}/p1`,
      alt: "Kyanjin Gompa, Langtang region",
      variantWidths: [400, 800, 1200, 2400],
      placeholder: "data:image/webp;base64,x",
    });
    expect(coverImage({ ...row, cover_place: "" }, BASE, "Langtang region")?.alt).toBe("Langtang region");
    expect(coverImage(row, BASE, "Guide", " Snow peaks above Langtang ")?.alt).toBe("Snow peaks above Langtang");
  });

  it("has no picture without a photo", () => {
    expect(coverImage({ ...row, cover_id: null }, BASE, "Everest region")).toBeUndefined();
    expect(coverImage({ ...row, cover_variant_widths: [] }, BASE, "Everest region")).toBeUndefined();
  });

  it("picks the smallest prepared size that fills the space", () => {
    expect(photoUrl({ baseUrl: `${BASE}/p1`, variantWidths: [400, 800, 1200] }, 600)).toBe(`${BASE}/p1/800.webp`);
    expect(photoUrl({ baseUrl: `${BASE}/p1`, variantWidths: [400, 800] }, 3000)).toBe(`${BASE}/p1/800.webp`);
  });
});

describe("imageFileUrl", () => {
  it("links a library photo's prepared size, or a /public file as it is", () => {
    const photo = coverImage(row, BASE, "Langtang region");
    expect(photo && imageFileUrl(photo, 1200)).toBe(`${BASE}/p1/1200.webp`);
    expect(imageFileUrl({ src: "/images/langtang-peaks.jpg", alt: "Langtang" }, 1200)).toBe("/images/langtang-peaks.jpg");
  });

  it("names the file after the photo when it has a file name (for Google)", () => {
    const photo = coverImage({ ...row, cover_file_name: "kyanjin-gompa-langtang" }, BASE, "Langtang region");
    expect(photo?.fileName).toBe("kyanjin-gompa-langtang");
    expect(photo && imageFileUrl(photo, 1200)).toBe(`${BASE}/p1/kyanjin-gompa-langtang-1200.webp`);
  });
});
