import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonHeading,
  SkeletonLines,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const BELIEFS = [1, 2, 3, 4] as const;
const NAV_LINKS = [1, 2, 3, 4, 5, 6] as const;

/**
 * The About page in outline: AboutHero with its numbers, the four beliefs card over the hero's foot, the section menu,
 * the first belief's section and the founder's story.
 */
export const AboutPageSkeleton = () => (
  <PageLoading>
    {/* AboutHero */}
    <div className="bg-navy">
      <div className={`${SKELETON_WRAP} flex flex-col items-start gap-5.5 pt-8 pb-44 md:pt-14`}>
        <SkeletonBlock className="h-4 w-36 bg-white/15" />
        <SkeletonBlock className="h-3.5 w-28 bg-white/15" />
        <SkeletonBlock className="h-11 w-4/5 max-w-205 bg-white/25 md:h-16" />
        <SkeletonBlock className="h-5 w-full max-w-160 bg-white/15" />
        <div className="flex flex-wrap gap-6">
          {[1, 2, 3, 4].map((stat) => (
            <SkeletonBlock key={stat} className="h-14 w-28 bg-white/15" />
          ))}
        </div>
      </div>
    </div>

    {/* BeliefsOverview */}
    <div className={`${SKELETON_WRAP} relative z-10 -mt-28`}>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-raised sm:grid-cols-2 lg:grid-cols-4">
        {BELIEFS.map((belief) => (
          <div key={belief} className="flex flex-col gap-2.5 bg-surface p-6.5">
            <SkeletonBlock className="size-11 rounded-lg bg-line" />
            <SkeletonBlock className="h-6 w-2/3 bg-line-strong" />
            <SkeletonLines count={3} />
          </div>
        ))}
      </div>
    </div>

    {/* PageSectionNav */}
    <div className="mt-12 border-b border-line">
      <div className={`${SKELETON_WRAP} flex gap-7 overflow-hidden py-4`}>
        {NAV_LINKS.map((link) => (
          <SkeletonBlock key={link} className="h-4 w-20 flex-none bg-line" />
        ))}
      </div>
    </div>

    {/* ListenSection, the first of the beliefs' sections */}
    <SkeletonSection className="py-16">
      <SkeletonHeading hasIntro />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-56 rounded-2xl bg-line" />
        <SkeletonBlock className="h-56 rounded-2xl bg-line" />
        <SkeletonBlock className="h-56 rounded-2xl bg-navy/15" />
      </div>
    </SkeletonSection>

    {/* StorySection: the founder's photo card beside the story */}
    <SkeletonSection className="border-t border-line bg-surface py-16 md:py-22">
      <div className="flex flex-wrap items-start gap-x-14 gap-y-10">
        <SkeletonBlock className="h-95 w-full rounded-2xl bg-line-strong sm:w-90" />
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          <SkeletonHeading />
          <SkeletonLines count={6} />
        </div>
      </div>
    </SkeletonSection>
  </PageLoading>
);
