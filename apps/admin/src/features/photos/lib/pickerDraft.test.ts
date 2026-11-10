import { describe, expect, it } from "vitest";

import type { Photo } from "../types";
import { addPick, togglePick } from "./pickerDraft";

const photo = (id: string): Photo => ({ id, width: 1600, height: 1200, baseUrl: `https://photos.example/${id}`, variantWidths: [400], fileName: null, placeholder: "", place: "", altText: "", caption: "" });
const ids = (photos: Photo[]) => photos.map((item) => item.id);
const [a, b, c] = [photo("a"), photo("b"), photo("c")];

describe("togglePick", () => {
  it("adds a photo at the end, in click order", () => {
    expect(ids(togglePick(togglePick([], b, 3), a, 3))).toEqual(["b", "a"]);
  });

  it("takes a chosen photo away and keeps the others' order", () => {
    expect(ids(togglePick([a, b, c], b, 3))).toEqual(["a", "c"]);
  });

  it("adds nothing when full, but still takes photos away", () => {
    expect(ids(togglePick([a, b], c, 2))).toEqual(["a", "b"]);
    expect(ids(togglePick([a, b], a, 2))).toEqual(["b"]);
  });

  it("never changes the draft it was given (Cancel goes back to it)", () => {
    const draft = [a];
    togglePick(draft, b, 3);
    togglePick(draft, a, 3);
    expect(ids(draft)).toEqual(["a"]);
  });
});

describe("addPick", () => {
  it("adds an upload like a click", () => {
    expect(ids(addPick([a], b, 3))).toEqual(["a", "b"]);
  });

  it("never takes a photo away, even when it is already chosen", () => {
    expect(ids(addPick([a, b], a, 3))).toEqual(["a", "b"]);
  });

  it("adds nothing when full", () => {
    expect(ids(addPick([a, b], c, 2))).toEqual(["a", "b"]);
  });
});
