import "server-only";
import type { WebsiteCacheTag } from "@ttn/config/websiteCache";
import { after } from "next/server";

import { env } from "@/env";

import { websiteRefreshRequest } from "./refreshRequest";

const TIMEOUT_MS = 5000;

/**
 * Asks the website to show saved changes now (its cached reads under these tags). It runs after the admin's
 * response is sent, so Save never waits for the website, and a failure never fails the save: it is logged, and
 * the website catches up within the hour. Not set up (no WEBSITE_URL or REVALIDATE_SECRET): nothing is sent.
 */
export const refreshWebsite = (tags: readonly WebsiteCacheTag[]) => {
  if (!env.WEBSITE_URL || !env.REVALIDATE_SECRET) return;
  const request = websiteRefreshRequest(env.WEBSITE_URL, env.REVALIDATE_SECRET, tags);
  if (!request) {
    console.error("Website refresh skipped: WEBSITE_URL must be https:// (http only for localhost).");
    return;
  }

  after(async () => {
    try {
      const response = await fetch(request.url, { ...request.init, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) console.error(`Website refresh failed (HTTP ${response.status}) for: ${tags.join(", ")}`);
    } catch (error) {
      console.error(`Website refresh failed for: ${tags.join(", ")}. ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};
