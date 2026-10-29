import { appEnvironment } from "@ttn/config/appEnvironment";

/** The analytics accounts the website reports to, once their ids are set (both are optional). */
export type AnalyticsIds = { googleAnalytics?: string; clarity?: string };

const GOOGLE_ANALYTICS_ID = /^G-[A-Z0-9]{4,20}$/;
const CLARITY_ID = /^[a-z0-9]{6,20}$/;

/**
 * The ids that are set and well formed, on the live site only (NEXT_PUBLIC_APP_ENV=production): development never
 * reports visits. A malformed id is left out rather than loading a broken script.
 */
export const analyticsIdsFrom = (values: { googleAnalytics?: string; clarity?: string; isProduction: boolean }): AnalyticsIds => {
  if (!values.isProduction) return {};
  const googleAnalytics = values.googleAnalytics?.trim();
  const clarity = values.clarity?.trim();
  return {
    googleAnalytics: googleAnalytics && GOOGLE_ANALYTICS_ID.test(googleAnalytics) ? googleAnalytics : undefined,
    clarity: clarity && CLARITY_ID.test(clarity) ? clarity : undefined,
  };
};

/** NEXT_PUBLIC_ values are fixed when the site is built, so the browser has them too. */
export const ANALYTICS_IDS = analyticsIdsFrom({
  googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  clarity: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  isProduction: appEnvironment() === "production",
});
