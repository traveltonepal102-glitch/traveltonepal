import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/**
 * Building blocks of the page skeletons (each route's `loading.tsx`), in the website's own colours: line-coloured
 * blocks on light grounds, white ones on navy. Keep skeletons lean: a page's skeleton is sent inside that page's
 * payload too.
 */

export type SkeletonTone = "light" | "dark";

const TONES = {
  light: { soft: "bg-line", strong: "bg-field/60" },
  dark: { soft: "bg-white/15", strong: "bg-white/25" },
} as const;

const LINE_WIDTHS = ["w-full", "w-11/12", "w-full", "w-5/6"] as const;

/** Each line's box is as tall as the real text's line: body text (17px on 27px) or a page's intro (19px on 30px). */
const LINE_SIZES = {
  body: { box: "h-[27px]", bar: "h-4" },
  lead: { box: "h-7.5", bar: "h-5" },
} as const;

type SkeletonLinesProps = { count?: number; tone?: SkeletonTone; size?: keyof typeof LINE_SIZES };

/** Lines of text, the last one shorter, each as tall as a real line so nothing moves when the page arrives. */
export const SkeletonLines = ({ count = 4, tone = "light", size = "body" }: SkeletonLinesProps) => (
  <div className="flex flex-col">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className={`flex items-center ${LINE_SIZES[size].box}`}>
        <SkeletonBlock
          className={`${LINE_SIZES[size].bar} ${index === count - 1 ? "w-2/3" : LINE_WIDTHS[index % LINE_WIDTHS.length]} ${TONES[tone].soft}`}
        />
      </div>
    ))}
  </div>
);

/** An H1 line: as tall as the real heading's line (36–56px type on 1.08). */
export const SkeletonTitle = ({ width }: { width: string }) => (
  <SkeletonBlock className={`h-10 bg-field/60 md:h-12.5 lg:h-15 ${width}`} />
);

type SkeletonHeadingProps = { tone?: SkeletonTone; hasIntro?: boolean };

/** A section's eyebrow and heading (SectionHeading), optionally with the line under it. */
export const SkeletonHeading = ({ tone = "light", hasIntro = false }: SkeletonHeadingProps) => (
  <div className="flex flex-col gap-2.5">
    <SkeletonBlock className={`h-3.5 w-28 ${TONES[tone].soft}`} />
    <SkeletonBlock className={`h-9 w-3/4 max-w-120 ${TONES[tone].strong}`} />
    {hasIntro && <SkeletonBlock className={`h-5 w-11/12 max-w-150 ${TONES[tone].soft}`} />}
  </div>
);

type SkeletonCardsProps = {
  count: number;
  /** Columns of the real grid, e.g. "md:grid-cols-2 lg:grid-cols-3". */
  gridClassName: string;
};

/** Blog cards (GuideCard): the photo on top and a few lines under it. */
export const SkeletonCards = ({ count, gridClassName }: SkeletonCardsProps) => (
  <div className={`grid gap-5 ${gridClassName}`}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-snow">
        <SkeletonBlock className="aspect-4/3 rounded-none bg-sky" />
        <div className="flex flex-col gap-2.5 p-5">
          <SkeletonBlock className="h-5 w-3/4 bg-field/60" />
          <SkeletonBlock className="h-4 w-full bg-line" />
          <SkeletonBlock className="h-4 w-1/2 bg-line" />
        </div>
      </div>
    ))}
  </div>
);

type SkeletonPageTopProps = {
  /** How many lines the real title runs to on a wide screen. */
  titleLines?: number;
  /** How many lines the real intro runs to on a wide screen (it is at most 62ch wide). */
  introLines: number;
};

/** The cloud page top of Blog and Kontakt: breadcrumb, title and intro, at their real line heights. */
export const SkeletonPageTop = ({ titleLines = 1, introLines }: SkeletonPageTopProps) => (
  <div className="border-b border-line bg-cloud">
    <div className="wrap flex flex-col gap-3 pt-6 pb-10">
      <SkeletonBlock className="h-5 w-36 bg-line" />
      <div className="flex flex-col">
        {Array.from({ length: titleLines }, (_, index) => (
          <SkeletonTitle key={index} width={index === titleLines - 1 && titleLines > 1 ? "w-2/5" : "w-4/5 max-w-205"} />
        ))}
      </div>
      <div className="max-w-[62ch]">
        <SkeletonLines count={introLines} size="lead" />
      </div>
    </div>
  </div>
);
