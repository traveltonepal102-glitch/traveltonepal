import type { ReactNode } from "react";

import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/**
 * Building blocks of the page skeletons (each route's `loading.tsx`). Light blocks on light grounds, white ones on navy.
 * Keep skeletons lean: a page's skeleton is sent inside that page's payload too.
 */

export type SkeletonTone = "light" | "dark";

const TONES = {
  light: { soft: "bg-line", strong: "bg-line-strong" },
  dark: { soft: "bg-white/15", strong: "bg-white/25" },
} as const;

/** The pages' content width, as `WRAP` in the features' styles. */
export const SKELETON_WRAP = "mx-auto w-full max-w-content px-4 md:px-6";

const LINE_WIDTHS = ["w-full", "w-11/12", "w-full", "w-5/6"] as const;

type SkeletonLinesProps = { count?: number; tone?: SkeletonTone };

/** Lines of body text, the last one shorter. */
export const SkeletonLines = ({ count = 4, tone = "light" }: SkeletonLinesProps) => (
  <div className="flex flex-col gap-2.5">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonBlock
        key={index}
        className={`h-4 ${index === count - 1 ? "w-2/3" : LINE_WIDTHS[index % LINE_WIDTHS.length]} ${TONES[tone].soft}`}
      />
    ))}
  </div>
);

type SkeletonHeadingProps = { tone?: SkeletonTone; hasIntro?: boolean };

/** A section's eyebrow and heading, optionally with the line under it. */
export const SkeletonHeading = ({ tone = "light", hasIntro = false }: SkeletonHeadingProps) => (
  <div className="flex flex-col gap-2.5">
    <SkeletonBlock className={`h-3.5 w-28 ${TONES[tone].soft}`} />
    <SkeletonBlock className={`h-9 w-3/4 max-w-120 md:h-11 ${TONES[tone].strong}`} />
    {hasIntro && <SkeletonBlock className={`h-5 w-11/12 max-w-150 ${TONES[tone].soft}`} />}
  </div>
);

type SkeletonCardsProps = {
  count: number;
  /** Columns of the real grid, e.g. "sm:grid-cols-2 lg:grid-cols-3". */
  gridClassName: string;
  /** The photo's shape, e.g. "aspect-video". */
  mediaClassName?: string;
};

/** Cards with a photo on top and a few lines under it (trek, region and guide cards). */
export const SkeletonCards = ({ count, gridClassName, mediaClassName = "aspect-video" }: SkeletonCardsProps) => (
  <div className={`grid gap-4.5 ${gridClassName}`}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <SkeletonBlock className={`rounded-none bg-line-strong ${mediaClassName}`} />
        <div className="flex flex-col gap-2.5 p-4">
          <SkeletonBlock className="h-5 w-3/4 bg-line" />
          <SkeletonBlock className="h-4 w-full bg-line" />
          <SkeletonBlock className="h-4 w-1/2 bg-line" />
        </div>
      </div>
    ))}
  </div>
);

type SkeletonChipsProps = { count: number; tone?: SkeletonTone };

/** A row of rounded chips (facts under a page title). */
export const SkeletonChips = ({ count, tone = "dark" }: SkeletonChipsProps) => (
  <div className="flex flex-wrap gap-2 pt-1">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonBlock key={index} className={`h-8 w-32 rounded-full ${TONES[tone].soft}`} />
    ))}
  </div>
);

type SkeletonNavyTopProps = {
  /** The real top's padding, e.g. "pt-5.5 pb-11". */
  className: string;
  children?: ReactNode;
};

/** A navy page top over a photo: breadcrumb, eyebrow, title and intro, then the page's own extras. */
export const SkeletonNavyTop = ({ className, children }: SkeletonNavyTopProps) => (
  <div className="bg-navy">
    <div className={`${SKELETON_WRAP} flex flex-col gap-4 ${className}`}>
      <SkeletonBlock className="h-4 w-40 bg-white/15" />
      <SkeletonBlock className="h-3.5 w-28 bg-white/15" />
      <SkeletonBlock className="h-10 w-4/5 max-w-190 bg-white/25 md:h-14" />
      <SkeletonBlock className="h-5 w-3/4 max-w-160 bg-white/15" />
      {children}
    </div>
  </div>
);

type SkeletonSectionProps = {
  /** The real section's band: background and padding, e.g. "bg-muted py-16 md:py-24". */
  className?: string;
  children: ReactNode;
};

/** A section's band with the page's content width inside. */
export const SkeletonSection = ({ className = "", children }: SkeletonSectionProps) => (
  <div className={className}>
    <div className={`${SKELETON_WRAP} flex flex-col gap-6`}>{children}</div>
  </div>
);
