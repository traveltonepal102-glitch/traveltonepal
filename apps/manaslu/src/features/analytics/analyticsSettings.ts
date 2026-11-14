import { appEnvironment } from "@ttn/config/appEnvironment";

const TAG_MANAGER_ID = /^GTM-[A-Z0-9]{4,12}$/;

/**
 * This website's Google Tag Manager container, on the live site only (NEXT_PUBLIC_APP_ENV=production): development
 * never reports visits. A missing or malformed id is left out rather than loading a broken script.
 */
export const tagManagerIdFrom = (values: { tagManager?: string; isProduction: boolean }): string | undefined => {
  const id = values.tagManager?.trim();
  return values.isProduction && id && TAG_MANAGER_ID.test(id) ? id : undefined;
};

/** NEXT_PUBLIC_ values are fixed when the site is built, so the browser has them too. */
export const TAG_MANAGER = tagManagerIdFrom({ tagManager: process.env.NEXT_PUBLIC_GTM_ID, isProduction: appEnvironment() === "production" });
