import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonHeading, SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import { BookingCardSkeleton } from "./BookingCardSkeleton";

const GALLERY_TILES = [1, 2, 3, 4] as const;
const PROMISES = [1, 2, 3] as const;
const FACTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
/** The title is one line on a wide screen and two on a phone; the intro one line and about three. */
const TITLE_LINES = [
  { width: "w-full max-w-250", isPhoneOnly: false },
  { width: "w-3/5", isPhoneOnly: true },
] as const;
const INTRO_LINES = [
  { width: "w-full", isPhoneOnly: false },
  { width: "w-11/12", isPhoneOnly: true },
  { width: "w-1/2", isPhoneOnly: true },
] as const;

/**
 * A trek page in outline, part for part at the real sizes (HomePage and TrekPage: the home page is the main trek's
 * page): TrekTop (breadcrumb, HomeTitle with the place beside the buttons, HomeGallery), the navy BookingPromises band,
 * then TrekFacts and the first section beside the booking card (first on phones). The section menu only slides in once
 * the page is scrolled, so it has no place here. `/[slug]` shows it for a blog post too: a post's top is the same shape.
 */
export const TrekPageSkeleton = () => (
  <PageLoading>
    <div className="wrap flex flex-col gap-4 pt-5 pb-8 max-md:pb-6">
      <SkeletonBlock className="h-5 w-56 bg-line" />

      {/* HomeTitle: each bar sits in a box as tall as its text's line, so nothing below moves when the page arrives */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          {TITLE_LINES.map((line) => (
            <SkeletonBlock key={line.width} className={`h-8.5 bg-field/60 md:h-12.5 ${line.width} ${line.isPhoneOnly ? "md:hidden" : ""}`} />
          ))}
        </div>
        <div className="flex flex-col">
          {INTRO_LINES.map((line) => (
            <div key={line.width} className={`flex h-[27px] items-center ${line.isPhoneOnly ? "md:hidden" : ""}`}>
              <SkeletonBlock className={`h-4.5 bg-line ${line.width}`} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex h-6 items-center">
            <SkeletonBlock className="h-4.5 w-56 bg-line" />
          </div>
          <div className="actions max-sm:w-full max-sm:grid-cols-2 sm:ml-auto">
            <SkeletonBlock className="h-12 w-40 rounded-[10px] bg-whatsapp/25 max-sm:col-span-2 max-sm:w-full" />
            <SkeletonBlock className="h-12 w-46 rounded-[10px] border border-field bg-snow max-sm:col-span-2 max-sm:w-full" />
            <SkeletonBlock className="h-11 w-36 rounded-[10px] border border-field bg-snow max-sm:w-full" />
            <SkeletonBlock className="h-11 w-28 rounded-[10px] border border-field bg-snow max-sm:w-full" />
          </div>
        </div>
      </div>

      {/* HomeGallery */}
      <div className="grid h-70 grid-cols-1 gap-2 overflow-hidden rounded-3xl md:h-112 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
        <SkeletonBlock className="rounded-none bg-sky md:row-span-2" />
        {GALLERY_TILES.map((tile) => (
          <SkeletonBlock key={tile} className="hidden rounded-none bg-sky md:block" />
        ))}
      </div>
    </div>

    {/* BookingPromises: the navy band */}
    <div className="bg-navy">
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {PROMISES.map((promise) => (
          <div key={promise} className="flex items-start gap-3.5 py-6 pr-6">
            <SkeletonBlock className="size-11 flex-none rounded-xl bg-white/15" />
            <div className="flex w-full flex-col">
              <div className="flex h-[27px] items-center">
                <SkeletonBlock className="h-4.5 w-44 bg-white/25" />
              </div>
              <div className="flex h-5.5 items-center">
                <SkeletonBlock className="h-3.5 w-full bg-white/15" />
              </div>
              <div className="flex h-5.5 items-center">
                <SkeletonBlock className="h-3.5 w-1/2 bg-white/15" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* TrekPageBody: the facts and the first section, the booking card on the right (first on phones) */}
    <div className="wrap flex flex-wrap items-start gap-12 pt-14 pb-20 max-md:pt-10 max-md:pb-14 lg:flex-nowrap">
      <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-16 max-md:gap-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] overflow-hidden rounded-[18px] border border-line bg-cloud">
          {FACTS.map((fact) => (
            <div key={fact} className="-mr-px -mb-px flex items-center gap-3 border-r border-b border-line px-4.5 py-4">
              <SkeletonBlock className="size-10 flex-none rounded-[10px] bg-snow" />
              <div className="flex w-full flex-col gap-1.5">
                <SkeletonBlock className="h-3 w-3/5 bg-line" />
                <SkeletonBlock className="h-4.5 w-4/5 bg-field/60" />
                <SkeletonBlock className="h-4.5 w-1/2 bg-field/60" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <SkeletonHeading />
          <SkeletonLines count={6} />
        </div>
      </div>
      <div className="max-w-105 min-w-0 flex-[1_1_340px] max-lg:order-first max-lg:max-w-none">
        <BookingCardSkeleton />
      </div>
    </div>
  </PageLoading>
);
