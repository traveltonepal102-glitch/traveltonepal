import type { Metadata } from "next";

import { NotFoundContent } from "@/features/not-found/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
};

/** notFound() on a page in the (site) group, e.g. an unknown trek. The group's layout already shows the header. */
const SiteNotFound = () => <NotFoundContent />;

export default SiteNotFound;
