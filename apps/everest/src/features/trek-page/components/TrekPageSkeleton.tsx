import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonHeading, SkeletonLines } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import { BookingCardSkeleton } from "./BookingCardSkeleton";

const FACTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const MENU_LINKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
/** An H1 line on the dark hero: as tall as the real heading's line (40–76px type on 1.02). */
const TITLE_LINE = "h-10.5 bg-white/25 md:h-15 lg:h-19.5";

/**
 * The home page shows the main trek without a breadcrumb, with its own label beside "Privat · Start an jedem Tag", a
 * short title and a longer intro; another trek's page has the breadcrumb and a long title ("Gokyo Seen Trek in 12 Tagen
 * (Reiseverlauf, Kosten, kompletter Ratgeber)": four lines).
 */
const VARIANTS = {
  home: { hasBreadcrumb: false, pills: ["w-60", "w-48"], titleWidths: ["w-11/12", "w-1/3"], introLines: 3 },
  trek: { hasBreadcrumb: true, pills: ["w-48"], titleWidths: ["w-full", "w-11/12", "w-4/5", "w-1/2"], introLines: 2 },
} as const;

type TrekPageSkeletonProps = { variant: keyof typeof VARIANTS };

/**
 * A trek page in outline, part for part at the real sizes (TrekTop inside TrekPageBody): the dark hero with HomeTitle and
 * the altitude ribbon beside the booking card, the ice band with TrekFacts and HomeGallery's mosaic, then the section
 * menu (with the price and the WhatsApp button from desktop width) and the first section. `/[slug]` shows the trek
 * variant for a blog post too: a post's top is the same shape.
 */
export const TrekPageSkeleton = ({ variant }: TrekPageSkeletonProps) => {
  const { hasBreadcrumb, pills, titleWidths, introLines } = VARIANTS[variant];
  return (
    <PageLoading>
      {/* TrekTop: the dark hero */}
      <div className="bg-ink">
        <div className="wrap flex flex-col gap-7 pt-8 pb-12 lg:pt-12 lg:pb-16">
          {hasBreadcrumb && <SkeletonBlock className="h-5 w-56 bg-white/15" />}
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="flex min-w-0 flex-col gap-8 lg:pt-6">
              {/* HomeTitle: each bar sits in a box as tall as its text's line, so nothing below moves when the page arrives */}
              <div className="flex max-w-190 flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  {pills.map((width) => (
                    <SkeletonBlock key={width} className={`h-9 rounded-full border border-white/25 bg-white/10 ${width}`} />
                  ))}
                </div>
                <div className="flex flex-col">
                  {titleWidths.map((width) => (
                    <SkeletonBlock key={width} className={`${TITLE_LINE} ${width}`} />
                  ))}
                </div>
                <div className="flex h-5.5 items-center">
                  <SkeletonBlock className="h-4 w-52 bg-white/15" />
                </div>
                <div className="flex max-w-160 flex-col">
                  {Array.from({ length: introLines }, (_, index) => (
                    <div key={index} className="flex h-7.5 items-center sm:h-8">
                      <SkeletonBlock className={`h-5 bg-white/15 ${index === introLines - 1 ? "w-3/5" : "w-full"}`} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <SkeletonBlock className="h-11 w-48 rounded-full bg-white/70" />
                  <SkeletonBlock className="h-11 w-26 rounded-full border-[1.5px] border-white/35 bg-transparent" />
                </div>
              </div>

              {/* HeroAltitudeRibbon: the profile, then the first day, the high point and the last day */}
              <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-24 w-full rounded-xl bg-white/6 sm:h-28" />
                <div className="flex flex-wrap justify-between gap-2">
                  <SkeletonBlock className="h-4.5 w-28 bg-white/15" />
                  <SkeletonBlock className="h-4.5 w-80 bg-white/20" />
                  <SkeletonBlock className="h-4.5 w-28 bg-white/15" />
                </div>
              </div>
            </div>
            <BookingCardSkeleton />
          </div>
        </div>
      </div>

      {/* The ice band: TrekFacts and HomeGallery */}
      <div className="bg-ice">
        <div className="wrap flex flex-col gap-8 py-10">
          <div className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-line bg-snow p-1.5 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] sm:p-2">
            {FACTS.map((fact) => (
              <div key={fact} className="flex items-center gap-3 rounded-2xl px-2.5 py-3 sm:gap-3.5 sm:p-4">
                <SkeletonBlock className="size-9 flex-none rounded-full bg-ice sm:size-11" />
                <div className="flex w-full flex-col gap-1.5">
                  <SkeletonBlock className="h-3.5 w-3/5 bg-line" />
                  <SkeletonBlock className="h-4.5 w-4/5 bg-field/30" />
                  <SkeletonBlock className="h-4.5 w-1/2 bg-field/30" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid min-h-110 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 gap-3 max-sm:min-h-0 max-sm:grid-cols-2 max-sm:grid-rows-[240px_150px]">
            <SkeletonBlock className="row-span-2 rounded-[22px] bg-ice-strong max-sm:col-span-2 max-sm:row-span-1" />
            <SkeletonBlock className="rounded-[22px] bg-ice-strong" />
            <SkeletonBlock className="rounded-[22px] bg-ice-strong" />
          </div>
        </div>
      </div>

      {/* SectionMenu */}
      <div className="border-b border-line bg-mist">
        <div className="wrap flex items-center justify-between gap-5">
          <div className="flex gap-8 overflow-hidden py-6">
            {MENU_LINKS.map((link) => (
              <SkeletonBlock key={link} className="h-5 w-20 flex-none bg-line" />
            ))}
          </div>
          <div className="hidden flex-none items-center gap-3.5 border-l border-line py-3 pl-5 lg:flex">
            <div className="flex flex-col items-end gap-1.5">
              <SkeletonBlock className="h-3.5 w-32 bg-line" />
              <SkeletonBlock className="h-5 w-14 bg-field/30" />
            </div>
            <SkeletonBlock className="h-11 w-48 rounded-full bg-whatsapp/25" />
          </div>
        </div>
      </div>

      {/* The first section */}
      <div className="py-16">
        <div className="wrap flex flex-col gap-5">
          <SkeletonHeading />
          <SkeletonLines count={5} />
        </div>
      </div>
    </PageLoading>
  );
};
