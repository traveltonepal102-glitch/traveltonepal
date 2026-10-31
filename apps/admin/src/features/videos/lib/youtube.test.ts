import { describe, expect, it } from "vitest";

import { youtubeIdFrom } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("youtubeIdFrom", () => {
  it("reads the id from every kind of YouTube link, or the id itself", () => {
    for (const input of [
      ID,
      ` https://www.youtube.com/watch?v=${ID}&t=42s `,
      `youtube.com/watch?v=${ID}`,
      `https://m.youtube.com/watch?v=${ID}`,
      `https://youtu.be/${ID}?si=abc`,
      `https://www.youtube.com/shorts/${ID}`,
      `https://www.youtube.com/embed/${ID}`,
      `https://www.youtube-nocookie.com/embed/${ID}`,
    ]) {
      expect(youtubeIdFrom(input)).toBe(ID);
    }
  });

  it("refuses other sites, channels and broken ids", () => {
    expect(youtubeIdFrom(`https://vimeo.com/watch?v=${ID}`)).toBeNull();
    expect(youtubeIdFrom(`https://youtube.com.evil.example/watch?v=${ID}`)).toBeNull();
    expect(youtubeIdFrom("https://www.youtube.com/@traveltonepal")).toBeNull();
    expect(youtubeIdFrom("https://youtu.be/short")).toBeNull();
    expect(youtubeIdFrom("")).toBeNull();
  });
});
