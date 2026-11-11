import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { StructuredDataOverview } from "@/features/structured-data/components/StructuredDataOverview";
import { listSchemaPages } from "@/features/structured-data/services/structuredDataRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.structuredData.label };

/** Structured data of the website "Working on" shows: every page, with how many of the SEO person's own JSON-LD blocks it has. */
const StructuredDataPage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  return <StructuredDataOverview pages={await listSchemaPages(site)} />;
};

export default StructuredDataPage;
