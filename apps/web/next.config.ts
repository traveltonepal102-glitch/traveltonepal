import { withSentryConfig } from "@sentry/nextjs/config";
import { VARIANT_WIDTHS } from "@ttn/ui/lib/photos";
import type { NextConfig } from "next";

// Sent with every page. Pages are built ahead (no per-request nonce), so the Content-Security-Policy leaves scripts
// alone and only closes what no page needs: framing by other sites (clickjacking), plugins, <base> and form posts
// to other sites. HSTS here covers www and below; the bare domain's redirect is Vercel's.
const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Links to other sites open with rel="noopener" already; this also keeps other windows from reaching the page.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // next/image widths are the widths library photos are stored in, so each srcset entry names a real file at its real
  // width (with Next's defaults a 400px card picked "640w", which the photo loader turned into the 800px file).
  images: { deviceSizes: VARIANT_WIDTHS, imageSizes: [] },
  headers: async () => [{ source: "/:path*", headers: SECURITY_HEADERS }],
  // The build prerenders every page from Supabase. The database's small compute plan answers about 4 heavy reads at
  // once (more and the website's 3 s statement limit cancels them; measured 2026-10-30), and each page makes a few:
  // one worker making 2 pages at a time (the site has under 100 pages), and a page that still fails is tried again
  // before the build gives up.
  experimental: {
    // Most visitors arrive once from Google: the CSS comes inside the page instead of as a render-blocking request.
    inlineCss: true,
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
