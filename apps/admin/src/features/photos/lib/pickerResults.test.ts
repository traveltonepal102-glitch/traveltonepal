import { describe, expect, it } from "vitest";

import type { Photo } from "../types";
import { appendPage, prependPhoto } from "./pickerResults";

const photo = (id: string): Photo => ({ id, width: 1600, height: 1200, baseUrl: `https://photos.example/${id}`, variantWidths: [400], fileName: null, placeholder: "", place: "", altText: "", caption: "" });
const ids = (photos: Photo[]) => photos.map((item) => item.id);

describe("appendPage", () => {
  it("adds the next page after the photos shown", () => {
    expect(ids(appendPage([photo("a"), photo("b")], [photo("c"), photo("d")]))).toEqual(["a", "b", "c", "d"]);
  });

  it("shows a photo only once when the pages moved by an upload", () => {
    expect(ids(appendPage([photo("a"), photo("b")], [photo("b"), photo("c")]))).toEqual(["a", "b", "c"]);
  });
});

describe("prependPhoto", () => {
  it("puts a new upload first", () => {
    expect(ids(prependPhoto([photo("a"), photo("b")], photo("new")))).toEqual(["new", "a", "b"]);
  });

  it("moves a photo already shown to the front instead of showing it twice", () => {
    expect(ids(prependPhoto([photo("a"), photo("b")], photo("b")))).toEqual(["b", "a"]);
  });
});
