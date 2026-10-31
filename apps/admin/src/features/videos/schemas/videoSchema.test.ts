import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { libraryVideoId, newVideoSchema, videoTitleSchema } from "./videoSchema";

const errorsOf = (input: unknown) => {
  const result = newVideoSchema.safeParse(input);
  return result.success ? {} : toFieldErrors(result.error);
};

describe("video schemas", () => {
  it("keeps only the YouTube id of a pasted link, and the trimmed title", () => {
    expect(newVideoSchema.parse({ youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10", title: " Kyanjin at sunrise " })).toEqual({
      youtubeId: "dQw4w9WgXcQ",
      title: "Kyanjin at sunrise",
    });
  });

  it("refuses a link that isn't a YouTube video, and a missing or long title", () => {
    expect(errorsOf({ youtubeId: "https://vimeo.com/1", title: "A" }).youtubeId).toMatch(/Paste a YouTube video link/);
    expect(errorsOf({ youtubeId: "dQw4w9WgXcQ", title: "  " }).title).toBe("Write the video's title.");
    expect(videoTitleSchema.safeParse({ title: "x".repeat(101) }).success).toBe(false);
  });

  it("asks to choose a library video when an editor sends something else", () => {
    expect(libraryVideoId.parse("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(libraryVideoId.safeParse("").error?.issues[0]?.message).toBe("Choose a video from the library.");
  });
});
