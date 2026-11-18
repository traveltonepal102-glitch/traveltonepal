import type { WebPageSeoOverrideRow } from "@ttn/site-data/database.types";

import { pagePath } from "@/lib/routes";

/** What the Google cards of treks and blogs change, by page path: hidden pages, and the address a page names as its main version. */
export type PageSeoOverrides = { hidden: ReadonlySet<string>; canonicals: ReadonlyMap<string, string> };

/**
 * The Google cards' rules, as on Travel To Nepal: a hidden page is only hidden; a canonical address counts only when it
 * names a page Google may list (`listedPaths`), not the page itself, not a hidden page and not one that points elsewhere too.
 */
export const toPageSeoOverrides = (rows: readonly WebPageSeoOverrideRow[], listedPaths: ReadonlySet<string>): PageSeoOverrides => {
  const pages = rows.flatMap((row) => (row.page_kind === "trek" || row.page_kind === "guide" ? [{ path: pagePath(row.page_slug), target: row.canonical_path, isHidden: row.hide_from_google }] : []));
  const hidden = new Set(pages.filter((page) => page.isHidden).map((page) => page.path));
  const naming = pages.filter((page) => !page.isHidden && page.target);
  const notMainPages = new Set([...hidden, ...naming.map((page) => page.path)]);
  const followed = naming.filter((page) => listedPaths.has(page.target) && !notMainPages.has(page.target));
  return { hidden, canonicals: new Map(followed.map((page) => [page.path, page.target])) };
};
