/** A YouTube video in the library: only its id and title are saved, nothing is uploaded. */
export type LibraryVideo = {
  id: string;
  /** From the YouTube link, e.g. "dQw4w9WgXcQ"; treks and guides refer to the video by it. */
  youtubeId: string;
  title: string;
  createdAt: string;
};

/** What a video can be used by (public.video_uses). */
export const VIDEO_USE_KINDS = ["trek", "guide"] as const;
export type VideoUseKind = (typeof VIDEO_USE_KINDS)[number];

/** One place a video is used, e.g. the trek "Mardi Himal Trek", "Videos". */
export type VideoUse = { youtubeId: string; kind: VideoUseKind; itemId: string; itemLabel: string; detail: string };

/** What the add-a-video form sends: the pasted link (or id) and the title. */
export type NewVideoValues = { youtubeId: string; title: string };
