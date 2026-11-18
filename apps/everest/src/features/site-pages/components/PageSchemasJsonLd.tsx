import type { SitePageSlug } from "@ttn/site-data/database.types";
import { toPageSchemasJsonLd } from "@ttn/site-data/pageSchemas";

import { JsonLd } from "@/components/shared/JsonLd";

import { listPageSchemas } from "../services/pageSchemasRepository";

/** A fixed page by its slug ("about", "home"…), or a trek or blog by its slug. */
type PageSchemaRef = { kind: "page"; slug: SitePageSlug } | { kind: "trek" | "guide"; slug: string };

/**
 * The SEO person's own JSON-LD for these pages (admin › Structured data, this website's), after what the page writes by
 * itself. Home names two: its own blocks and its main trek's.
 */
export const PageSchemasJsonLd = async ({ pages }: { pages: PageSchemaRef[] }) => {
  const data = toPageSchemasJsonLd(await listPageSchemas(), ...pages);
  return data && <JsonLd data={data} />;
};
