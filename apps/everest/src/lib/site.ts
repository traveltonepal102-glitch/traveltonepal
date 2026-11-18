import type { SiteLanguage } from "@ttn/config/siteLanguage";

/** This website's id in the admin's Sites: every database read asks for this website's rows. */
export const SITE_ID = "everest";

/**
 * The website's language (decided 2026-11-18: German, addressing visitors as "du", as its brand guide says), the same
 * as its language in the admin's Sites. Its content is typed in German there; its own words are written in German here.
 */
export const SITE_LANGUAGE: SiteLanguage = "de";

/** The brand name, as search results and shared links show it. */
export const SITE_NAME = "Everest Trek";

/** Public address, for canonical links and structured data. Local development falls back to the dev server. */
export const SITE_URL = new URL(process.env.SITE_URL || "http://localhost:3005");

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
