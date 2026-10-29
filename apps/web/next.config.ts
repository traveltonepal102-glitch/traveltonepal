import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The build prerenders every page from Supabase. The database's small compute plan answers about 4 heavy reads at
  // once (more and the website's 3 s statement limit cancels them; measured 2026-10-30), and each page makes a few:
  // one worker making 2 pages at a time (the site has under 100 pages), and a page that still fails is tried again
  // before the build gives up.
  experimental: {
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 1000,
    staticGenerationRetryCount: 3,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Error monitoring (src/instrumentation*.ts). With SENTRY_AUTH_TOKEN (Vercel only), a build uploads its source maps
// so reports show the real code, then deletes them; without it, nothing is uploaded.
export default withSentryConfig(nextConfig, {
  org: "travel-to-nepal",
  project: "traveltonepal-web",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  // Only needed for performance tracing, which is off.
  suppressOnRouterTransitionStartWarning: true,
});
