/** The two kinds of deployment. Both use the same database and photo storage for now. */
export const APP_ENVIRONMENTS = ["production", "development"] as const;

export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

/**
 * NEXT_PUBLIC_APP_ENV: "production" turns on production-only features (error monitoring). Unset: development.
 * Each app checks the value at start-up (env.ts), so a typo fails there instead of quietly meaning development.
 * NEXT_PUBLIC_ because the browser needs it too: it is fixed when the app is built or `pnpm dev` starts.
 */
export const appEnvironment = (): AppEnvironment =>
  process.env.NEXT_PUBLIC_APP_ENV === "production" ? "production" : "development";
