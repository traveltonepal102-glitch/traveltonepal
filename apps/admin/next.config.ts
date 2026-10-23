import type { NextConfig } from "next";

import { VARIANT_WIDTHS } from "./src/features/photos/constants";

// Sent with every admin response: no framing (clickjacking), no MIME sniffing, no search indexing.
// The Content-Security-Policy is set per request in src/proxy.ts (it carries a fresh nonce).
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // next/image srcset uses exactly the widths each photo is stored in, so every entry is a real file.
  images: { deviceSizes: VARIANT_WIDTHS, imageSizes: [] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  headers: async () => [{ source: "/:path*", headers: SECURITY_HEADERS }],
};

export default nextConfig;
