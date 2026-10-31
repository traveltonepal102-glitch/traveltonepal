import type { LibraryFolder, LibrarySelection, PhotoFolderItem } from "@/features/photos/lib/photoFolders";

import { VIDEOS_PATH } from "../constants";
import type { LibraryVideo, VideoUse } from "../types";

/** The Videos tab's folders: filled by where each video is used, like the photos'. */
const USE_FOLDERS = [
  { key: "treks", label: "Treks", icon: "hiking", kind: "trek" },
  { key: "guides", label: "Travel guides", icon: "article", kind: "guide" },
] as const;

const ALL = { key: "all", label: "All videos", icon: "smart_display" } as const;
const UNUSED = { key: "unused", label: "Not used yet", icon: "link_off" } as const;

export type VideoFolderKey = (typeof USE_FOLDERS)[number]["key"] | typeof ALL.key | typeof UNUSED.key;
export type VideoFolder = LibraryFolder<VideoFolderKey>;
export type VideoFolderSelection = LibrarySelection<VideoFolderKey>;

const FOLDER_KEYS: readonly string[] = [ALL.key, ...USE_FOLDERS.map((folder) => folder.key), UNUSED.key];

const isFolderKey = (value: unknown): value is VideoFolderKey => typeof value === "string" && FOLDER_KEYS.includes(value);

/** The folder the tab opens, from ?folder=…&item=…; unknown values open all videos. */
export const parseVideoFolderSelection = (params: { folder?: string | string[]; item?: string | string[] }): VideoFolderSelection => {
  if (!isFolderKey(params.folder)) return { folder: ALL.key, item: null };
  return { folder: params.folder, item: typeof params.item === "string" ? params.item : null };
};

/** "/photos/videos?folder=treks&item=<trek id>"; all videos without a folder. */
export const videoFolderHref = (folder: VideoFolderKey, item?: string) => {
  if (folder === ALL.key) return VIDEOS_PATH;
  return `${VIDEOS_PATH}?${new URLSearchParams({ folder, ...(item ? { item } : {}) })}`;
};

const folderOf = (key: VideoFolderKey) => USE_FOLDERS.find((folder) => folder.key === key);

/** The folder a use belongs in, by its label (for the delete window). */
export const folderLabelOfUse = (use: VideoUse) => USE_FOLDERS.find((folder) => folder.kind === use.kind)?.label ?? "Other";

/** Each trek (guide) with how many of its videos there are, by name. */
const itemsOf = (uses: readonly VideoUse[]): PhotoFolderItem[] => {
  const byItem = new Map<string, { label: string; ids: Set<string> }>();
  for (const use of uses) {
    const item = byItem.get(use.itemId) ?? { label: use.itemLabel, ids: new Set<string>() };
    item.ids.add(use.youtubeId);
    byItem.set(use.itemId, item);
  }
  return [...byItem.entries()].map(([id, { label, ids }]) => ({ id, label, count: ids.size })).sort((a, b) => a.label.localeCompare(b.label));
};

/** Every folder with its video count (a video used in two places counts in both), in menu order. */
export const buildVideoFolders = (videos: readonly LibraryVideo[], uses: readonly VideoUse[]): VideoFolder[] => {
  const known = new Set(videos.map((video) => video.youtubeId));
  const liveUses = uses.filter((use) => known.has(use.youtubeId));
  const used = new Set(liveUses.map((use) => use.youtubeId));

  return [
    { ...ALL, count: videos.length, items: [] },
    ...USE_FOLDERS.map(({ key, label, icon, kind }) => {
      const folderUses = liveUses.filter((use) => use.kind === kind);
      return { key, label, icon, count: new Set(folderUses.map((use) => use.youtubeId)).size, items: itemsOf(folderUses) };
    }),
    { ...UNUSED, count: videos.filter((video) => !used.has(video.youtubeId)).length, items: [] },
  ];
};

/** The videos in the chosen folder (or sub-folder), newest first as given. */
export const videosInFolder = (videos: readonly LibraryVideo[], uses: readonly VideoUse[], { folder, item }: VideoFolderSelection) => {
  if (folder === ALL.key) return [...videos];
  const used = new Set(uses.map((use) => use.youtubeId));
  if (folder === UNUSED.key) return videos.filter((video) => !used.has(video.youtubeId));

  const kind = folderOf(folder)?.kind;
  const inFolder = new Set(uses.filter((use) => use.kind === kind && (item === null || use.itemId === item)).map((use) => use.youtubeId));
  return videos.filter((video) => inFolder.has(video.youtubeId));
};

/** Each video's uses, by YouTube id. */
export const usesByVideo = (uses: readonly VideoUse[]) => {
  const groups = new Map<string, VideoUse[]>();
  for (const use of uses) groups.set(use.youtubeId, [...(groups.get(use.youtubeId) ?? []), use]);
  return groups;
};
