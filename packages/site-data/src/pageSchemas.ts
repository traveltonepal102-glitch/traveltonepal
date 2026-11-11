import type { WebPageSchemaRow } from "./database.types";

/** What kind of page a block is on: a fixed page, a trek, a region or a travel guide. */
export type SchemaPageKind = WebPageSchemaRow["page_kind"];

type JsonLdObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonLdObject => typeof value === "object" && value !== null && !Array.isArray(value);

/** A block's schemas: the block itself, or the items of its "@graph". Anything else is skipped. */
const blockItems = (data: unknown): JsonLdObject[] => {
  if (!isObject(data)) return [];
  const graph = data["@graph"];
  return Array.isArray(graph) ? graph.filter(isObject) : [data];
};

/** One page of a website, as web_page_schemas names it. */
export type SchemaPageRef = { kind: SchemaPageKind; slug: string };

/**
 * The SEO person's own JSON-LD blocks (admin › Structured data) for these pages as one graph, page by page in the
 * order given and each page's blocks in the admin's order; null when they have none. Several pages: a region website's
 * Home shows its own blocks and its main trek's.
 */
export const toPageSchemasJsonLd = (rows: readonly WebPageSchemaRow[], ...pages: SchemaPageRef[]): JsonLdObject | null => {
  const items = pages.flatMap(({ kind, slug }) =>
    rows
      .filter((row) => row.page_kind === kind && row.page_slug === slug)
      .sort((a, b) => a.position - b.position)
      .flatMap((row) => blockItems(row.data)),
  );
  return items.length > 0 ? { "@context": "https://schema.org", "@graph": items } : null;
};
