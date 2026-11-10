import { appEnvironment } from "@ttn/config/appEnvironment";

/** The analytics accounts the website reports to, once their ids are set (each is optional). */
export type AnalyticsIds = { googleAnalytics?: string; tagManager?: string; clarity?: string };

const GOOGLE_ANALYTICS_ID = /^G-[A-Z0-9]{4,20}$/;
const TAG_MANAGER_ID = /^GTM-[A-Z0-9]{4,12}$/;
const CLARITY_ID = /^[a-z0-9]{6,20}$/;

const validId = (value: string | undefined, pattern: RegExp) => {
  const id = value?.trim();
  return id && pattern.test(id) ? id : undefined;
};

/**
 * The ids that are set and well formed, on the live site only (NEXT_PUBLIC_APP_ENV=production): development never
 * reports visits. A malformed id is left out rather than loading a broken script.
 */
export const analyticsIdsFrom = (values: { googleAnalytics?: string; tagManager?: string; clarity?: string; isProduction: boolean }): AnalyticsIds => {
  if (!values.isProduction) return {};
  return {
    googleAnalytics: validId(values.googleAnalytics, GOOGLE_ANALYTICS_ID),
    tagManager: validId(values.tagManager, TAG_MANAGER_ID),
    clarity: validId(values.clarity, CLARITY_ID),
  };
};

/** NEXT_PUBLIC_ values are fixed when the site is built, so the browser has them too. */
export const ANALYTICS_IDS = analyticsIdsFrom({
  googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  tagManager: process.env.NEXT_PUBLIC_GTM_ID,
  clarity: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  isProduction: appEnvironment() === "production",
});
