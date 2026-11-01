import { describe, expect, it } from "vitest";

import { MAX_GALLERY_PHOTOS } from "../constants";
import type { Photo } from "../types";
import { replaceGallery } from "./gallerySelection";

const photo = (id: string): Photo => ({ id, width: 1600, height: 1200, baseUrl: `https://photos.example/${id}`, variantWidths: [400], fileName: null, placeholder: "", place: "" });
const ids = (photos: Photo[]) => photos.map((item) => item.id);

describe("replaceGallery", () => {
  it("keeps the window's order and the cover", () => {
    const next = replaceGallery({ cover: photo("cover") }, [photo("c"), photo("a"), photo("b")]);
    expect(next.cover?.id).toBe("cover");
    expect(ids(next.gallery)).toEqual(["c", "a", "b"]);
  });

  it("never puts the cover in the gallery too", () => {
    expect(ids(replaceGallery({ cover: photo("a") }, [photo("a"), photo("b")]).gallery)).toEqual(["b"]);
  });

  it("keeps each photo once", () => {
    expect(ids(replaceGallery({ cover: null }, [photo("a"), photo("b"), photo("a")]).gallery)).toEqual(["a", "b"]);
  });

  it("keeps at most the gallery's limit", () => {
    const many = Array.from({ length: MAX_GALLERY_PHOTOS + 3 }, (_, index) => photo(`p${index}`));
    expect(replaceGallery({ cover: null }, many).gallery).toHaveLength(MAX_GALLERY_PHOTOS);
  });

  it("can empty the gallery", () => {
    expect(replaceGallery({ cover: photo("a") }, []).gallery).toEqual([]);
  });
});
