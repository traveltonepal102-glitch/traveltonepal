import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  redirects: async () => [{ source: "/", destination: "/admin", permanent: false }],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
