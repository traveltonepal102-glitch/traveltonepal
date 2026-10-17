import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { FeaturedGuideCard, GuideCard } from "@/features/guides/components/GuideCard";
import { FEATURED_GUIDES } from "@/features/guides/featuredGuides";
import { ROUTES } from "@/lib/routes";

/**
 * "Before you go" travel guides (design: Main.dc.html).
 * Desktop: featured guide (wider) + two cards. Tablet: featured on its own row, two cards below. Phone: one column.
 */
export const GuidesSection = () => {
  const [featured, ...others] = FEATURED_GUIDES;

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

        <ul className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <li className="md:col-span-full lg:col-span-1">
            <FeaturedGuideCard guide={featured} />
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
