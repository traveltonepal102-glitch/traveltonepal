import { PageLoading } from "@/components/shared/PageLoading";
import { SKELETON_WRAP, SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const MENU_ROWS = [1, 2, 3, 4, 5, 6, 7] as const;
const SECTIONS = [1, 2, 3] as const;

/**
 * A legal page in outline (Terms, Privacy, Impressum, Cookie settings: LegalPage): the white top, the sections menu on
 * the left from desktop width, the note and the numbered sections.
 */
export const LegalPageSkeleton = () => (
  <PageLoading>
    {/* LegalHeader */}
    <div className="border-b border-line bg-surface">
      <div className={`${SKELETON_WRAP} flex flex-col gap-3 pt-5 pb-7`}>
        <SkeletonBlock className="h-4 w-36 bg-line" />
        <div className="flex max-w-190 flex-col gap-2">
          <SkeletonBlock className="h-3.5 w-28 bg-line" />
          <SkeletonBlock className="h-10 w-3/5 bg-line-strong md:h-12" />
          <SkeletonBlock className="h-4 w-48 bg-line" />
        </div>
      </div>
    </div>

    <div className={`${SKELETON_WRAP} grid items-start gap-8 pt-8 pb-14 lg:grid-cols-[260px_minmax(0,1fr)]`}>
      {/* LegalSidebar */}
      <div className="hidden flex-col gap-1 rounded-xl border border-line bg-surface p-2.5 lg:flex">
        {MENU_ROWS.map((row) => (
          <SkeletonBlock key={row} className="h-8 w-full bg-line" />
        ))}
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <SkeletonBlock className="h-16 w-full rounded-xl bg-saffron-tint" />
        {SECTIONS.map((section) => (
          <div key={section} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="size-8 rounded-full bg-line-strong" />
              <SkeletonBlock className="h-7 w-1/2 bg-line-strong" />
            </div>
            <SkeletonLines count={5} />
          </div>
        ))}
      </div>
    </div>
  </PageLoading>
);
