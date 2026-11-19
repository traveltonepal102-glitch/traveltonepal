import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonHeading, SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import { BookingCardSkeleton } from "./BookingCardSkeleton";

const GALLERY_TILES = [1, 2, 3, 4] as const;
const MENU_LINKS = [1, 2, 3, 4, 5, 6, 7] as const;
const FACTS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
/** The intro is one line on a wide screen and about three on a phone. */
const INTRO_LINES = [
  { width: "w-full", isPhoneOnly: false },
  { width: "w-11/12", isPhoneOnly: true },
  { width: "w-3/5", isPhoneOnly: true },
] as const;

/**
 * A trek page in outline, part for part at the real sizes (HomePage and TrekPage: the home page is the main trek's
 * page): HomeTitle (title, place, intro, buttons), HomeGallery, SectionMenu (with the price and "Check dates" from
 * desktop width), then TrekFacts and the first section beside the booking card (first on phones). `/[slug]` shows it
 * for a blog post too: a post's top is the same shape.
 */
export const TrekPageSkeleton = () => (
  <PageLoading>
    <div className="wrap flex flex-col gap-5 pt-7">
      <SkeletonBlock className="h-5 w-48 bg-line" />

      {/* HomeTitle */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex w-full flex-col gap-2.5">
          {/* Each bar sits in a box as tall as its text's line, so nothing below moves when the page arrives. */}
          <div className="flex flex-col gap-1">
            <SkeletonBlock className="h-10 w-full max-w-205 bg-field/60 md:h-14" />
            <SkeletonBlock className="h-10 w-3/5 bg-field/60 md:hidden" />
          </div>
          <div className="flex h-6 items-center">
            <SkeletonBlock className="h-4.5 w-56 bg-line" />
          </div>
          <div className="flex flex-col">
            {INTRO_LINES.map((line) => (
              <div key={line.width} className={`flex h-7.5 items-center ${line.isPhoneOnly ? "md:hidden" : ""}`}>
                <SkeletonBlock className={`h-5 bg-line ${line.width}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="actions max-sm:w-full max-sm:grid-cols-2 sm:ml-auto">
          <SkeletonBlock className="h-12 w-40 rounded-xl bg-whatsapp/25 max-sm:col-span-2 max-sm:w-full" />
          <SkeletonBlock className="h-12 w-44 rounded-xl border-[1.5px] border-forest/40 bg-snow max-sm:col-span-2 max-sm:w-full" />
          <SkeletonBlock className="h-11 w-28 rounded-[10px] border border-line bg-snow max-sm:w-full" />
          <SkeletonBlock className="h-11 w-24 rounded-[10px] border border-line bg-snow max-sm:w-full" />
        </div>
      </div>

      {/* HomeGallery */}
      <div className="grid h-70 grid-cols-1 gap-2 overflow-hidden rounded-2xl md:h-112 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
        <SkeletonBlock className="rounded-none bg-forest-tint md:row-span-2" />
        {GALLERY_TILES.map((tile) => (
          <SkeletonBlock key={tile} className="hidden rounded-none bg-forest-tint md:block" />
        ))}
      </div>
    </div>

    {/* SectionMenu */}
    <div className="mt-7 border-y border-line bg-snow">
      <div className="wrap flex items-center justify-between gap-6">
        <div className="flex gap-7 overflow-hidden py-4.5">
          {MENU_LINKS.map((link) => (
            <SkeletonBlock key={link} className="h-4.5 w-20 flex-none bg-line" />
          ))}
        </div>
        <div className="hidden flex-none items-center gap-3.5 py-2 lg:flex">
          <div className="flex flex-col items-end gap-1.5">
            <SkeletonBlock className="h-3.5 w-32 bg-line" />
            <SkeletonBlock className="h-5 w-14 bg-field/60" />
          </div>
          <SkeletonBlock className="h-11 w-30 rounded-[10px] bg-forest/30" />
        </div>
      </div>
    </div>

    {/* TrekPageBody: the facts and the first section, the booking card on the right (first on phones) */}
    <div className="wrap flex flex-wrap items-start gap-12 pt-10 pb-22 max-md:pb-14 lg:flex-nowrap">
      <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-16 max-md:gap-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] overflow-hidden rounded-[14px] border border-line">
          {FACTS.map((fact) => (
            <div key={fact} className="-mr-px -mb-px flex items-center gap-3.5 border-r border-b border-line px-5 py-4.5">
              <SkeletonBlock className="size-11 flex-none rounded-[10px] bg-forest-tint" />
              <div className="flex w-full flex-col gap-2">
                <SkeletonBlock className="h-3 w-2/5 bg-line" />
                <SkeletonBlock className="h-4.5 w-4/5 bg-field/60" />
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
