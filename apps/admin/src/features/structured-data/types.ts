import type { Json } from "@/lib/supabase/database.types";

/** What kind of page a schema is on: a fixed page (Pages), a trek, a region or a travel guide. */
export type PageKind = "page" | "trek" | "region" | "guide";

/** One page: its kind and key (a fixed page's slug, otherwise the item's id). */
export type PageRef = { kind: PageKind; key: string };

/** A JSON object as stored (schema.org data without "@context"). */
export type JsonObject = { [key: string]: Json | undefined };

/** One page in the Structured data list. */
export type SchemaPage = PageRef & {
  name: string;
  /** e.g. "/treks/langtang-valley". */
  websitePath: string;
  /** "Draft" or "Hidden" when the website doesn't show the page (its schemas wait until it does). */
  offlineNote: string | null;
  schemaCount: number;
  shownCount: number;
};

/** One block as the form shows it: `json` is the text as saved (pretty-printed). */
export type SchemaBlock = { label: string; json: string; isShown: boolean };

/** One block as saved. */
export type SchemaBlockValues = { label: string; data: JsonObject; isShown: boolean };
