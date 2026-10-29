import { z } from "zod";

import { FIXED_PAGES, PAGE_KINDS } from "../constants";
import type { PageRef } from "../types";

const isPageKind = (value: string): value is PageRef["kind"] => (PAGE_KINDS as readonly string[]).includes(value);

/** A page from the address or the browser, or null when it can't be one (a fixed page's slug, otherwise an id). */
export const toPageRef = (kind: string, key: string): PageRef | null => {
  if (!isPageKind(kind)) return null;
  const isValidKey = kind === "page" ? FIXED_PAGES.some((page) => page.slug === key) : z.uuid().safeParse(key).success;
  return isValidKey ? { kind, key } : null;
};

const PAGE_COLUMNS = { page: "site_page_slug", trek: "trek_id", region: "region_id", guide: "article_id" } as const;

/** The page_schemas column that points to this page. */
export const pageColumn = ({ kind }: PageRef) => PAGE_COLUMNS[kind];
