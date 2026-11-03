import type { Site } from "../types";

/**
 * The site "Working on" shows: the one in the cookie when it still exists, else the main site. The cookie is
 * a browser value, so it only ever picks from the sites the database has.
 */
export const pickCurrentSite = (sites: readonly Site[], cookieValue: string | undefined): Site | null =>
  sites.find((site) => site.id === cookieValue) ?? sites.find((site) => site.kind === "main") ?? sites[0] ?? null;

/** "manaslutrek.com" from "https://manaslutrek.com", or null without an address. */
export const siteDomain = (site: Pick<Site, "url">): string | null => (site.url ? new URL(site.url).host : null);
