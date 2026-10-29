import { JsonLd } from "@/components/shared/JsonLd";
import type { SitePageSlug } from "@/lib/supabase/database.types";

import { toPageSchemasJsonLd } from "./pageSchemaRows";
import type { SchemaPageKind } from "./pageSchemaRows";
import { listPageSchemas } from "./services/pageSchemasRepository";

/** A fixed page by its slug ("about", "home"…), or a trek, region or guide by its slug. */
type PageSchemasJsonLdProps = { kind: "page"; slug: SitePageSlug } | { kind: Exclude<SchemaPageKind, "page">; slug: string };

/** The SEO person's own JSON-LD for this page (admin › Structured data), after what the page writes by itself. */
export const PageSchemasJsonLd = async ({ kind, slug }: PageSchemasJsonLdProps) => {
  const data = toPageSchemasJsonLd(await listPageSchemas(), kind, slug);
  return data && <JsonLd data={data} />;
};
