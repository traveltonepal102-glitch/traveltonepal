import { Suspense } from "react";

import type { RegionSummary } from "@/features/regions/regions";

import { TREK_RESULTS_ID } from "../filters";
import type { TrekSummary } from "../types";
import { CustomTrekCta } from "./CustomTrekCta";
import { TrekExplorer, TrekExplorerStatic } from "./explorer/TrekExplorer";
import type { TrekExplorerData } from "./explorer/types";
import { TrekHelpCard } from "./TrekHelpCard";
import { TrekListCard } from "./TrekListCard";

/** No published trek at all: say so plainly (not "no treks match these filters") and offer a custom trek. */
const NoTreksYet = () => (
  <section id={TREK_RESULTS_ID} aria-label="Treks" className="mx-auto scroll-mt-4 flex max-w-content flex-col gap-5 px-4 pt-10 pb-12 md:px-6">
    <div className="flex flex-col gap-1.5">
      <h2 className="text-h3">Our trek list is being updated</h2>
      <p className="max-w-160 text-body text-text">Every trek is still possible: tell us where and when, and we plan it with you.</p>
    </div>
    <CustomTrekCta />
  </section>
);

type TreksBrowserProps = {
  /** Published treks, in the "Recommended" order (listTreks). */
  treks: readonly TrekSummary[];
  /** Every region, for the region filter (listRegions). */
  regions: readonly RegionSummary[];
};

/**
 * Treks page filters and results. Cards are rendered here on the server; the browser-side explorer
 * only filters, sorts and shows them. It reads the URL, which a static page can't know at build time,
 * so it sits in Suspense with a fallback that lists every trek: the pre-built HTML always has them all.
 */
export const TreksBrowser = ({ treks, regions }: TreksBrowserProps) => {
  if (treks.length === 0) return <NoTreksYet />;

  const data: TrekExplorerData = {
    treks,
    regions: regions.map(({ slug, name }) => ({ slug, name })),
    cards: Object.fromEntries(treks.map((trek) => [trek.slug, <TrekListCard key={trek.slug} trek={trek} />])),
    sidebarFooter: <TrekHelpCard />,
    resultsFooter: <CustomTrekCta />,
  };

  return (
    <Suspense fallback={<TrekExplorerStatic {...data} />}>
      <TrekExplorer {...data} />
    </Suspense>
  );
};
