import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonChips,
  SkeletonHeading,
  SkeletonLines,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const FACTS = [1, 2, 3, 4, 5, 6] as const;
const NAV_LINKS = [1, 2, 3, 4, 5] as const;

/**
 * A region page in outline: RegionHero (words at its foot), the facts strip over it, the section menu, the overview
 * beside its card and the region's treks.
 */
export const RegionPageSkeleton = () => (
  <PageLoading>
    {/* RegionHero */}
    <div className="flex min-h-140 items-end bg-navy md:min-h-150">
      <div className={`${SKELETON_WRAP} flex flex-col gap-4.5 pt-12 pb-24`}>
        <SkeletonChips count={2} />
        <SkeletonBlock className="h-11 w-3/4 max-w-150 bg-white/25 md:h-18" />
        <SkeletonBlock className="h-5 w-full max-w-160 bg-white/15" />
        <SkeletonChips count={3} />
      </div>
    </div>

    {/* RegionFacts */}
    <div className={`${SKELETON_WRAP} relative z-5 -mt-14`}>
      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-surface shadow-raised md:grid-cols-3 xl:grid-cols-6">
        {FACTS.map((fact) => (
          <div key={fact} className="flex items-center gap-3 border-r border-b border-line px-4 py-4.5">
            <SkeletonBlock className="size-10 flex-none rounded-xl bg-line" />
            <div className="flex w-full flex-col gap-1.5">
              <SkeletonBlock className="h-3 w-3/5 bg-line" />
              <SkeletonBlock className="h-4 w-4/5 bg-line-strong" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PageSectionNav */}
    <div className="mt-7 border-b border-line">
      <div className={`${SKELETON_WRAP} flex gap-7 overflow-hidden py-4`}>
        {NAV_LINKS.map((link) => (
          <SkeletonBlock key={link} className="h-4 w-20 flex-none bg-line" />
        ))}
      </div>
    </div>

    {/* RegionOverview */}
    <div className={`${SKELETON_WRAP} grid items-start gap-8 py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]`}>
      <div className="flex flex-col gap-4.5">
        <SkeletonHeading />
        <SkeletonLines count={6} />
      </div>
      <SkeletonBlock className="h-64 rounded-xl bg-line" />
    </div>

    {/* RegionTreks: a photo beside each trek's facts */}
    <div className={`${SKELETON_WRAP} flex flex-col gap-5 pb-14`}>
      <SkeletonHeading />
      {[1, 2, 3].map((trek) => (
        <div key={trek} className="flex gap-4 rounded-xl border border-line bg-surface p-3">
          <SkeletonBlock className="h-28 w-37.5 flex-none bg-line-strong" />
          <div className="flex w-full flex-col gap-2.5 py-1">
            <SkeletonBlock className="h-3 w-24 bg-line" />
            <SkeletonBlock className="h-5 w-3/5 bg-line-strong" />
            <SkeletonBlock className="h-4 w-4/5 bg-line" />
          </div>
        </div>
      ))}
    </div>
  </PageLoading>
);
