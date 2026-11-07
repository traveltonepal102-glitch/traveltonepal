import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { pagePath } from "@/lib/routes";

import type { HomeGuide } from "../types";
import { GUIDE_TOPIC_ICONS } from "./guideTopicIcons";

/** A travel guide: its photo with the topic on it, the title and "Read the blog". The whole card is the link. */
export const GuideCard = ({ guide, isPriority = false }: { guide: HomeGuide; isPriority?: boolean }) => (
  <article className="group relative flex flex-col overflow-hidden rounded-[14px] border border-solid border-line bg-snow shadow-card transition-shadow hover:shadow-raised">
    <div className="relative aspect-4/3 overflow-hidden bg-forest-tint">
      {guide.image && <SiteImage image={guide.image} isPriority={isPriority} sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs leading-4 font-semibold tracking-[0.06em] text-forest uppercase">
        <TrailIcon name={GUIDE_TOPIC_ICONS[guide.topic] ?? "doc"} size={14} />
        {guide.tag}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1.5 px-4.5 pt-4 pb-4.5">
      <h3 className="text-[21px]! leading-6.75!">
        {/* The link's ::after covers the card, so the whole card opens the guide. */}
        <Link href={pagePath(guide.slug)} className="text-ink no-underline after:absolute after:inset-0 group-hover:underline">
          {guide.title}
        </Link>
      </h3>
      {guide.text && <p className="text-[15px] leading-5.75">{guide.text}</p>}
      <p className="text-sm leading-5 text-muted">{guide.meta}</p>
      <span aria-hidden="true" className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[15px] font-semibold text-forest">
        Read the blog
        <TrailIcon name="arrow" size={16} />
      </span>
    </div>
  </article>
);
