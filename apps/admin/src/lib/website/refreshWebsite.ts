import "server-only";
import { MAIN_SITE_ID } from "@ttn/config/sites";
import type { WebsiteCacheTag } from "@ttn/config/websiteCache";
import { after } from "next/server";

import { env } from "@/env";
import { listSites } from "@/features/sites/services/sitesRepository";

import { websiteRefreshRequest } from "./refreshRequest";
import { parseRegionWebsiteUrls, websiteAddressOf } from "./websiteAddresses";

const TIMEOUT_MS = 5000;
const MAIN_SITE = { id: MAIN_SITE_ID, url: null };

const sendRefresh = async (websiteUrl: string, secret: string, tags: readonly WebsiteCacheTag[]) => {
  const request = websiteRefreshRequest(websiteUrl, secret, tags);
  if (!request) {
    console.error(`Website refresh skipped: ${websiteUrl} must be https:// (http only for localhost).`);
    return;
  }
  try {
    const response = await fetch(request.url, { ...request.init, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) console.error(`Website refresh failed (HTTP ${response.status}) at ${websiteUrl} for: ${tags.join(", ")}`);
  } catch (error) {
    console.error(`Website refresh failed at ${websiteUrl} for: ${tags.join(", ")}. ${error instanceof Error ? error.message : String(error)}`);
  }
};

const addressOf = (site: { id: string; url: string | null }) => websiteAddressOf(site, env.WEBSITE_URL, parseRegionWebsiteUrls(env.REGION_WEBSITE_URLS));

/** The sites to refresh; when they can't be read, at least Travel To Nepal (which needs nothing from the database). */
const allSites = async () => {
  try {
    return await listSites();
  } catch (error) {
    console.error(`Website refresh reached only the main site: ${error instanceof Error ? error.message : String(error)}`);
    return [MAIN_SITE];
  }
};

/**
 * Asks one website to show saved changes now (its cached reads under these tags): for what belongs to one website
 * (treks, guides, reviews, pages, settings). It runs after the admin's response is sent, so Save never waits, and a
 * failure never fails the save: it is logged, and the website catches up within the hour. Nothing is sent without
 * REVALIDATE_SECRET or when the website has no address yet.
 */
export const refreshSiteWebsite = (siteId: string, tags: readonly WebsiteCacheTag[]) => {
  const secret = env.REVALIDATE_SECRET;
  if (!secret) return;

  after(async () => {
    const sites = siteId === MAIN_SITE_ID ? [MAIN_SITE] : await allSites();
    const site = sites.find((item) => item.id === siteId);
    const address = site && addressOf(site);
    if (address) await sendRefresh(address, secret, tags);
  });
};

/** The same for every website: for what they all show (regions, trekking guides, authors). */
export const refreshWebsite = (tags: readonly WebsiteCacheTag[]) => {
  const secret = env.REVALIDATE_SECRET;
  if (!secret) return;

  after(async () => {
    const addresses = (await allSites()).flatMap((site) => addressOf(site) ?? []);
    await Promise.all(addresses.map((address) => sendRefresh(address, secret, tags)));
  });
};
