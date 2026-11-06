import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { PagesOverview } from "@/features/pages/components/PagesOverview";
import { EDITABLE_PAGES, LEGAL_PAGES, LIST_PAGES } from "@/features/pages/constants";
import { listPageUpdates } from "@/features/pages/services/pagesRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.pages.label };

/**
 * Pages (design: Admin-pages): the fixed pages (About, Contact, the list pages and the legal pages) of the site
 * "Working on" shows. Each site has its own.
 */
const PagesPage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  const updates = site ? await listPageUpdates(site.id) : {};
  const savedLabels = Object.fromEntries(
    [...EDITABLE_PAGES, ...LIST_PAGES, ...LEGAL_PAGES].flatMap((page) => {
      const updatedAt = updates[page.slug];
      return updatedAt ? [[page.slug, `Saved ${formatDateTime(updatedAt)}`]] : [];
    }),
  );
  return <PagesOverview siteKind={site?.kind ?? "main"} savedLabels={savedLabels} />;
};

export default PagesPage;
