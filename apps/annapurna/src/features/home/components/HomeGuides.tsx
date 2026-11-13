import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import type { HomeGuide } from "../types";
import { GuideCard } from "./GuideCard";
import { GuideFeatureCard } from "./GuideFeatureCard";

const TOPIC = "inline-flex min-h-10 items-center rounded-full border border-solid px-4 text-[15px] font-semibold no-underline";

/** The latest travel guides (design: Featured guide card and Guide card): the featured one large, the others beside and under it. Hidden while there are none. */
export const HomeGuides = ({ guides }: { guides: readonly HomeGuide[] }) => {
  const [featured, ...rest] = guides;
  if (!featured) return null;
  const topics = [...new Map(guides.map((guide) => [guide.topic, guide.tag])).entries()];

  return (
    <section aria-labelledby="guides-h" className="wrap flex flex-col gap-7 py-22 max-md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4.5">
        <SectionHeading id="guides-h" eyebrow="Blogs" title="Read before you go" />
        <Link href={ROUTES.blogs} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
          View all blogs
          <TrailIcon name="arrow" />
        </Link>
      </div>
      <ul aria-label="Blog topics" className="flex flex-wrap gap-2">
        <li>
          <Link href={ROUTES.blogs} className={`${TOPIC} border-navy bg-navy text-snow hover:text-snow`}>
            All
          </Link>
        </li>
        {topics.map(([topic, tag]) => (
          <li key={topic}>
            <Link href={`${ROUTES.blogs}?topic=${topic}`} className={`${TOPIC} border-line bg-snow text-ink`}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <GuideFeatureCard guide={featured} className={rest.length === 0 ? "md:col-span-2 lg:col-span-3" : "md:col-span-2"} />
        {rest.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
};
