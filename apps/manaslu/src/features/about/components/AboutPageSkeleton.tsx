import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonHeading, SkeletonLines, SkeletonMenuBar, SkeletonTitle } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const STATS = [1, 2, 3, 4] as const;
const BELIEFS = [1, 2, 3, 4] as const;

/**
 * The About page in outline: AboutHero (words and numbers beside the photo), the section links, the four beliefs and
 * the first belief's section.
 */
export const AboutPageSkeleton = () => (
  <PageLoading>
    {/* AboutHero */}
    <div className="border-b border-line bg-stone">
      <div className="wrap grid items-center gap-x-12 gap-y-8 pt-6 pb-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-5 w-36 bg-line" />
          {/* The title runs to two lines beside the photo, the intro to about six */}
          <div className="flex flex-col">
            <SkeletonTitle width="w-11/12" />
            <SkeletonTitle width="w-3/5" />
          </div>
          <SkeletonLines count={6} size="lead" />
          <div className="mt-2 grid gap-4 border-t border-line pt-5 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat} className="flex flex-col gap-1">
                <SkeletonBlock className="h-8 w-16 bg-field/60" />
                <div className="h-10 pt-1">
                  <SkeletonBlock className="h-3.5 w-24 bg-line" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <SkeletonBlock className="aspect-4/3 rounded-2xl bg-forest-tint" />
      </div>
    </div>

    <SkeletonMenuBar count={6} />

    {/* BeliefsOverview */}
    <div className="wrap flex flex-col gap-8 py-14 md:py-18">
      <SkeletonHeading hasIntro />
      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {BELIEFS.map((belief) => (
          <div key={belief} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-snow p-6">
            <SkeletonBlock className="h-7 w-2/3 bg-field/60" />
            <SkeletonLines count={3} />
          </div>
        ))}
      </div>
    </div>

    {/* ListenSection, the first belief */}
    <div className="bg-stone py-14 md:py-18">
      <div className="wrap grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <SkeletonHeading />
          <SkeletonLines count={5} />
        </div>
        <SkeletonBlock className="h-56 rounded-2xl bg-snow" />
      </div>
    </div>
  </PageLoading>
);
