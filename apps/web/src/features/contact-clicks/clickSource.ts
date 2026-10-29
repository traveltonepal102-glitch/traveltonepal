/** Where the website's WhatsApp and email links lead through, and so where a click is counted. */
export type ContactChannel = "whatsapp" | "email";

const MAX_PAGE_PATH = 200;

/**
 * The page a click came from, as a path ("/treks/langtang-valley"), from the browser's Referer: only one of our own
 * pages counts, never a query (it can hold what a visitor typed). "" when the browser didn't say or it isn't ours.
 */
export const clickPagePath = (referer: string | null, siteOrigin: string): string => {
  if (!referer) return "";
  try {
    const url = new URL(referer);
    if (url.origin !== siteOrigin) return "";
    return url.pathname.slice(0, MAX_PAGE_PATH);
  } catch {
    return "";
  }
};

/** True for a request the browser makes ahead of a click (Next's link prefetch, speculation rules): not a click. */
export const isPrefetch = (headers: Headers) =>
  headers.has("next-router-prefetch") || headers.get("purpose") === "prefetch" || /prefetch/i.test(headers.get("sec-purpose") ?? "");
