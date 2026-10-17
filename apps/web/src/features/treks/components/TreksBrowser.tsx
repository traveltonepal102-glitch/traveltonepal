import { Suspense } from "react";

import { REGIONS } from "@/features/regions/regions";

import { TREKS } from "../treks";
import { CustomTrekCta } from "./CustomTrekCta";
import { TrekExplorer, TrekExplorerStatic } from "./explorer/TrekExplorer";
import type { TrekExplorerData } from "./explorer/types";
import { TrekHelpCard } from "./TrekHelpCard";
import { TrekListCard } from "./TrekListCard";

/**
 * Treks page filters and results. Cards are rendered here on the server; the browser-side explorer
 * only filters, sorts and shows them. It reads the URL, which a static page can't know at build time,
 * so it sits in Suspense with a fallback that lists every trek: the pre-built HTML always has them all.
 */
export const TreksBrowser = () => {
  const data: TrekExplorerData = {
    treks: TREKS,
    regions: REGIONS.map(({ slug, name }) => ({ slug, name })),
    cards: Object.fromEntries(TREKS.map((trek) => [trek.slug, <TrekListCard key={trek.slug} trek={trek} />])),
    sidebarFooter: <TrekHelpCard />,
    resultsFooter: <CustomTrekCta />,
  };

  return (
    <Suspense fallback={<TrekExplorerStatic {...data} />}>
      <TrekExplorer {...data} />
    </Suspense>
  );
};
