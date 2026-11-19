import { PageLoading } from "@/components/shared/PageLoading";
import {
  SkeletonCards,
  SkeletonChips,
  SkeletonHeading,
  SkeletonNavyTop,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const FILTER_GROUPS = [1, 2, 3, 4] as const;

/** The Treks page in outline: TreksHero with its facts and search, the filters beside the trek cards, How to choose. */
export const TreksPageSkeleton = () => (
  <PageLoading>
    <SkeletonNavyTop className="pt-5.5 pb-11">
      <SkeletonChips count={3} />
      <SkeletonBlock className="mt-1 h-14 w-full max-w-160 rounded-lg bg-white/20" />
    </SkeletonNavyTop>

    {/* TrekExplorer: the filters on the left from desktop width, two cards across */}
    <div className="pt-7 pb-12">
      <div className="mx-auto max-w-content gap-7 px-4 md:px-6 lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:items-start">
        <div className="hidden flex-col gap-5 rounded-xl border border-line bg-surface p-5 lg:flex">
          {FILTER_GROUPS.map((group) => (
            <div key={group} className="flex flex-col gap-2.5">
              <SkeletonBlock className="h-4 w-24 bg-line-strong" />
              <SkeletonBlock className="h-4 w-4/5 bg-line" />
              <SkeletonBlock className="h-4 w-3/5 bg-line" />
              <SkeletonBlock className="h-4 w-2/3 bg-line" />
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <SkeletonBlock className="h-5 w-40 bg-line" />
            <SkeletonBlock className="h-10 w-44 rounded-lg bg-line" />
          </div>
          <SkeletonCards count={4} gridClassName="md:grid-cols-2" mediaClassName="aspect-16/10" />
        </div>
      </div>
    </div>

    {/* HowToChooseSection */}
    <SkeletonSection className="border-t border-line bg-surface py-12">
      <SkeletonHeading hasIntro />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <SkeletonBlock key={card} className="h-40 rounded-xl bg-line" />
        ))}
      </div>
    </SkeletonSection>
  </PageLoading>
);
