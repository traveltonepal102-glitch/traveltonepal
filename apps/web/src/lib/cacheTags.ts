import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

/**
 * Tags on the website's cached database reads (shared with the admin, which asks the website to refresh a tag
 * when something is saved: app/api/revalidate).
 */
export const CACHE_TAGS = WEBSITE_CACHE_TAGS;

/**
 * How long cached database reads last without a save. Pages change when the admin saves (it refreshes their tags at
 * once through app/api/revalidate), so reads keep the longest life, "max" (rebuilt at most every 30 days). A shorter
 * life only rebuilds unchanged pages: "hours" made crawlers rebuild every page hourly, about 500K ISR writes a month,
 * and Vercel paused the site (2026-11-10). What no save announces (a travel guide whose publish date comes, a review's
 * "5 months ago") shows with the next save of that kind, a deploy, or after 30 days.
 */
export const DATABASE_CACHE_LIFE = "max";

/** The language the website shows for now (German comes with the German site). */
export const WEBSITE_LOCALE = "en";
