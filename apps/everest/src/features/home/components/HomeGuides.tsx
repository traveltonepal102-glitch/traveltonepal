import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { quietButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES, pagePath } from "@/lib/routes";

import type { HomeGuide } from "../types";
import { GuideFeatureCard } from "./GuideFeatureCard";

/** "Vor der Reise lesen" ("Read before you go") (design: Blogs): the first blog large, the next four as a list beside it. Hidden while there are none. */
export const HomeGuides = ({ guides }: { guides: readonly HomeGuide[] }) => {
  const [featured, ...rest] = guides;
  if (!featured) return null;

  return (
    <section aria-labelledby="guides-h" className="wrap flex flex-col gap-7 py-22 max-md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4.5">
        <SectionHeading id="guides-h" eyebrow="Blog" title="Vor der Reise lesen" />
        <Link href={ROUTES.blogs} className={quietButton}>
          Alle Blogartikel
          <TrailIcon name="arrow" size={16} />
        </Link>
      </div>
      {/* One grid row: the list beside the large card is exactly as tall as it, its rows sharing that height evenly. */}
      <div className={`grid items-stretch gap-6 ${rest.length > 0 ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10" : ""}`}>
        <GuideFeatureCard guide={featured} className="min-w-0" />
        {rest.length > 0 && (
          <ul className="m-0 flex min-w-0 list-none flex-col divide-y divide-solid divide-line p-0 lg:border-y lg:border-solid lg:border-line">
            {rest.slice(0, 4).map((guide) => (
              <li key={guide.slug} className="group relative grid flex-1 grid-cols-[132px_minmax(0,1fr)] items-center gap-5 py-4 max-sm:grid-cols-[96px_minmax(0,1fr)] max-sm:gap-4">
                <span className="relative aspect-4/3 overflow-hidden rounded-[14px] bg-ocean-tint">
                  {guide.image && <SiteImage image={{ ...guide.image, alt: "" }} sizes="132px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />}
                </span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-xs leading-4 font-bold tracking-[0.1em] text-glacier-ink uppercase">{guide.tag}</span>
                  {/* The link's ::after covers the row, so the whole row opens the blog. */}
                  <Link href={pagePath(guide.slug)} className="font-display text-[19px] leading-6 font-bold text-ink no-underline after:absolute after:inset-0 group-hover:text-ocean max-sm:text-[17px]">
                    {guide.title}
                  </Link>
                  <span className="text-[13px] leading-4.5 text-muted">{guide.meta}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
