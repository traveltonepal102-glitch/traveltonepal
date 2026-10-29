import "server-only";

import { REGION_LOCALE } from "@/features/regions/constants";
import { ARTICLE_LOCALE } from "@/features/travel-guides/constants";
import { TREK_LOCALE } from "@/features/treks/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { FIXED_PAGES, itemWebsitePath } from "../constants";
import { pageColumn } from "../lib/pageRef";
import { formatSchemaJson } from "../lib/schemaJson";
import type { PageRef, SchemaBlock, SchemaBlockValues, SchemaPage } from "../types";

/** Postgres error codes the save can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const RLS_VIOLATION = "42501";

const STATUS_NOTES: Record<string, string> = { draft: "Draft: not on the website yet", hidden: "Hidden from the website" };

type Counts = Map<string, { schemaCount: number; shownCount: number }>;

const countKey = ({ kind, key }: PageRef) => `${kind}:${key}`;

type PageColumns = { site_page_slug: string | null; trek_id: string | null; region_id: string | null; article_id: string | null };

/** The page a saved block is on (exactly one column is set). */
const rowPage = (row: PageColumns): PageRef => {
  if (row.site_page_slug) return { kind: "page", key: row.site_page_slug };
  if (row.trek_id) return { kind: "trek", key: row.trek_id };
  if (row.region_id) return { kind: "region", key: row.region_id };
  return { kind: "guide", key: row.article_id ?? "" };
};

const toSchemaPage = (ref: PageRef, name: string, websitePath: string, status: string | null, counts: Counts): SchemaPage => ({
  ...ref,
  name,
  websitePath,
  offlineNote: (status && STATUS_NOTES[status]) ?? null,
  ...(counts.get(countKey(ref)) ?? { schemaCount: 0, shownCount: 0 }),
});

/** Every page that can have schemas: fixed pages first, then treks, regions and guides A–Z. Throws on a database error. */
export const listSchemaPages = async (): Promise<SchemaPage[]> => {
  const supabase = await createSupabaseServerClient();
  const [schemas, treks, regions, articles] = await Promise.all([
    supabase.from("page_schemas").select("site_page_slug, trek_id, region_id, article_id, is_shown"),
    supabase.from("treks").select("id, slug, status, trek_translations!inner(name)").eq("trek_translations.locale", TREK_LOCALE),
    supabase.from("regions").select("id, slug, region_translations!inner(name)").eq("region_translations.locale", REGION_LOCALE),
    supabase.from("articles").select("id, slug, status, article_translations!inner(title)").eq("article_translations.locale", ARTICLE_LOCALE),
  ]);
  if (schemas.error || treks.error || regions.error || articles.error) {
    const error = schemas.error ?? treks.error ?? regions.error ?? articles.error;
    throw new Error(`Could not load the structured data pages: ${error?.message}`);
  }

  const counts: Counts = new Map();
  for (const row of schemas.data) {
    const key = countKey(rowPage(row));
    const count = counts.get(key) ?? { schemaCount: 0, shownCount: 0 };
    counts.set(key, { schemaCount: count.schemaCount + 1, shownCount: count.shownCount + (row.is_shown ? 1 : 0) });
  }

  const byName = (a: SchemaPage, b: SchemaPage) => a.name.localeCompare(b.name);
  return [
    ...FIXED_PAGES.map((page) => toSchemaPage({ kind: "page", key: page.slug }, page.label, page.websitePath, null, counts)),
    ...treks.data
      .map((row) => toSchemaPage({ kind: "trek", key: row.id }, row.trek_translations[0]?.name ?? row.slug, itemWebsitePath("trek", row.slug), row.status, counts))
      .sort(byName),
    ...regions.data
      .map((row) => toSchemaPage({ kind: "region", key: row.id }, row.region_translations[0]?.name ?? row.slug, itemWebsitePath("region", row.slug), null, counts))
      .sort(byName),
    ...articles.data
      .map((row) => toSchemaPage({ kind: "guide", key: row.id }, row.article_translations[0]?.title || row.slug, itemWebsitePath("guide", row.slug), row.status, counts))
      .sort(byName),
  ];
};

/** One page's blocks in order, as the form shows them, with when they were last saved. Throws on a database error. */
export const getPageSchemas = async (ref: PageRef): Promise<{ blocks: SchemaBlock[]; updatedAt: string | null }> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("page_schemas")
    .select("label, data, is_shown, updated_at")
    .eq(pageColumn(ref), ref.key)
    .order("position");
  if (error) throw new Error(`Could not load the page's structured data: ${error.message}`);

  return {
    blocks: data.map((row) => ({ label: row.label, json: formatSchemaJson(row.data), isShown: row.is_shown })),
    updatedAt: data.reduce<string | null>((latest, row) => (latest && latest > row.updated_at ? latest : row.updated_at), null),
  };
};

export type SavePageSchemasResult = { ok: true } | { ok: false; reason: "not_found" | "forbidden" | "failed" };

/** Replaces one page's blocks (save_page_schemas, one transaction). */
export const savePageSchemas = async (ref: PageRef, blocks: SchemaBlockValues[]): Promise<SavePageSchemasResult> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_page_schemas", {
    p_page_kind: ref.kind,
    p_page_key: ref.key,
    p_schemas: blocks.map((block) => ({ label: block.label, data: block.data, is_shown: block.isShown })),
  });
  if (!error) return { ok: true };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`save_page_schemas failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};
