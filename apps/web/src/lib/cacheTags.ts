import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

/**
 * Tags on the website's cached database reads (shared with the admin, which asks the website to refresh a tag
 * when something is saved: app/api/revalidate).
 */
export const CACHE_TAGS = WEBSITE_CACHE_TAGS;

/**
 * How long cached database reads last without a save: a refresh every hour still catches what no save
 * announces, such as a travel guide whose publish date has just come.
 */
export const DATABASE_CACHE_LIFE = "hours";

/** The language the website shows for now (German comes with the German site). */
export const WEBSITE_LOCALE = "en";
