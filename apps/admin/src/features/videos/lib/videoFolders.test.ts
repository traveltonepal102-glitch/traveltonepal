import { describe, expect, it } from "vitest";

import type { LibraryVideo, VideoUse } from "../types";
import { buildVideoFolders, parseVideoFolderSelection, videoFolderHref, videosInFolder } from "./videoFolders";

const video = (youtubeId: string): LibraryVideo => ({ id: `id-${youtubeId}`, youtubeId, title: youtubeId, createdAt: "2026-10-31T09:00:00Z" });

const VIDEOS = [video("aaaaaaaaaaa"), video("bbbbbbbbbbb"), video("ccccccccccc")];

const USES: VideoUse[] = [
  { youtubeId: "aaaaaaaaaaa", kind: "trek", itemId: "t1", itemLabel: "Mardi Himal Trek", detail: "Videos" },
  { youtubeId: "aaaaaaaaaaa", kind: "trek", itemId: "t1", itemLabel: "Mardi Himal Trek", detail: "Trek guide: Teahouses" },
  { youtubeId: "bbbbbbbbbbb", kind: "guide", itemId: "g1", itemLabel: "Best time to visit", detail: "Section 4" },
  // A video no longer in the library counts nowhere.
  { youtubeId: "zzzzzzzzzzz", kind: "trek", itemId: "t2", itemLabel: "Annapurna Circuit", detail: "Videos" },
];

describe("video folders", () => {
  it("counts each video once per folder and lists the treks and guides using them", () => {
    const folders = buildVideoFolders(VIDEOS, USES);
    expect(folders.map((folder) => [folder.key, folder.count])).toEqual([
      ["all", 3],
      ["treks", 1],
      ["guides", 1],
      ["unused", 1],
    ]);
    expect(folders[1].items).toEqual([{ id: "t1", label: "Mardi Himal Trek", count: 1 }]);
  });

  it("shows the videos of the open folder and sub-folder", () => {
    const ids = (folder: Parameters<typeof videosInFolder>[2]) => videosInFolder(VIDEOS, USES, folder).map((item) => item.youtubeId);
    expect(ids({ folder: "all", item: null })).toHaveLength(3);
    expect(ids({ folder: "treks", item: "t1" })).toEqual(["aaaaaaaaaaa"]);
    expect(ids({ folder: "treks", item: "t2" })).toEqual([]);
    expect(ids({ folder: "guides", item: null })).toEqual(["bbbbbbbbbbb"]);
    expect(ids({ folder: "unused", item: null })).toEqual(["ccccccccccc"]);
  });

  it("reads the folder from the address and opens all videos for an unknown one", () => {
    expect(parseVideoFolderSelection({ folder: "treks", item: "t1" })).toEqual({ folder: "treks", item: "t1" });
    expect(parseVideoFolderSelection({ folder: "regions" })).toEqual({ folder: "all", item: null });
    expect(videoFolderHref("all")).toBe("/photos/videos");
    expect(videoFolderHref("treks", "t1")).toBe("/photos/videos?folder=treks&item=t1");
  });
});
