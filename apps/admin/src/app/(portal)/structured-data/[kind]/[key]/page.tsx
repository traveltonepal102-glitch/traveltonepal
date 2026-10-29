import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { savePageSchemas } from "@/features/structured-data/actions/savePageSchemas";
import { PageSchemasEditor } from "@/features/structured-data/components/PageSchemasEditor";
import { automaticSchemas } from "@/features/structured-data/constants";
import { toPageRef } from "@/features/structured-data/lib/pageRef";
import { getPageSchemas, listSchemaPages } from "@/features/structured-data/services/structuredDataRepository";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.structuredData.label };

/** One page's structured data: /structured-data/<page | trek | region | guide>/<slug or id>. */
const PageSchemasPage = async ({ params }: PageProps<"/structured-data/[kind]/[key]">) => {
  const admin = await requireAdmin();
  const { kind, key } = await params;
  const ref = toPageRef(kind, key);
  if (!ref) notFound();

  const [pages, { blocks, updatedAt }] = await Promise.all([listSchemaPages(), getPageSchemas(ref)]);
  const page = pages.find((candidate) => candidate.kind === ref.kind && candidate.key === ref.key);
  if (!page) notFound();

  const websiteUrl = env.WEBSITE_URL?.replace(/\/+$/, "");

  return (
    <PageSchemasEditor
      action={savePageSchemas.bind(null, ref.kind, ref.key)}
      page={page}
      blocks={blocks}
      automaticSchemas={automaticSchemas(ref)}
      pageUrl={websiteUrl ? `${websiteUrl}${page.websitePath}` : null}
      canEdit={admin.role === "super_admin"}
      lastSaved={updatedAt ? `Saved ${formatDateTime(updatedAt)} Nepal time` : "No schemas saved yet"}
    />
  );
};

export default PageSchemasPage;
