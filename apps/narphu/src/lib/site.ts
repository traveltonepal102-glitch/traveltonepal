/** This website's id in the admin's Sites: every database read asks for this website's rows. */
export const SITE_ID = "narphu";

/** The brand name, as search results and shared links show it. */
export const SITE_NAME = "Nar Phu Trek";

/** Public address, for canonical links and structured data. Local development falls back to the dev server. */
export const SITE_URL = new URL(process.env.SITE_URL || "http://localhost:3004");

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
