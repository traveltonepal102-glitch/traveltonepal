import type { ReactNode } from "react";

import type { TrekFilters } from "../../filtering";
import type { TrekSummary } from "../../types";

export type RegionOption = { slug: string; name: string };

/** What the server hands the browser-side trek explorer. */
export type TrekExplorerData = {
  treks: readonly TrekSummary[];
  regions: readonly RegionOption[];
  /** Server-rendered cards by trek slug; the explorer only shows, hides and orders them. */
  cards: Readonly<Record<string, ReactNode>>;
  /** Under the filters (help card). */
  sidebarFooter: ReactNode;
  /** Under the results (custom trek box). */
  resultsFooter: ReactNode;
};

export type FilterActions = {
  update: (patch: Partial<TrekFilters>) => void;
  clearAll: () => void;
};
