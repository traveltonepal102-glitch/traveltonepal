import { z } from "zod";

import { libraryVideoId } from "@/features/videos/schemas/videoSchema";
import { readList } from "@/lib/forms/formFields";

import { MAX_VIDEOS } from "../constants";

const videoSchema = z.object({
  youtubeId: libraryVideoId,
  inGallery: z.string().transform((value) => value === "true"),
  inGuide: z.string().transform((value) => value === "true"),
});

/** The trek's videos from the library, each once, up to 10. The database checks each one is in the library. */
export const videosSchema = z
  .array(videoSchema)
  .max(MAX_VIDEOS, `Up to ${MAX_VIDEOS} videos.`)
  .refine((videos) => new Set(videos.map((video) => video.youtubeId)).size === videos.length, "A video is in the list twice.");

/** Videos in FormData: videoId, videoInGallery and videoInGuide, one of each per video in order. */
export const readVideos = (formData: FormData) => {
  const [galleries, guides] = ["videoInGallery", "videoInGuide"].map((name) => readList(formData, name));
  return readList(formData, "videoId").map((youtubeId, index) => ({
    youtubeId,
    inGallery: galleries[index] ?? "false",
    inGuide: guides[index] ?? "false",
  }));
};
