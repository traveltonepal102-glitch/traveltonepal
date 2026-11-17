import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { quietButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES, pagePath } from "@/lib/routes";

import type { HomeGuide } from "../types";
import { GuideFeatureCard } from "./GuideFeatureCard";

/** "Read before you go" (design: Blogs): the first blog large, the next four as a list beside it. Hidden while there are none. */
export const HomeGuides = ({ guides }: { guides: readonly HomeGuide[] }) => {
  const [featured, ...rest] = guides;
  if (!featured) return null;

  return (
    <section aria-labelledby="guides-h" className="wrap flex flex-col gap-7 py-22 max-md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4.5">
        <SectionHeading id="guides-h" eyebrow="Blogs" title="Read before you go" />
        <Link href={ROUTES.blogs} className={quietButton}>
          All blog posts
          <TrailIcon name="arrow" size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-6">
        <GuideFeatureCard guide={featured} className="min-w-0 flex-[1.2_1_520px]" />
        {rest.length > 0 && (
          <ul className="m-0 flex min-w-0 flex-[1_1_420px] list-none flex-col p-0">
            {rest.slice(0, 4).map((guide) => (
              <li key={guide.slug} className="group relative grid grid-cols-[132px_minmax(0,1fr)] items-center gap-4.5 border-0 border-b border-solid border-line py-3.5 max-sm:grid-cols-[96px_minmax(0,1fr)]">
                <span className="relative aspect-4/3 overflow-hidden rounded-[14px] bg-maroon-tint">{guide.image && <SiteImage image={{ ...guide.image, alt: "" }} sizes="132px" className="object-cover" />}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-saffron-ink uppercase">{guide.tag}</span>
                  {/* The link's ::after covers the row, so the whole row opens the blog. */}
                  <Link href={pagePath(guide.slug)} className="text-[19px] leading-6 font-semibold text-ink no-underline after:absolute after:inset-0 group-hover:text-maroon">
                    {guide.title}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
