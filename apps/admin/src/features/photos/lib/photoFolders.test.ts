import { describe, expect, it } from "vitest";

import type { LibraryPhoto, PhotoUse } from "../types";
import { buildPhotoFolders, parseFolderSelection, photoFolderHref, photosInFolder, usesByPhoto } from "./photoFolders";

const photo = (id: string, createdAt = "2026-10-29T07:02:00Z"): LibraryPhoto => ({
  id,
  width: 1600,
  height: 1200,
  baseUrl: `https://photos.example/${id}`,
  variantWidths: [400, 800],
  fileName: null,
  placeholder: "",
  place: "",
  originalName: `${id}.jpg`,
  byteSize: 1000,
  createdAt,
});

const photoUse = (photoId: string, kind: PhotoUse["kind"], itemId: string, itemLabel: string, detail = "Cover"): PhotoUse => ({
  photoId,
  kind,
  itemId,
  itemLabel,
  detail,
});

const NOW = new Date("2026-10-29T10:00:00Z");
// "d" was uploaded in August: not recent.
const PHOTOS = [photo("a"), photo("b"), photo("c"), photo("d", "2026-08-15T05:00:00Z")];
const USES = [
  photoUse("a", "trek", "t2", "Mardi Himal Trek"),
  photoUse("a", "trek", "t2", "Mardi Himal Trek", "Day 3"),
  photoUse("b", "trek", "t1", "Everest Base Camp", "Gallery"),
  photoUse("b", "region", "r1", "Everest"),
  photoUse("c", "author", "p1", "Pema", "Author photo"),
  photoUse("c", "review", "p2", "Anna", "Reviewer photo"),
  // A photo that is no longer in the library is ignored.
  photoUse("gone", "trek", "t1", "Everest Base Camp"),
];

const folder = (key: string) => buildPhotoFolders(PHOTOS, USES, NOW).find((entry) => entry.key === key);
const ids = (photos: readonly LibraryPhoto[]) => photos.map((entry) => entry.id);

describe("buildPhotoFolders", () => {
  it("counts each photo once per folder, in menu order, with every photo and the unused ones", () => {
    expect(buildPhotoFolders(PHOTOS, USES, NOW).map((entry) => [entry.key, entry.count])).toEqual([
      ["all", 4],
      ["recent", 3],
      ["treks", 2],
      ["regions", 1],
      ["guides", 0],
      ["pages", 0],
      ["adventures", 0],
      ["people", 1],
      ["company", 0],
      ["unused", 1],
    ]);
  });

  it("lists each trek as a sub-folder by name, but none for people", () => {
    expect(folder("treks")?.items).toEqual([
      { id: "t1", label: "Everest Base Camp", count: 1 },
      { id: "t2", label: "Mardi Himal Trek", count: 1 },
    ]);
    expect(folder("people")?.items).toEqual([]);
  });
});

describe("photosInFolder", () => {
  it("shows a folder, a sub-folder, every photo, the recent ones or the unused ones", () => {
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "treks", item: null }, NOW))).toEqual(["a", "b"]);
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "treks", item: "t2" }, NOW))).toEqual(["a"]);
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "people", item: null }, NOW))).toEqual(["c"]);
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "all", item: null }, NOW))).toEqual(["a", "b", "c", "d"]);
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "unused", item: null }, NOW))).toEqual(["d"]);
    expect(ids(photosInFolder(PHOTOS, USES, { folder: "recent", item: null }, NOW))).toEqual(["a", "b", "c"]);
  });
});

describe("parseFolderSelection and photoFolderHref", () => {
  it("opens all photos for an unknown folder", () => {
    expect(parseFolderSelection({ folder: "secret", item: "x" })).toEqual({ folder: "all", item: null });
    expect(parseFolderSelection({})).toEqual({ folder: "all", item: null });
    expect(parseFolderSelection({ folder: "treks", item: ["a", "b"] })).toEqual({ folder: "treks", item: null });
  });

  it("round-trips through the address", () => {
    expect(photoFolderHref("all")).toBe("/photos");
    expect(photoFolderHref("treks", "t2")).toBe("/photos?folder=treks&item=t2");
    expect(parseFolderSelection(Object.fromEntries(new URLSearchParams("folder=treks&item=t2")))).toEqual({ folder: "treks", item: "t2" });
  });
});

describe("usesByPhoto", () => {
  it("groups the uses by photo", () => {
    expect(usesByPhoto(USES).get("a")?.map((entry) => entry.detail)).toEqual(["Cover", "Day 3"]);
  });
});
