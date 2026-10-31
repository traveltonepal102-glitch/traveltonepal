import "server-only";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { VIDEO_USE_KINDS } from "../types";
import type { LibraryVideo, NewVideoValues, VideoUse, VideoUseKind } from "../types";

/** Postgres error codes the save can raise. */
const UNIQUE_VIOLATION = "23505";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const VIDEO_COLUMNS = "id, youtube_id, title, created_at";

type VideoRow = { id: string; youtube_id: string; title: string; created_at: string };

const toVideo = (row: VideoRow): LibraryVideo => ({ id: row.id, youtubeId: row.youtube_id, title: row.title, createdAt: row.created_at });

const isUseKind = (value: string): value is VideoUseKind => (VIDEO_USE_KINDS as readonly string[]).includes(value);

/** Every library video, newest first (RLS: admins only). Throws when the database can't be read. */
export const listVideos = async (): Promise<LibraryVideo[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("videos").select(VIDEO_COLUMNS).order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load the video library: ${error.message}`);
  return data.map(toVideo);
};

/** Each library video's title by its YouTube id, for treks (they keep only the id). Once per request. */
export const videoTitleMap = cache(async (): Promise<Map<string, string>> => new Map((await listVideos()).map((video) => [video.youtubeId, video.title])));

/** The library video with this YouTube id, or null. Throws when the database can't be read. */
export const getVideoByYoutubeId = async (youtubeId: string): Promise<LibraryVideo | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("videos").select(VIDEO_COLUMNS).eq("youtube_id", youtubeId).maybeSingle();
  if (error) throw new Error(`Could not load video ${youtubeId}: ${error.message}`);
  return data ? toVideo(data) : null;
};

/** Where videos are used (public.video_uses). Throws when the database can't be read. */
export const listVideoUses = async (): Promise<VideoUse[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("video_uses", {});
  if (error) throw new Error(`Could not find where videos are used: ${error.message}`);
  return data.flatMap((row) =>
    isUseKind(row.kind) ? [{ youtubeId: row.youtube_id, kind: row.kind, itemId: row.item_id, itemLabel: row.item_label, detail: row.detail }] : [],
  );
};

export type SaveVideoResult = { ok: true; videoId: string } | { ok: false; reason: "taken" | "not_found" | "forbidden" | "failed" };

/** Adds a video (videoId null: link and title) or changes a saved one's title (save_video). */
export const saveVideo = async (values: NewVideoValues | { title: string }, videoId: string | null): Promise<SaveVideoResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_video", {
    p_video_id: videoId,
    p_video: { youtube_id: "youtubeId" in values ? values.youtubeId : null, title: values.title },
  });
  if (!error) return { ok: true, videoId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "taken" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`save_video failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

export class VideoInUseError extends Error {}

/** Deletes a video nothing uses (delete_unused_video: Super admins only). False when it was already gone. */
export const deleteUnusedVideo = async (videoId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("delete_unused_video", { p_video_id: videoId });
  if (error?.hint === "video_in_use") throw new VideoInUseError("This video is still used.");
  if (error) throw new Error(`Could not delete video ${videoId}: ${error.code} ${error.message}`);
  return data;
};
