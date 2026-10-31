/** YouTube video ids are 11 characters of letters, digits, "-" and "_". */
const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"]);

/**
 * The video id from what an admin pastes: a watch, share, shorts or embed link, or the id itself. Null when it
 * isn't a YouTube video. Only the id is saved, so the website builds the (privacy-friendly) player link itself.
 */
export const youtubeIdFrom = (input: string): string | null => {
  const value = input.trim();
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;
  const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : (url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean)[1] ?? "");
  return VIDEO_ID.test(id) ? id : null;
};

/** The video's picture on YouTube, for the editor's list. */
export const youtubeThumbnail = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;

export const youtubeWatchUrl = (youtubeId: string) => `https://www.youtube.com/watch?v=${youtubeId}`;
