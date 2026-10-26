import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { PagesOverview } from "@/features/pages/components/PagesOverview";
import { EDITABLE_PAGES, LEGAL_PAGES, LIST_PAGES } from "@/features/pages/constants";
import { listPageUpdates } from "@/features/pages/services/pagesRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.pages.label };

/** Pages (design: Admin-pages): the fixed pages of the website (About, Contact, the list pages and the legal pages). */
const PagesPage = async () => {
  await requireAdmin();
  const updates = await listPageUpdates();
  const savedLabels = Object.fromEntries(
    [...EDITABLE_PAGES, ...LIST_PAGES, ...LEGAL_PAGES].flatMap((page) => {
      const updatedAt = updates[page.slug];
      return updatedAt ? [[page.slug, `Saved ${formatDateTime(updatedAt)}`]] : [];
    }),
  );
  return <PagesOverview savedLabels={savedLabels} />;
};

export default PagesPage;
