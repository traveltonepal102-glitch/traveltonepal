/** The brand name, as search results and shared links show it. */
export const SITE_NAME = "Travel To Nepal";

/**
 * Public address of this site, for canonical links and structured data (they need full URLs).
 * Set SITE_URL for each site's build; local development falls back to the dev server.
 */
export const SITE_URL = new URL(process.env.SITE_URL ?? "http://localhost:3000");

/** "/treks/langtang-valley" → "https://example.com/treks/langtang-valley" */
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
