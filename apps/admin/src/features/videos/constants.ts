import { ADMIN_SECTIONS } from "@/features/shell/navigation";

/** The Videos tab of the Photos and videos screen. */
export const VIDEOS_PATH = `${ADMIN_SECTIONS.photos.href}/videos`;
/** The list with a video's edit panel open ("new" for an empty one). */
export const videoPath = (videoId: string) => `${VIDEOS_PATH}?video=${videoId}`;
export const NEW_VIDEO_PATH = videoPath("new");

/** What the list says after the panel closed ("?saved=…"). */
export const SAVED_NOTICES = { added: "Video added.", changed: "Video saved.", deleted: "Video deleted." } as const;

export type SavedNotice = keyof typeof SAVED_NOTICES;

export const videosSavedPath = (notice: SavedNotice) => `${VIDEOS_PATH}?saved=${notice}`;

/** Hard limits, the same as the database checks (supabase/migrations/20261031100000_video_library.sql). */
export const VIDEO_LIMITS = { title: 100 } as const;
