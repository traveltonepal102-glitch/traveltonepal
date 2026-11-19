import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const TABS = ["impressum", "datenschutz", "agb", "cookies"] as const;
const TOC_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SECTIONS = [1, 2, 3] as const;
const CARDS = [1, 2, 3, 4] as const;

/**
 * What differs between the legal pages (LegalPage): the long ones (AGB, Datenschutz) have numbered sections and the
 * contents list on the right, the short ones cards; Cookie-Einstellungen opens with the dark panel of choices.
 */
const PAGES = {
  agb: { isLong: true, titleLines: 2, chips: ["w-60", "w-72"], hasPanel: false },
  datenschutz: { isLong: true, titleLines: 1, chips: ["w-60", "w-72"], hasPanel: false },
  impressum: { isLong: false, titleLines: 1, chips: ["w-60"], hasPanel: false },
  cookies: { isLong: false, titleLines: 1, chips: ["w-60"], hasPanel: true },
} as const;

type LegalPageSkeletonProps = { page: (typeof TABS)[number] };

/**
 * A legal page in outline: LegalHeader (the ice top: breadcrumb, eyebrow, title, intro, the info chips and the file
 * tabs at its foot), then the page's text beside LegalSidebar (the contents list on a long page, the help box).
 */
export const LegalPageSkeleton = ({ page }: LegalPageSkeletonProps) => {
  const { isLong, titleLines, chips, hasPanel } = PAGES[page];
  return (
    <PageLoading>
      {/* LegalHeader */}
      <div className="border-b border-ice-strong bg-ice">
        <div className="wrap flex flex-col pt-7">
          <SkeletonBlock className="h-5 w-72 bg-line" />
          <div className="mt-9 flex h-4.5 items-center">
            <SkeletonBlock className="h-3 w-28 bg-line" />
          </div>
          <div className="mt-2.5 flex max-w-195 flex-col">
            {Array.from({ length: titleLines }, (_, index) => (
              <SkeletonBlock
                key={index}
                className={`h-10.5 bg-field/30 md:h-13 lg:h-15 ${index === titleLines - 1 && titleLines > 1 ? "w-4/5" : "w-3/5"}`}
              />
            ))}
          </div>
          <div className="mt-4 max-w-170">
            <SkeletonLines count={2} size="lead" />
          </div>
          <div className="mt-5.5 flex flex-wrap gap-2.5">
            {chips.map((width) => (
              <SkeletonBlock key={width} className={`h-8.5 rounded-full border border-ice-strong bg-snow ${width}`} />
            ))}
          </div>
          <div className="mt-10 flex gap-1 overflow-hidden">
            {/* The current page is a white tab; the others are words only */}
            {TABS.map((tab) => (
              <div
                key={tab}
                className={`flex h-13 w-40 flex-none items-center justify-center rounded-t-2xl ${tab === page ? "border border-b-0 border-ice-strong bg-snow" : ""}`}
              >
                <SkeletonBlock className="h-4 w-24 bg-line" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`wrap grid items-start gap-12 pt-8 pb-24 lg:grid-cols-[minmax(0,1fr)_300px] ${isLong ? "lg:gap-18" : ""}`}>
        <div className={`flex min-w-0 flex-col gap-7 ${isLong ? "max-w-190" : ""}`}>
          {hasPanel && <SkeletonBlock className="h-96 w-full rounded-[22px] bg-ink" />}
          {isLong ? (
            <div>
              {SECTIONS.map((section) => (
                <div key={section} className="grid grid-cols-[56px_minmax(0,1fr)] gap-2 border-t border-line py-8 max-sm:grid-cols-1 max-sm:gap-1">
                  <SkeletonBlock className="h-8.5 w-10 bg-ice-strong" />
                  <div className="flex min-w-0 flex-col gap-3.5">
                    <SkeletonBlock className="h-8 w-1/2 bg-field/30" />
                    <SkeletonLines count={3} size="lead" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4.5 sm:grid-cols-2">
              {CARDS.map((card) => (
                <div key={card} className="flex flex-col gap-3 rounded-[22px] border border-ice-strong bg-snow px-7 py-6.5">
                  <SkeletonBlock className="h-7 w-1/2 bg-field/30" />
                  <SkeletonLines count={2} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LegalSidebar */}
        <div className="flex flex-col gap-5">
          {isLong && (
            <div className="flex flex-col max-lg:hidden">
              <SkeletonBlock className="mb-3 h-4 w-32 bg-line" />
              <div className="flex flex-col border-l-2 border-line">
                {TOC_ROWS.map((row) => (
                  <div key={row} className="flex h-8.5 items-center pl-3.5">
                    <SkeletonBlock className="h-4 w-4/5 bg-line" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-5.5">
            <SkeletonBlock className="h-6 w-3/4 bg-white/25" />
            <SkeletonLines count={2} tone="dark" />
            <div className="flex gap-2 pt-1">
              <SkeletonBlock className="h-10 w-30 rounded-full bg-whatsapp/40" />
              <SkeletonBlock className="h-10 w-26 rounded-full border border-white/35 bg-transparent" />
            </div>
          </div>
          <SkeletonBlock className="h-6 w-52 bg-line" />
        </div>
      </div>
    </PageLoading>
  );
};
