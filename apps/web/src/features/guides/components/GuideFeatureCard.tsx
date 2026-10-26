import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { guidePath } from "@/lib/routes";

import { formatGuideMonth, formatReadTime } from "../format";
import { getGuideTopic } from "../topics";
import type { TravelGuide } from "../types";
import { CARD_FOCUS, STRETCHED_LINK } from "./styles";

/** The featured story on the Travel guides page: full-bleed photo, chips, title, intro and byline. */
export const GuideFeatureCard = ({ guide }: { guide: TravelGuide }) => (
  <article
    className={`group relative flex h-full min-h-105 flex-col justify-end gap-3.5 overflow-hidden rounded-xl bg-navy p-5.5 text-white md:min-h-120 md:p-8 ${CARD_FOCUS}`}
  >
    {/* Usually in view when the page opens on desktop, so it loads first. */}
    <SiteImage
      image={guide.image}
      priority
      sizes="(min-width: 1240px) 800px, (min-width: 1024px) 62vw, 100vw"
      className="object-cover object-[50%_30%] transition-transform duration-500 group-hover:scale-105"
    />
    {/* Shading strong enough for white text even where it sits over bright snow. */}
    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/5 via-navy/45 via-40% to-navy/92" />

    <div className="relative flex flex-wrap gap-2">
      <span className="rounded-md bg-saffron px-2.5 py-1 text-xs font-extrabold tracking-wide text-ink uppercase">
        Featured
      </span>
      <span className="rounded-md bg-white/18 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
        {getGuideTopic(guide.topic).label}
      </span>
    </div>
    <h3 className="relative max-w-170 text-h2-sm text-white md:text-h1-sm">
      <Link href={guidePath(guide.slug)} className={STRETCHED_LINK}>
        {guide.title}
      </Link>
    </h3>
    <p className="relative max-w-155 text-white/90 md:text-body-lg">{guide.excerpt}</p>
    <p className="relative flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-body-sm text-white/85">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-white/15">
        <Icon name="person" size={18} />
      </span>
      <span>
        {guide.author} · <time dateTime={guide.publishedOn}>{formatGuideMonth(guide.publishedOn)}</time> ·{" "}
        {formatReadTime(guide.readMinutes)}
      </span>
    </p>
  </article>
);
