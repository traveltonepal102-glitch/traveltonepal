import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonCards,
  SkeletonHeading,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/** The Travel guides page in outline: GuidesHero with its search, the topics, "Start here" and all guides. */
export const GuidesPageSkeleton = () => (
  <PageLoading>
    {/* GuidesHero: a white top, the search beside the title from desktop width */}
    <div className="border-b border-line bg-surface">
      <div className={`${SKELETON_WRAP} flex flex-col gap-4 pt-5.5 pb-9 md:pb-10`}>
        <SkeletonBlock className="h-4 w-40 bg-line" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          <div className="flex w-full max-w-205 flex-col gap-3">
            <SkeletonBlock className="h-3.5 w-28 bg-line" />
            <SkeletonBlock className="h-10 w-4/5 bg-line-strong md:h-14" />
            <SkeletonBlock className="h-5 w-full bg-line" />
            <SkeletonBlock className="h-5 w-2/3 bg-line" />
          </div>
          <SkeletonBlock className="h-13 w-full flex-none rounded-lg bg-line lg:w-100" />
        </div>
      </div>
    </div>

    {/* GuideTopicsSection */}
    <SkeletonSection className="pt-10 pb-10 md:pb-12">
      <SkeletonHeading />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((topic) => (
          <SkeletonBlock key={topic} className="h-28 rounded-xl bg-line" />
        ))}
      </div>
    </SkeletonSection>

    {/* StartHereSection: the navy box */}
    <div className={`${SKELETON_WRAP} pb-14 md:pb-18`}>
      <div className="flex flex-col gap-5 rounded-xl bg-navy p-5.5 md:p-8">
        <SkeletonHeading tone="dark" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((guide) => (
            <SkeletonBlock key={guide} className="h-32 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>

    {/* AllGuidesSection */}
    <SkeletonSection className="border-t border-line pt-12 pb-10 md:pt-16">
      <SkeletonHeading />
      <SkeletonCards count={6} gridClassName="sm:grid-cols-2 lg:grid-cols-3" />
    </SkeletonSection>
  </PageLoading>
);
