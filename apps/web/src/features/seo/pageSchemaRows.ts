import type { JsonLdData } from "@/lib/jsonLd";
import type { WebPageSchemaRow } from "@/lib/supabase/database.types";

export type SchemaPageKind = WebPageSchemaRow["page_kind"];

const isObject = (value: unknown): value is JsonLdData => typeof value === "object" && value !== null && !Array.isArray(value);

/** A block's schemas: the block itself, or the items of its "@graph". Anything else is skipped. */
const blockItems = (data: unknown): JsonLdData[] => {
  if (!isObject(data)) return [];
  const graph = data["@graph"];
  return Array.isArray(graph) ? graph.filter(isObject) : [data];
};

/**
 * One page's own JSON-LD blocks (Structured data in the admin) as one graph, in the admin's order; null when the
 * page has none.
 */
export const toPageSchemasJsonLd = (rows: readonly WebPageSchemaRow[], kind: SchemaPageKind, slug: string): JsonLdData | null => {
  const items = rows
    .filter((row) => row.page_kind === kind && row.page_slug === slug)
    .sort((a, b) => a.position - b.position)
    .flatMap((row) => blockItems(row.data));
  return items.length > 0 ? { "@context": "https://schema.org", "@graph": items } : null;
};
