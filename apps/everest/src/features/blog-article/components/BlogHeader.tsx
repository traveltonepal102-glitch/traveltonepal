import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ShareButton } from "@/features/home/components/ShareButton";
import { ROUTES } from "@/lib/routes";

import type { BlogArticle } from "../types";

const SHARE = "inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-solid border-line bg-snow px-4 text-[15px] font-semibold text-ocean hover:border-ocean";
const TAG = "inline-flex items-center rounded-full px-3 py-1 text-sm leading-5 font-semibold";

/** The top on a cream band as wide as the page (design: BlogPost): where it sits, the topic, the title and intro across the whole width, who wrote it and when, then the photo. */
export const BlogHeader = ({ blog }: { blog: BlogArticle }) => {
  const { title, intro, image, topicLabel, highlightTag, updatedLine, publishedOn, publishedLabel, updatedOn, updatedLabel, readMinutes, author } = blog;

  return (
    <header className="border-0 border-b border-solid border-line bg-ice">
      <div className="wrap flex flex-col gap-7 pt-8 pb-10">
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Startseite", href: ROUTES.home }, { label: "Blog", href: ROUTES.blogs }, { label: topicLabel }]} />
        <p className="flex flex-wrap gap-2">
          <span className={`${TAG} bg-snow text-ocean-deep`}>{topicLabel}</span>
          {highlightTag && <span className={`${TAG} bg-glacier-tint text-glacier-ink`}>{highlightTag}</span>}
        </p>
        <h1 className="text-ocean">{title}</h1>
        {intro && <p className="max-w-240 text-[20px] leading-8 text-ink">{intro}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-0 border-y border-solid border-line py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-snow text-ocean">
            {author.photo ? <SiteImage image={author.photo} sizes="48px" className="object-cover" /> : <TrailIcon name="users" size={22} />}
          </span>
          <p className="flex flex-col text-[15px] leading-5.5">
            <span className="font-semibold text-ink">Von {author.name}</span>
            <span className="text-muted">
              <time dateTime={publishedOn}>{publishedLabel}</time> · {readMinutes} Min. Lesezeit
              {updatedOn && (
                <>
                  {" "}
                  · Aktualisiert <time dateTime={updatedOn}>{updatedLabel}</time>
                </>
              )}
              {updatedLine && ` · ${updatedLine}`}
            </span>
          </p>
        </div>
        <ShareButton title={title} className={SHARE} />
      </div>
      <div className="relative aspect-16/10 overflow-hidden rounded-[20px] bg-ocean-tint md:aspect-21/9">
        <SiteImage image={image} isPriority sizes="(min-width: 1440px) 1392px, 100vw" className="object-cover" />
      </div>
      </div>
    </header>
  );
};
