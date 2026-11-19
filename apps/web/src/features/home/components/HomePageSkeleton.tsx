import { PageLoading } from "@/components/shared/PageLoading";
import {
  SKELETON_WRAP,
  SkeletonCards,
  SkeletonHeading,
  SkeletonLines,
  SkeletonSection,
} from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { SiteHeader } from "@/features/site-header/components/SiteHeader";

const REGION_TILES = 8;
const FINDER_FIELDS = 3;

/**
 * The home page in outline, section by section (app/(home)/page.tsx): the overlay header on the hero, the trek finder,
 * regions, treks, custom adventures, why us, reviews and travel guides, at the real sections' sizes and grounds.
 */
export const HomePageSkeleton = () => (
  <>
    <div className="absolute inset-x-0 top-0 z-40">
      <SiteHeader variant="overlay" />
    </div>
    <PageLoading className="bg-surface">
      {/* HomeHero */}
      <div className="bg-navy">
        <div className="mx-auto flex max-w-content flex-col gap-5.5 px-4 pt-29 pb-42.5 md:px-6 md:pt-46 md:pb-52.5">
          <SkeletonBlock className="h-7.5 w-56 rounded-full bg-white/15" />
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-11 w-11/12 max-w-205 bg-white/25 md:h-16" />
            <SkeletonBlock className="h-11 w-2/3 max-w-150 bg-white/25 md:h-16" />
          </div>
          <SkeletonBlock className="h-6 w-full max-w-150 bg-white/15" />
          <div className="flex flex-wrap gap-3 pt-1">
            <SkeletonBlock className="h-13 w-44 rounded-lg bg-white/25" />
            <SkeletonBlock className="h-13 w-40 rounded-lg bg-white/15" />
          </div>
        </div>
      </div>

      {/* TrekFinder: the search card over the hero's foot */}
      <div className="relative z-10 mx-auto -mt-20 max-w-content px-4 md:px-5">
        <div className="flex flex-wrap gap-2.5 rounded-xl bg-surface p-3 shadow-popover">
          {Array.from({ length: FINDER_FIELDS }, (_, index) => (
            <SkeletonBlock key={index} className="min-h-15.5 grow basis-56 rounded-lg bg-line" />
          ))}
          <SkeletonBlock className="min-h-15.5 grow basis-40 rounded-lg bg-line-strong" />
        </div>
      </div>

      {/* RegionsSection */}
      <SkeletonSection className="py-16 md:py-24">
        <SkeletonHeading hasIntro />
        <div className="grid grid-cols-2 gap-3 md:auto-rows-52.5 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-3.5">
          {Array.from({ length: REGION_TILES }, (_, index) => (
            <SkeletonBlock key={index} className={`h-52.5 rounded-xl bg-line-strong ${index > 1 ? "max-md:hidden" : ""}`} />
          ))}
        </div>
      </SkeletonSection>

      {/* TreksSection */}
      <SkeletonSection className="bg-muted py-16 md:py-24">
        <SkeletonHeading />
        <SkeletonCards count={3} gridClassName="md:grid-cols-2 lg:grid-cols-3" mediaClassName="aspect-16/10" />
      </SkeletonSection>

      {/* CustomAdventuresSection */}
      <SkeletonSection className="border-t border-line bg-surface py-16 md:py-24">
        <SkeletonHeading hasIntro />
        <div className="grid gap-4.5 md:grid-cols-3">
          <SkeletonBlock className="h-90 rounded-xl bg-line-strong" />
          <SkeletonBlock className="h-90 rounded-xl bg-line-strong max-md:hidden" />
          <SkeletonBlock className="h-90 rounded-xl bg-line-strong max-md:hidden" />
        </div>
      </SkeletonSection>

      {/* WhyUsSection */}
      <div className="bg-navy py-16 md:py-24">
        <div className={`${SKELETON_WRAP} grid gap-12 lg:grid-cols-2`}>
          <div className="flex flex-col gap-5">
            <SkeletonHeading tone="dark" hasIntro />
            <SkeletonLines count={3} tone="dark" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((tile) => (
              <SkeletonBlock key={tile} className="h-36 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* HowBookingWorksSection */}
      <SkeletonSection className="py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6.5">
            <SkeletonHeading />
            <SkeletonLines count={4} />
          </div>
          <SkeletonBlock className="h-80 rounded-xl bg-line" />
        </div>
      </SkeletonSection>

      {/* ReviewsSection */}
      <SkeletonSection className="bg-brand-tint py-16 md:py-24">
        <SkeletonHeading />
        <div className="grid gap-4.5 md:grid-cols-3">
          {[1, 2, 3].map((card) => (
            <SkeletonBlock key={card} className={`h-56 rounded-xl bg-surface ${card > 1 ? "max-md:hidden" : ""}`} />
          ))}
        </div>
      </SkeletonSection>

      {/* GuidesSection */}
      <SkeletonSection className="py-16 md:py-24">
        <SkeletonHeading />
        <SkeletonCards count={3} gridClassName="md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]" />
      </SkeletonSection>
    </PageLoading>
  </>
);
