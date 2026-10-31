import { z } from "zod";

import { readText, requiredText } from "@/lib/forms/formFields";

import { VIDEO_LIMITS as LIMIT } from "../constants";
import { youtubeIdFrom } from "../lib/youtube";
import type { NewVideoValues } from "../types";

const title = requiredText(LIMIT.title, "Write the video's title.");

/** A pasted YouTube link (watch, share, shorts or embed) or id, as the video's id. */
export const youtubeLink = z.string().transform((value, context) => {
  const id = youtubeIdFrom(value);
  if (id) return id;
  context.addIssue({ code: "custom", message: "Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…" });
  return z.NEVER;
});

/** A trek's or guide's video: a library video's YouTube id (the database checks it is in the library). */
export const libraryVideoId = z.string().transform((value, context) => {
  const id = youtubeIdFrom(value);
  if (id) return id;
  context.addIssue({ code: "custom", message: "Choose a video from the library." });
  return z.NEVER;
});

/** A new video: its link and title. Checked again on the server before saving. */
export const newVideoSchema = z.object({ youtubeId: youtubeLink, title }) satisfies z.ZodType<NewVideoValues, unknown>;

/** A saved video: only the title changes (treks and guides refer to the link). */
export const videoTitleSchema = z.object({ title });

/** The panel's FormData as the schemas expect it ("link" is sent only for a new video). */
export const readVideoForm = (formData: FormData) => ({ youtubeId: readText(formData, "link"), title: readText(formData, "title") });
