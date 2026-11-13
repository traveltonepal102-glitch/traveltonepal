import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ShareButton } from "@/features/home/components/ShareButton";
import { ROUTES } from "@/lib/routes";

import type { BlogArticle } from "../types";

const SHARE = "inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-solid border-line bg-transparent px-4 text-[15px] font-semibold text-ink hover:bg-forest-tint";
const TAG = "inline-flex items-center rounded-full px-3 py-1 text-sm leading-5 font-semibold";

/** The top on plain white: where it sits, the topic, the title and intro, who wrote it and when; the photo follows at full width. */
export const BlogHeader = ({ blog }: { blog: BlogArticle }) => {
  const { title, intro, image, topic, topicLabel, highlightTag, updatedLine, publishedOn, publishedLabel, updatedOn, updatedLabel, readMinutes, author } = blog;

  return (
    <header className="wrap flex flex-col gap-7 pt-6">
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Blogs", href: ROUTES.blogs }, { label: topicLabel, href: `${ROUTES.blogs}?topic=${topic}` }]} />
        <p className="flex flex-wrap gap-2">
          <span className={`${TAG} bg-forest-tint text-forest-deep`}>{topicLabel}</span>
          {highlightTag && <span className={`${TAG} bg-saffron-tint text-saffron-ink`}>{highlightTag}</span>}
        </p>
        <h1>{title}</h1>
        {intro && <p className="max-w-none text-[19px] leading-7.5">{intro}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-0 border-y border-solid border-line py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-forest-tint text-forest">
            {author.photo ? <SiteImage image={author.photo} sizes="48px" className="object-cover" /> : <TrailIcon name="users" size={22} />}
          </span>
          <p className="flex flex-col text-[15px] leading-5.5">
            <span className="font-semibold text-ink">By {author.name}</span>
            <span className="text-muted">
              <time dateTime={publishedOn}>{publishedLabel}</time> · {readMinutes} min read
              {updatedOn && (
                <>
                  {" "}
                  · Updated <time dateTime={updatedOn}>{updatedLabel}</time>
                </>
              )}
              {updatedLine && ` · ${updatedLine}`}
            </span>
          </p>
        </div>
        <ShareButton title={title} className={SHARE} />
      </div>
      <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-forest-tint md:aspect-21/9">
        <SiteImage image={image} isPriority sizes="(min-width: 1440px) 1392px, 100vw" className="object-cover" />
      </div>
    </header>
  );
};
