import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { pagePath } from "@/lib/routes";

import type { HomeGuide } from "../types";
import { GUIDE_TOPIC_ICONS } from "./guideTopicIcons";

/** The featured guide: words over its photo, darkened so they stay readable. The whole card is the link. */
export const GuideFeatureCard = ({ guide, className = "" }: { guide: HomeGuide; className?: string }) => (
  <article className={`group relative flex min-h-105 flex-col justify-end gap-3 overflow-hidden rounded-[14px] bg-forest-deep p-8 text-snow max-sm:p-5.5 ${className}`}>
    {guide.image && <SiteImage image={guide.image} sizes="(min-width: 1024px) 800px, 100vw" className="object-cover object-[50%_25%] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />}
    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-forest-deep/10 via-forest-deep/70 via-45% to-forest-deep/95" />
    <span className="relative inline-flex items-center gap-1.5 self-start rounded-full bg-saffron px-3 py-1 text-xs leading-4 font-semibold tracking-[0.06em] text-ink uppercase">
      <TrailIcon name={GUIDE_TOPIC_ICONS[guide.topic] ?? "doc"} size={14} />
      {guide.tag}
    </span>
    <h3 className="relative max-w-135 text-[32px]! leading-9.5! text-snow! max-sm:text-2xl! max-sm:leading-7.5!">
      {/* The link's ::after covers the card, so the whole card opens the guide. */}
      <Link href={pagePath(guide.slug)} className="text-snow no-underline after:absolute after:-inset-[100vmax] hover:text-snow group-hover:underline">
        {guide.title}
      </Link>
    </h3>
    {guide.text && <p className="relative max-w-130 text-white/90">{guide.text}</p>}
    <p className="relative text-sm leading-5 text-white/80">{guide.meta}</p>
    <span aria-hidden="true" className="relative mt-1 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full bg-snow px-4.5 text-[15px] font-semibold text-forest">
      Read the blog
      <TrailIcon name="arrow" />
    </span>
  </article>
);
