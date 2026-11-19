import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonCards,
  SkeletonHeading,
  SkeletonLines,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const FACT_WIDTHS = ["w-28", "w-44", "w-56", "w-40"] as const;
const NAV_LINKS = [1, 2, 3, 4, 5] as const;
const DAYS = [1, 2, 3, 4] as const;

/**
 * A trek page in outline (TrekDetailPage): TrekTopBar, TrekTitle, the section menu, the photos beside the booking card,
 * the first sections beside it (overview, the day-by-day plan) and a full-width band (similar treks).
 */
export const TrekPageSkeleton = () => (
  <PageLoading>
    {/* TrekTopBar */}
    <div className="border-b border-line bg-surface">
      <div className={`${SKELETON_WRAP} flex items-center justify-between gap-2 py-3`}>
        <SkeletonBlock className="h-4 w-56 bg-line" />
        <SkeletonBlock className="hidden h-5 w-72 rounded-full bg-line sm:block" />
      </div>
    </div>

    {/* TrekTitle */}
    <div className="border-b border-line bg-surface">
      <div className={`${SKELETON_WRAP} flex flex-col gap-3 pt-6.5 pb-6`}>
        <SkeletonBlock className="h-8 w-4/5 bg-line-strong md:h-10.5 md:w-3/5" />
        <div className="hidden gap-4.5 pt-0.5 md:flex">
          {FACT_WIDTHS.map((width) => (
            <SkeletonBlock key={width} className={`h-5 ${width} bg-line`} />
          ))}
        </div>
      </div>
    </div>

    {/* TrekSectionNav */}
    <div className="border-b border-line bg-surface">
      <div className={`${SKELETON_WRAP} flex items-center gap-5.5 overflow-hidden py-2`}>
        {NAV_LINKS.map((link) => (
          <SkeletonBlock key={link} className="h-4 w-20 flex-none bg-line" />
        ))}
        <SkeletonBlock className="ml-auto h-7.5 w-24 flex-none bg-line-strong" />
      </div>
    </div>

    <div className={`${SKELETON_WRAP} grid gap-6 pt-8 pb-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-x-8`}>
      {/* TrekGallery */}
      <div className="flex min-w-0 flex-col gap-2">
        <SkeletonBlock className="aspect-4/3 w-full rounded-lg bg-line-strong md:aspect-16/10" />
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((tile) => (
            <SkeletonBlock key={tile} className="aspect-4/3 bg-line" />
          ))}
        </div>
      </div>

      {/* BookingCard */}
      <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-4.5 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <SkeletonBlock className="h-9 w-1/2 bg-line-strong" />
        <SkeletonBlock className="h-24 w-full bg-line" />
        <SkeletonBlock className="h-13 w-full bg-line-strong" />
        <SkeletonBlock className="h-13 w-full bg-line" />
      </div>

      {/* The sections beside the booking card: the overview, then the day-by-day plan */}
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <SkeletonHeading />
          <SkeletonLines count={5} />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <SkeletonHeading />
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3.5 border-t border-line pt-4">
              <SkeletonBlock className="size-10 flex-none rounded-full bg-line" />
              <div className="flex w-full flex-col gap-1.5">
                <SkeletonBlock className="h-4 w-1/2 bg-line-strong" />
                <SkeletonBlock className="h-3.5 w-1/3 bg-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* A full-width band, e.g. SimilarTreks */}
    <SkeletonSection className="border-t border-line bg-surface py-12">
      <SkeletonHeading />
      <SkeletonCards count={3} gridClassName="md:grid-cols-2 lg:grid-cols-3" mediaClassName="aspect-16/10" />
    </SkeletonSection>
  </PageLoading>
);
