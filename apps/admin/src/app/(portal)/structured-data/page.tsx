import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { StructuredDataOverview } from "@/features/structured-data/components/StructuredDataOverview";
import { listSchemaPages } from "@/features/structured-data/services/structuredDataRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.structuredData.label };

/** Structured data: every page, with how many of the SEO person's own JSON-LD blocks it has. */
const StructuredDataPage = async () => {
  await requireAdmin();
  return <StructuredDataOverview pages={await listSchemaPages()} />;
};

export default StructuredDataPage;
