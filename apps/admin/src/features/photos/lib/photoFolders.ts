import type { IconName } from "@ttn/ui/icon";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { LibraryPhoto, PhotoUse, PhotoUseKind } from "../types";
import { isRecent } from "./uploadTimeGroups";

/** The Photos screen's folders: filled by where each photo is used, so nothing has to be sorted by hand. */
const USE_FOLDERS = [
  { key: "treks", label: "Treks", icon: "hiking", kinds: ["trek"], hasItems: true },
  { key: "regions", label: "Regions", icon: "map", kinds: ["region"], hasItems: true },
  { key: "guides", label: "Travel guides", icon: "article", kinds: ["guide"], hasItems: true },
  { key: "pages", label: "Pages", icon: "description", kinds: ["page"], hasItems: true },
  { key: "adventures", label: "Adventures", icon: "travel_explore", kinds: ["adventure"], hasItems: false },
  { key: "people", label: "People", icon: "groups", kinds: ["author", "trekking_guide", "review"], hasItems: false },
  { key: "company", label: "Company", icon: "verified", kinds: ["settings"], hasItems: false },
] as const satisfies readonly { key: string; label: string; icon: IconName; kinds: readonly PhotoUseKind[]; hasItems: boolean }[];

const ALL = { key: "all", label: "All photos", icon: "photo_library" } as const;
const RECENT = { key: "recent", label: "Recent uploads", icon: "schedule" } as const;
const UNUSED = { key: "unused", label: "Not used yet", icon: "link_off" } as const;

export type PhotoFolderKey = (typeof USE_FOLDERS)[number]["key"] | typeof ALL.key | typeof RECENT.key | typeof UNUSED.key;

/** The folders shown by upload time (Today, Yesterday… then months) rather than as one list. */
export const isTimeFolder = (folder: PhotoFolderKey) => folder === ALL.key || folder === RECENT.key;

/** A sub-folder: one trek, region, guide or page. */
export type PhotoFolderItem = { id: string; label: string; count: number };

export type PhotoFolder = { key: PhotoFolderKey; label: string; icon: IconName; count: number; items: PhotoFolderItem[] };

/** The folder the screen opens, from ?folder=…&item=…; unknown values open all photos. */
export type FolderSelection = { folder: PhotoFolderKey; item: string | null };

const FOLDER_KEYS: readonly string[] = [ALL.key, RECENT.key, ...USE_FOLDERS.map((folder) => folder.key), UNUSED.key];

const isFolderKey = (value: unknown): value is PhotoFolderKey => typeof value === "string" && FOLDER_KEYS.includes(value);

export const parseFolderSelection = (params: { folder?: string | string[]; item?: string | string[] }): FolderSelection => {
  if (!isFolderKey(params.folder)) return { folder: ALL.key, item: null };
  return { folder: params.folder, item: typeof params.item === "string" ? params.item : null };
};

/** The Photos screen at a folder (and sub-folder): "/photos?folder=treks&item=<trek id>"; all photos without one. */
export const photoFolderHref = (folder: PhotoFolderKey, item?: string) => {
  if (folder === ALL.key) return ADMIN_SECTIONS.photos.href;
  const params = new URLSearchParams({ folder, ...(item ? { item } : {}) });
  return `${ADMIN_SECTIONS.photos.href}?${params}`;
};

/** The folder a use belongs in ("people" for an author, a guide or a reviewer). */
export const folderOfUse = (kind: PhotoUseKind) => USE_FOLDERS.find((folder) => (folder.kinds as readonly PhotoUseKind[]).includes(kind));

const countDistinct = (values: readonly string[]) => new Set(values).size;

/** Uses grouped by a key, in their order (Map.groupBy needs Node 21). */
const groupUses = (uses: readonly PhotoUse[], keyOf: (use: PhotoUse) => string) => {
  const groups = new Map<string, PhotoUse[]>();
  for (const use of uses) groups.set(keyOf(use), [...(groups.get(keyOf(use)) ?? []), use]);
  return groups;
};

/** The sub-folders of a folder, by name: each trek (region, guide, page) with how many of its photos there are. */
const itemsOf = (uses: readonly PhotoUse[]): PhotoFolderItem[] => {
  const byItem = groupUses(uses, (use) => use.itemId);
  return [...byItem.entries()]
    .map(([id, itemUses]) => ({ id, label: itemUses[0].itemLabel, count: countDistinct(itemUses.map((use) => use.photoId)) }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/** Every folder with its photo count (a photo used in two places counts in both), in menu order. */
export const buildPhotoFolders = (photos: readonly LibraryPhoto[], uses: readonly PhotoUse[], now: Date): PhotoFolder[] => {
  const known = new Set(photos.map((photo) => photo.id));
  const liveUses = uses.filter((use) => known.has(use.photoId));
  const used = new Set(liveUses.map((use) => use.photoId));

  return [
    { ...ALL, count: photos.length, items: [] },
    { ...RECENT, count: photos.filter((photo) => isRecent(photo, now)).length, items: [] },
    ...USE_FOLDERS.map((folder) => {
      const folderUses = liveUses.filter((use) => folderOfUse(use.kind)?.key === folder.key);
      return {
        key: folder.key,
        label: folder.label,
        icon: folder.icon,
        count: countDistinct(folderUses.map((use) => use.photoId)),
        items: folder.hasItems ? itemsOf(folderUses) : [],
      };
    }),
    { ...UNUSED, count: photos.filter((photo) => !used.has(photo.id)).length, items: [] },
  ];
};

/** The photos in the chosen folder (or sub-folder), newest first as given. */
export const photosInFolder = (photos: readonly LibraryPhoto[], uses: readonly PhotoUse[], { folder, item }: FolderSelection, now: Date) => {
  if (folder === ALL.key) return [...photos];
  if (folder === RECENT.key) return photos.filter((photo) => isRecent(photo, now));

  if (folder === UNUSED.key) {
    const used = new Set(uses.map((use) => use.photoId));
    return photos.filter((photo) => !used.has(photo.id));
  }

  const inFolder = new Set(
    uses.filter((use) => folderOfUse(use.kind)?.key === folder && (item === null || use.itemId === item)).map((use) => use.photoId),
  );
  return photos.filter((photo) => inFolder.has(photo.id));
};

/** Each photo's uses, by photo id. */
export const usesByPhoto = (uses: readonly PhotoUse[]) => groupUses(uses, (use) => use.photoId);
