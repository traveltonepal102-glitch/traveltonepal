import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const SITES_PATH = ADMIN_SECTIONS.sites.href;
export const NEW_SITE_PATH = `${SITES_PATH}/new`;
/** A site's edit page. */
export const sitePath = (siteId: string) => `${SITES_PATH}/${siteId}`;

/** What the list says after a save ("?saved=…"). */
export const SAVED_NOTICES = {
  added: "Site added. It stays a draft, hidden from Google, until its domain is set up and it is switched live.",
  changed: "Site saved.",
  deleted: "Site deleted.",
} as const;

export type SavedNotice = keyof typeof SAVED_NOTICES;

export const sitesSavedPath = (notice: SavedNotice) => `${SITES_PATH}?saved=${notice}`;

/** Hard limits, the same as the database checks (supabase/migrations/20261103100000_sites.sql). */
export const SITE_LIMITS = { id: 40, name: 60 } as const;

/** A website's address without a path, e.g. https://manaslutrek.com (the database checks the same). */
export const SITE_URL_PATTERN = /^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/** The site the admin is working on ("Working on"). A UI choice: checked against the sites table on every read. */
export const CURRENT_SITE_COOKIE = "ttn_admin_site";
export const CURRENT_SITE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/** Shown where a site has no address yet. */
export const NO_DOMAIN_LABEL = "Domain not set yet";
