import { z } from "zod";

import { readList, text } from "@/lib/forms/formFields";

import { MAX_VIDEOS, TREK_LIMITS as LIMIT } from "../constants";
import { youtubeIdFrom } from "../lib/youtube";

const videoSchema = z.object({
  youtubeId: z.string().transform((value, context) => {
    const id = youtubeIdFrom(value);
    if (id) return id;
    context.addIssue({ code: "custom", message: "Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…" });
    return z.NEVER;
  }),
  title: text(LIMIT.videoTitle).min(1, "Write the title shown on the trek page."),
  inGallery: z.string().transform((value) => value === "true"),
  inGuide: z.string().transform((value) => value === "true"),
});

/** The trek's YouTube videos, each once, up to 10. Only the video's id is saved. */
export const videosSchema = z
  .array(videoSchema)
  .max(MAX_VIDEOS, `Up to ${MAX_VIDEOS} videos.`)
  .refine((videos) => new Set(videos.map((video) => video.youtubeId)).size === videos.length, "A video is in the list twice.");

/** Videos in FormData: videoId, videoTitle, videoInGallery and videoInGuide, one of each per video in order. */
export const readVideos = (formData: FormData) => {
  const [titles, galleries, guides] = ["videoTitle", "videoInGallery", "videoInGuide"].map((name) => readList(formData, name));
  return readList(formData, "videoId").map((youtubeId, index) => ({
    youtubeId,
    title: titles[index] ?? "",
    inGallery: galleries[index] ?? "false",
    inGuide: guides[index] ?? "false",
  }));
};
