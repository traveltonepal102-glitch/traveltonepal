import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { guidePath } from "@/lib/routes";

import { formatReadTime } from "../format";
import { getGuideTopic } from "../topics";
import type { TravelGuide } from "../types";
import { CARD_FOCUS, STRETCHED_LINK } from "./styles";

/** Compact guide card: photo beside the topic, title, intro and reading time (photo on top on phones). */
export const GuideRowCard = ({ guide }: { guide: TravelGuide }) => (
  <article
    className={`group relative flex h-full flex-col gap-4 rounded-xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-raised sm:flex-row ${CARD_FOCUS}`}
  >
    <div className="relative aspect-video flex-none overflow-hidden rounded-lg bg-brand-tint sm:aspect-auto sm:min-h-36 sm:w-42 lg:min-h-52">
      <Image
        src={guide.image.src}
        alt={guide.image.alt}
        fill
        sizes="(min-width: 640px) 168px, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2 sm:py-1">
      <span className="self-start rounded-full bg-brand-tint px-2.5 py-0.75 text-xs font-bold text-brand">
        {getGuideTopic(guide.topic).label}
      </span>
      <h3 className="text-h3">
        <Link href={guidePath(guide.slug)} className={STRETCHED_LINK}>
          {guide.title}
        </Link>
      </h3>
      <p className="text-body-sm text-text">{guide.excerpt}</p>
      <p className="mt-auto inline-flex items-center gap-1.5 pt-2 text-caption text-muted-foreground">
        <Icon name="schedule" size={16} />
        {formatReadTime(guide.readMinutes)}
      </p>
    </div>
  </article>
);
