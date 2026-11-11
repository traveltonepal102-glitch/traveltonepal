import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { env } from "@/env";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import type { Site } from "@/features/sites/types";
import { savePageSchemas } from "@/features/structured-data/actions/savePageSchemas";
import { PageSchemasEditor } from "@/features/structured-data/components/PageSchemasEditor";
import { STRUCTURED_DATA_PATH, automaticSchemas } from "@/features/structured-data/constants";
import { toPageRef } from "@/features/structured-data/lib/pageRef";
import { getPageSchemas, listSchemaPages } from "@/features/structured-data/services/structuredDataRepository";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.structuredData.label };

/** Where Google's test opens the live page: the main website at WEBSITE_URL, a region website at its address in Sites. */
const websiteUrlOf = (site: Site) => (site.kind === "main" ? env.WEBSITE_URL : site.url)?.replace(/\/+$/, "") ?? null;

/**
 * One page's structured data on the website "Working on" shows: /structured-data/<page | trek | region | guide>/<slug or
 * id>. A page the website doesn't have (e.g. after switching websites) goes back to the list.
 */
const PageSchemasPage = async ({ params }: PageProps<"/structured-data/[kind]/[key]">) => {
  const admin = await requireAdmin();
  const { kind, key } = await params;
  const ref = toPageRef(kind, key);
  const site = await getCurrentSite();
  if (!ref || !site) notFound();

  const [pages, { blocks, updatedAt }] = await Promise.all([listSchemaPages(site), getPageSchemas(ref, site.id)]);
  const page = pages.find((candidate) => candidate.kind === ref.kind && candidate.key === ref.key);
  if (!page) redirect(STRUCTURED_DATA_PATH);

  const websiteUrl = websiteUrlOf(site);

  return (
    <PageSchemasEditor
      action={savePageSchemas.bind(null, site.id, ref.kind, ref.key)}
      page={page}
      blocks={blocks}
      automaticSchemas={automaticSchemas(ref, site.kind)}
      pageUrl={websiteUrl ? `${websiteUrl}${page.websitePath}` : null}
      canEdit={admin.role === "super_admin"}
      lastSaved={updatedAt ? `Saved ${formatDateTime(updatedAt)} Nepal time` : "No schemas saved yet"}
    />
  );
};

export default PageSchemasPage;
