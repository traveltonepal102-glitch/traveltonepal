import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonCards, SkeletonPageTop } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const TOPIC_WIDTHS = ["w-16", "w-28", "w-24", "w-32", "w-20"] as const;

/**
 * The blog list in outline (BlogsPage, also its `/blog/seite/2`… pages): the stone top, the topics beside the search,
 * then the cards three across.
 */
export const BlogsPageSkeleton = () => (
  <PageLoading>
    <SkeletonPageTop introLines={3} />

    {/* BlogExplorer */}
    <div className="wrap flex flex-col gap-7 py-10 md:py-14">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap gap-2">
          {TOPIC_WIDTHS.map((width) => (
            <SkeletonBlock key={width} className={`h-10 ${width} rounded-full bg-line`} />
          ))}
        </div>
        <SkeletonBlock className="h-12 w-full rounded-[10px] bg-line" />
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between gap-4">
          <SkeletonBlock className="h-7.5 w-40 bg-field/60" />
          <SkeletonBlock className="h-4.5 w-36 bg-line" />
        </div>
        <SkeletonCards count={6} gridClassName="md:grid-cols-2 lg:grid-cols-3" />
      </div>
    </div>
  </PageLoading>
);
