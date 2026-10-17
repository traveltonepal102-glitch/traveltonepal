import type { Metadata } from "next";

import { NotFoundContent } from "@/features/not-found/components/NotFoundContent";
import { SiteHeader } from "@/features/site-header/components/SiteHeader";

// Next.js answers with HTTP 404 and adds <meta name="robots" content="noindex"> itself (TRD: real 404, noindex).
export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * URLs that match no route. Only the root layout wraps this, so it brings its own header.
 * notFound() inside the (site) group uses app/(site)/not-found.tsx instead.
 */
const NotFound = () => (
  <>
    <SiteHeader />
    <NotFoundContent />
  </>
);

export default NotFound;
