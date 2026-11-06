import { VARIANT_WIDTHS } from "@ttn/ui/lib/photos";
import type { NextConfig } from "next";

// Sent with every page (the same rules as Travel To Nepal's website). Pages are built ahead, so the
// Content-Security-Policy leaves scripts alone and closes only what no page needs.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // next/image widths are the widths library photos are stored in, so each srcset entry names a real file.
  images: { deviceSizes: VARIANT_WIDTHS, imageSizes: [], qualities: [60, 75] },
  headers: async () => [{ source: "/:path*", headers: SECURITY_HEADERS }],
  experimental: {
    inlineCss: true,
    // The database's small compute plan: see apps/web/next.config.ts.
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 1000,
    staticGenerationRetryCount: 3,
  },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};

export default nextConfig;
