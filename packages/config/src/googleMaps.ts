/*
 * The office on Google Maps, as saved in Site settings: the place's share link and the address of Google's
 * "Embed a map" code. Checked when saved (admin) and again when read (website).
 */

const EMBED_PREFIX = "https://www.google.com/maps/embed?";

/** A Google Maps share or place link, e.g. https://maps.app.goo.gl/… or https://www.google.com/maps/place/…. */
export const isGoogleMapsLink = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "maps.app.goo.gl") return url.pathname.length > 1;
    if (url.hostname === "goo.gl") return url.pathname.startsWith("/maps/");
    if (/^maps\.google\.[a-z.]+$/.test(url.hostname)) return true;
    return /^(www\.)?google\.[a-z.]+$/.test(url.hostname) && url.pathname.startsWith("/maps");
  } catch {
    return false;
  }
};

/** The address Google's "Embed a map" iframe loads (https://www.google.com/maps/embed?pb=…). */
export const isGoogleMapsEmbedUrl = (value: string) => value.startsWith(EMBED_PREFIX) && !/[\s"'<>]/.test(value);

/**
 * The embed address from what was pasted: Google's whole `<iframe …>` code (Share › Embed a map › Copy HTML) or
 * only its src. Null when it is neither.
 */
export const toGoogleMapsEmbedUrl = (pasted: string): string | null => {
  const text = pasted.trim();
  const src = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(text)?.[1] ?? text;
  const url = src.trim().replace(/&amp;/g, "&");
  return isGoogleMapsEmbedUrl(url) ? url : null;
};
