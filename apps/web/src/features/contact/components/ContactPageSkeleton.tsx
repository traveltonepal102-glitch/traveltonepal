import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonHeading,
  SkeletonLines,
  SkeletonNavyTop,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/** The Contact page in outline: ContactHero, the three ways to reach us over its foot, the plan form and the office. */
export const ContactPageSkeleton = () => (
  <PageLoading>
    <SkeletonNavyTop className="pt-5.5 pb-24" />

    {/* ContactWays: WhatsApp first and wider */}
    <div className="relative -mt-16 pb-10">
      <div className={`${SKELETON_WRAP} grid gap-4.5 lg:grid-cols-[1.25fr_1fr_1fr]`}>
        {[1, 2, 3].map((way) => (
          <div key={way} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-4.5 shadow-popover md:p-6">
            <SkeletonBlock className="size-12 rounded-xl bg-line" />
            <SkeletonBlock className="h-6 w-1/2 bg-line-strong" />
            <SkeletonLines count={2} />
            <SkeletonBlock className="h-12 w-full rounded-lg bg-line" />
          </div>
        ))}
      </div>
    </div>

    {/* PlanSection */}
    <SkeletonSection className="pt-6 pb-12">
      <SkeletonHeading hasIntro />
      <SkeletonBlock className="h-72 w-full rounded-2xl bg-line" />
    </SkeletonSection>

    {/* OfficeSection: the map beside the address and hours */}
    <div className="py-12">
      <div className={`${SKELETON_WRAP} grid gap-6 lg:grid-cols-2`}>
        <SkeletonBlock className="min-h-95 rounded-2xl bg-line-strong" />
        <div className="flex flex-col gap-4">
          <SkeletonHeading />
          <SkeletonLines count={5} />
        </div>
      </div>
    </div>
  </PageLoading>
);
