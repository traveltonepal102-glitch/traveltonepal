import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonLines, SkeletonTitle } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const PAGE_LINKS = [1, 2, 3, 4] as const;
const ON_THIS_PAGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SECTIONS = [1, 2, 3] as const;

/**
 * A legal page in outline (Terms, Privacy, Impressum, Cookie settings: LegalPage): LegalHeader (eyebrow, title, intro
 * beside "Last updated"), LegalSidebar (the four legal pages, then "On this page") and the numbered sections in the
 * text column.
 */
export const LegalPageSkeleton = () => (
  <PageLoading>
    {/* LegalHeader */}
    <div className="border-b border-line bg-stone">
      <div className="wrap flex flex-col gap-3 pt-5 pb-7">
        <SkeletonBlock className="h-5 w-56 bg-line" />
        <SkeletonBlock className="h-3.5 w-36 bg-saffron-tint" />
        <SkeletonTitle width="w-3/5 max-w-170" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SkeletonBlock className="h-5 w-full max-w-150 bg-line" />
          <SkeletonBlock className="h-4 w-44 bg-line" />
        </div>
        {/* The legal pages as chips, on phones and tablets */}
        <div className="flex gap-1.5 overflow-hidden pt-1.5 lg:hidden">
          {PAGE_LINKS.map((link) => (
            <SkeletonBlock key={link} className="h-10 w-28 flex-none rounded-full bg-line" />
          ))}
        </div>
      </div>
    </div>

    <div className="wrap grid items-start gap-8 pt-8 pb-16 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* LegalSidebar */}
      <div className="hidden flex-col gap-3.5 lg:flex">
        <div className="flex flex-col gap-1 rounded-[14px] border border-line bg-snow p-2.5">
          {PAGE_LINKS.map((link) => (
            <SkeletonBlock key={link} className={`h-11 w-full rounded-[10px] ${link === 1 ? "bg-forest-tint" : "bg-line/60"}`} />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-snow p-4">
          <SkeletonBlock className="h-3.5 w-24 bg-line" />
          {ON_THIS_PAGE.map((row) => (
            <SkeletonBlock key={row} className="h-3.5 w-4/5 bg-line" />
          ))}
        </div>
      </div>

      {/* The numbered sections, in the text column */}
      <div className="flex max-w-170 min-w-0 flex-col gap-7">
        {SECTIONS.map((section) => (
          <div key={section} className="flex flex-col gap-2.5">
            <div className="flex h-7 items-center gap-2.5">
              <SkeletonBlock className="h-4 w-4 bg-forest-tint" />
              <SkeletonBlock className="h-6 w-2/5 bg-field/60" />
            </div>
            <SkeletonLines count={section === 1 ? 2 : 4} />
          </div>
        ))}
      </div>
    </div>
  </PageLoading>
);
