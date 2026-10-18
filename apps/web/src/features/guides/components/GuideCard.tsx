import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { guidePath } from "@/lib/routes";

import type { GuideSummary } from "../types";
import { CARD_FOCUS, STRETCHED_LINK } from "./styles";

const READ_THE_GUIDE = (
  <span aria-hidden="true" className="inline-flex items-center gap-1 text-body-sm font-extrabold text-brand">
    Read the guide
    <Icon name="arrow_forward" size={16} />
  </span>
);

type GuideCardProps = {
  guide: GuideSummary;
  /** Bottom line of the card; "Read the guide" by default. */
  footer?: ReactNode;
};

/** Guide card: photo with topic chip, title, one line and a footer line. One link (the title). */
export const GuideCard = ({ guide, footer = READ_THE_GUIDE }: GuideCardProps) => (
  <article
    className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-raised ${CARD_FOCUS}`}
  >
    <div className="relative aspect-video overflow-hidden bg-brand-tint lg:aspect-4/3">
      <Image
        src={guide.image.src}
        alt={guide.image.alt}
        fill
        sizes="(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold tracking-wide text-brand uppercase">
        <Icon name={guide.tagIcon} size={14} />
        {guide.tag}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1.5 px-4.5 pt-4 pb-4.5">
      <h3 className="text-h3">
        <Link href={guidePath(guide.slug)} className={STRETCHED_LINK}>
          {guide.title}
        </Link>
      </h3>
      <p className="text-body-sm text-text">{guide.excerpt}</p>
      <div className="mt-auto pt-1.5">{footer}</div>
    </div>
  </article>
);

/** The big featured guide: full-bleed photo, chip, large title, button. One link (the title). */
export const FeaturedGuideCard = ({ guide }: { guide: GuideSummary }) => (
  <article
    className={`group relative flex h-full min-h-100 flex-col justify-end gap-3 overflow-hidden rounded-xl bg-navy p-5.5 text-white md:min-h-95 md:p-8 lg:min-h-105 ${CARD_FOCUS}`}
  >
    <Image
      src={guide.image.src}
      alt={guide.image.alt}
      fill
      sizes="(min-width: 1024px) 520px, 100vw"
      // Keep the top of the photo (the peaks) when the card is wide, e.g. full-width on tablets.
      className="object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105"
    />
    {/* Shading strong enough for white text even where it sits over bright snow. */}
    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/10 via-navy/60 via-40% to-navy/92" />
    <span className="relative inline-flex items-center gap-1.5 self-start rounded-full bg-saffron px-3 py-1 text-xs font-extrabold text-ink">
      <Icon name={guide.tagIcon} size={14} />
      {guide.tag}
    </span>
    <h3 className="relative max-w-135 text-h2-sm text-white md:text-h1-sm">
      <Link href={guidePath(guide.slug)} className={STRETCHED_LINK}>
        {guide.title}
      </Link>
    </h3>
    <p className="relative max-w-130 text-white/90">{guide.excerpt}</p>
    <span
      aria-hidden="true"
      className="relative mt-1 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full bg-white px-4.5 text-body-sm font-extrabold text-brand"
    >
      Read the guide
      <Icon name="arrow_forward" size={18} />
    </span>
  </article>
);
