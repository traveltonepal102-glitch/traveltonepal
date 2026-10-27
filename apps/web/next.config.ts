import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
