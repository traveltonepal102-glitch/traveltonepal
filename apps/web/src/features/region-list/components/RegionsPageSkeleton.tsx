import { PageLoading } from "@/components/shared/PageLoading";
import {
  SkeletonCards,
  SkeletonChips,
  SkeletonHeading,
  SkeletonLines,
  SkeletonNavyTop,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/**
 * The Regions page in outline: RegionsHero, the map beside the region list, the region cards, the picks band and the
 * comparison table.
 */
export const RegionsPageSkeleton = () => (
  <PageLoading>
    <SkeletonNavyTop className="pt-5.5 pb-12">
      <SkeletonChips count={3} />
    </SkeletonNavyTop>

    {/* The map section (RegionMapExplorer) */}
    <SkeletonSection className="pt-10 pb-4">
      <SkeletonHeading />
      <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <SkeletonBlock className="aspect-4/3 w-full rounded-xl bg-line-strong sm:aspect-2/1 lg:aspect-auto lg:min-h-90" />
        <div className="flex flex-col gap-3.5 rounded-xl border border-line bg-surface p-4.5 md:p-5">
          <SkeletonBlock className="h-6 w-1/2 bg-line-strong" />
          <SkeletonLines count={3} />
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((cell) => (
              <SkeletonBlock key={cell} className="h-14 bg-line" />
            ))}
          </div>
        </div>
      </div>
    </SkeletonSection>

    {/* RegionCardGrid */}
    <SkeletonSection className="py-10">
      <SkeletonCards count={6} gridClassName="sm:grid-cols-2 lg:grid-cols-3" />
    </SkeletonSection>

    {/* RegionPicks */}
    <SkeletonSection className="border-y border-line bg-surface py-10">
      <SkeletonHeading />
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((pick) => (
          <SkeletonBlock key={pick} className="h-36 rounded-lg bg-line" />
        ))}
      </div>
    </SkeletonSection>

    {/* RegionCompareTable */}
    <SkeletonSection className="pt-10 pb-14">
      <SkeletonHeading />
      <SkeletonBlock className="h-80 w-full rounded-xl bg-line" />
    </SkeletonSection>
  </PageLoading>
);
