import { WEBSITE_REFRESH_PATH } from "@ttn/config/websiteCache";
import type { WebsiteCacheTag } from "@ttn/config/websiteCache";

export type RefreshRequest = { url: string; init: RequestInit };

/** Plain http only to this computer (development): elsewhere the secret would cross the network readable. */
const isSafeToSend = (url: URL) => url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1";

/**
 * The website's refresh request for these tags (packages/config/src/websiteCache.ts), or null when there is
 * nothing to send or the website's address would expose the secret.
 */
export const websiteRefreshRequest = (websiteUrl: string, secret: string, tags: readonly WebsiteCacheTag[]): RefreshRequest | null => {
  const url = new URL(WEBSITE_REFRESH_PATH, websiteUrl);
  if (tags.length === 0 || !isSafeToSend(url)) return null;
  return {
    url: url.toString(),
    init: {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ tags: [...new Set(tags)] }),
      cache: "no-store",
    },
  };
};
