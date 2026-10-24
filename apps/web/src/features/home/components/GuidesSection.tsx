import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { FeaturedGuideCard, GuideCard } from "@/features/guides/components/GuideCard";
import type { GuideSummary } from "@/features/guides/types";
import { ROUTES } from "@/lib/routes";

/**
 * The row's columns by how many guides there are, so it never has empty places. Three (the design): desktop
 * featured (wider) + two cards, tablet featured on its own row and two cards below. Phones: one column.
 */
const LAYOUTS = {
  1: { grid: "", featured: "" },
  2: { grid: "md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]", featured: "" },
  3: { grid: "md:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]", featured: "md:col-span-full lg:col-span-1" },
} as const;

/** "Before you go" travel guides (design: Main.dc.html): the featured guide and up to two more. */
export const GuidesSection = ({ guides }: { guides: GuideSummary[] }) => {
  const [featured, ...rest] = guides;
  // Nothing published yet: no section, rather than an empty one.
  if (!featured) return null;
  const others = rest.slice(0, 2);
  const layout = LAYOUTS[others.length === 0 ? 1 : others.length === 1 ? 2 : 3];

  return (
    <section aria-labelledby="guides-title" className="py-16 md:py-24">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4.5">
          <div className="flex flex-col gap-2.5">
            <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
              <Icon name="description" size={18} />
              Before you go
            </p>
            <h2 id="guides-title" className="text-h2 tracking-tight md:text-h1">
              Nepal trekking guides
            </h2>
          </div>
          <Link
            href={ROUTES.guides}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Read all guides
            <Icon name="arrow_forward" size={18} />
          </Link>
        </div>

        <ul className={`grid gap-4 md:gap-5 ${layout.grid}`}>
          <li className={layout.featured}>
            <FeaturedGuideCard guide={featured} sizes={others.length === 0 ? "(min-width: 1280px) 1200px, 100vw" : undefined} />
          </li>
          {others.map((guide) => (
            <li key={guide.slug}>
              <GuideCard guide={guide} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
