import type { WebPageSeoOverrideRow } from "@ttn/site-data/database.types";

import { pagePath } from "@/lib/routes";

/** What the Google card of each trek changes: hidden treks (by slug), and the address a trek names as its main version. */
export type TrekSeoOverrides = { hidden: ReadonlySet<string>; canonicals: ReadonlyMap<string, string> };

/**
 * The Google cards' rules, as on Travel To Nepal: a hidden trek is only hidden; a canonical address counts only when it
 * names a page Google may list (`listedPaths`), not the trek itself, not a hidden trek and not one that points elsewhere too.
 */
export const toTrekSeoOverrides = (rows: readonly WebPageSeoOverrideRow[], listedPaths: ReadonlySet<string>): TrekSeoOverrides => {
  const treks = rows.filter((row) => row.page_kind === "trek");
  const hidden = new Set(treks.filter((row) => row.hide_from_google).map((row) => row.page_slug));
  const naming = treks.filter((row) => !row.hide_from_google && row.canonical_path);
  const notMainPages = new Set([...hidden, ...naming.map((row) => row.page_slug)].map(pagePath));
  const followed = naming.filter((row) => listedPaths.has(row.canonical_path) && !notMainPages.has(row.canonical_path));
  return { hidden, canonicals: new Map(followed.map((row) => [row.page_slug, row.canonical_path])) };
};
