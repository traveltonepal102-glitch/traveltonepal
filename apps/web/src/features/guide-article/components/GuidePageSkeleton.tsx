import { PageLoading } from "@/components/shared/PageLoading";
import { SKELETON_WRAP, SkeletonChips, SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const FACTS = [1, 2, 3, 4] as const;
const TOC_ROWS = [1, 2, 3, 4, 5, 6] as const;

/**
 * A travel guide in outline: ArticleHero (breadcrumb at its top, the words at its foot), the facts strip, then the
 * contents list, the article and the sidebar, in GuideArticlePage's columns.
 */
export const GuidePageSkeleton = () => (
  <PageLoading>
    {/* ArticleHero */}
    <div className="bg-navy">
      <div className={`${SKELETON_WRAP} flex min-h-125 flex-col justify-between gap-10 pt-5 pb-9 md:min-h-150`}>
        <SkeletonBlock className="h-4 w-48 bg-white/15" />
        <div className="flex flex-col gap-4.5">
          <SkeletonChips count={3} />
          <SkeletonBlock className="h-10 w-11/12 max-w-205 bg-white/25 md:h-14" />
          <SkeletonBlock className="h-10 w-2/3 max-w-150 bg-white/25 md:h-14" />
          <div className="flex items-center gap-3 pt-1">
            <SkeletonBlock className="size-11 rounded-full bg-white/20" />
            <div className="flex flex-col gap-1.5">
              <SkeletonBlock className="h-4 w-36 bg-white/20" />
              <SkeletonBlock className="h-3 w-48 bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ArticleFacts */}
    <div className="border-b border-line bg-page">
      <div className={`${SKELETON_WRAP} grid gap-5 py-5.5 sm:grid-cols-2 xl:grid-cols-4`}>
        {FACTS.map((fact) => (
          <div key={fact} className="flex items-center gap-3.5">
            <SkeletonBlock className="size-13.5 flex-none rounded-xl bg-line" />
            <div className="flex w-full flex-col gap-1.5">
              <SkeletonBlock className="h-3 w-2/5 bg-line" />
              <SkeletonBlock className="h-4 w-3/5 bg-line-strong" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Contents, article and sidebar */}
    <div className="bg-surface">
      <div
        className={`${SKELETON_WRAP} grid items-start gap-10 pt-9 pb-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_300px]`}
      >
        <div className="hidden flex-col gap-3 xl:flex">
          {TOC_ROWS.map((row) => (
            <SkeletonBlock key={row} className="h-4 w-4/5 bg-line" />
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <SkeletonLines count={5} />
          <SkeletonBlock className="mt-3 h-8 w-1/2 bg-line-strong" />
          <SkeletonLines count={4} />
          <SkeletonBlock className="aspect-video w-full rounded-xl bg-line-strong" />
          <SkeletonLines count={4} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-line">
            <SkeletonBlock className="aspect-16/10 rounded-none bg-line-strong" />
            <div className="flex flex-col gap-2.5 p-4">
              <SkeletonBlock className="h-5 w-3/4 bg-line" />
              <SkeletonBlock className="h-11 w-full rounded-lg bg-line" />
            </div>
          </div>
          <SkeletonBlock className="h-48 rounded-2xl bg-navy/15" />
        </div>
      </div>
    </div>
  </PageLoading>
);
