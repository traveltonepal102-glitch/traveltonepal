import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonHeading, SkeletonLines, SkeletonTitle } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

import { BookingCardSkeleton } from "./BookingCardSkeleton";

const FACTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const MENU_LINKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * The home page shows the main trek without a breadcrumb, with its own label beside "Private trek" and a short title;
 * another trek's page has the breadcrumb and a longer title ("… – 13 Days, USD 550": three lines).
 */
const VARIANTS = {
  home: { hasBreadcrumb: false, pills: ["w-48", "w-44"], titleLines: [{ width: "w-3/5", isPhoneOnly: false }] },
  trek: {
    hasBreadcrumb: true,
    pills: ["w-44"],
    titleLines: [
      { width: "w-full", isPhoneOnly: false },
      { width: "w-11/12", isPhoneOnly: false },
      { width: "w-2/5", isPhoneOnly: false },
    ],
  },
} as const;

type TrekPageSkeletonProps = { variant: keyof typeof VARIANTS };

/**
 * A trek page in outline, part for part at the real sizes (TrekTop inside TrekPageBody): the cream band with HomeTitle
 * and HomeGallery's mosaic beside the booking card, TrekFacts under them, then the section menu (with the price and
 * "Book on WhatsApp" from desktop width) and the first section's band. `/[slug]` shows the trek variant for a blog post
 * too: a post's top is the same shape.
 */
export const TrekPageSkeleton = ({ variant }: TrekPageSkeletonProps) => {
  const { hasBreadcrumb, pills, titleLines } = VARIANTS[variant];
  return (
    <PageLoading>
      <div className="bg-cream">
        <div className="wrap flex flex-col gap-8 pt-11 pb-12 max-md:pt-7">
          {hasBreadcrumb && <SkeletonBlock className="h-5 w-72 bg-line" />}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
            <div className="flex min-w-0 flex-col gap-8">
              {/* HomeTitle: each bar sits in a box as tall as its text's line, so nothing below moves when the page arrives */}
              <div className="flex max-w-220 flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {pills.map((width) => (
                    <SkeletonBlock key={width} className={`h-7 rounded-full border border-saffron-line bg-saffron-tint ${width}`} />
                  ))}
                </div>
                <div className="flex flex-col">
                  {titleLines.map((line) => (
                    <div key={line.width} className={line.isPhoneOnly ? "md:hidden" : ""}>
                      <SkeletonTitle width={line.width} />
                    </div>
                  ))}
                </div>
                <div className="flex h-5.5 items-center">
                  <SkeletonBlock className="h-4 w-56 bg-line" />
                </div>
                <div className="max-w-170">
                  <SkeletonLines count={2} size="lead" />
                </div>
                <div className="flex items-center gap-3 pt-1.5">
                  <SkeletonBlock className="h-11 w-42 rounded-[10px] bg-maroon/25" />
                  <SkeletonBlock className="h-11 w-24 rounded-[10px] bg-line" />
                </div>
              </div>

              {/* HomeGallery: the mosaic, stretched as tall as the booking card when that is taller */}
              <div className="grid min-h-95 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 gap-3 max-sm:min-h-0 max-sm:grid-cols-2 max-sm:grid-rows-[240px_150px]">
                <SkeletonBlock className="row-span-2 rounded-[22px] bg-line max-sm:col-span-2 max-sm:row-span-1" />
                <SkeletonBlock className="rounded-[22px] bg-line" />
                <SkeletonBlock className="rounded-[22px] bg-line" />
              </div>
            </div>
            <div className="self-start">
              <BookingCardSkeleton />
            </div>
          </div>

          {/* TrekFacts */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] overflow-hidden rounded-[22px] border border-line bg-snow p-2">
            {FACTS.map((fact) => (
              <div key={fact} className="flex items-center gap-3.5 rounded-2xl p-4">
                <SkeletonBlock className="size-11 flex-none rounded-full bg-cream" />
                <div className="flex w-full flex-col gap-1.5">
                  <SkeletonBlock className="h-3.5 w-3/5 bg-line" />
                  <SkeletonBlock className="h-4.5 w-4/5 bg-field/60" />
                  <SkeletonBlock className="h-4.5 w-3/4 bg-field/60" />
                  <SkeletonBlock className="h-4.5 w-1/2 bg-field/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SectionMenu */}
      <div className="border-b border-line bg-paper">
        <div className="wrap flex items-center justify-between gap-5">
          <div className="flex gap-8 overflow-hidden py-6">
            {MENU_LINKS.map((link) => (
              <SkeletonBlock key={link} className="h-5 w-20 flex-none bg-line" />
            ))}
          </div>
          <div className="hidden flex-none items-center gap-3.5 border-l border-line py-3 pl-5 lg:flex">
            <div className="flex flex-col items-end gap-1.5">
              <SkeletonBlock className="h-3.5 w-32 bg-line" />
              <SkeletonBlock className="h-5 w-14 bg-field/60" />
            </div>
            <SkeletonBlock className="h-11 w-48 rounded-full bg-whatsapp/25" />
          </div>
        </div>
      </div>

      {/* The first section's band */}
      <div className="bg-paper py-16">
        <div className="wrap flex max-w-200 flex-col gap-5">
          <SkeletonHeading />
          <SkeletonLines count={5} />
        </div>
      </div>
    </PageLoading>
  );
};
