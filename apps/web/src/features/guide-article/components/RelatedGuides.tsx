import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import type { IconTone } from "@/components/shared/iconTones";
import { formatReadTime } from "@/features/guides/format";
import { getGuideTopic } from "@/features/guides/topics";
import type { TravelGuide } from "@/features/guides/types";
import { ROUTES, guidePath } from "@/lib/routes";

import { FOCUS, WRAP } from "./styles";

/** Topic chip colors (text colors that pass contrast on their tint). */
const CHIP_TONES: Record<IconTone, string> = {
  brand: "bg-brand-tint text-brand",
  saffron: "bg-saffron-tint text-saffron-ink",
  green: "bg-green-tint text-[#0f5e2e]",
  navy: "bg-navy/10 text-navy",
  danger: "bg-danger-tint text-danger",
};

const RelatedCard = ({ guide }: { guide: TravelGuide }) => {
  const topic = getGuideTopic(guide.topic);

  return (
    <Link
      href={guidePath(guide.slug)}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-card transition-shadow hover:shadow-raised ${FOCUS}`}
    >
      <span className="relative block aspect-video overflow-hidden bg-brand-tint">
        <Image
          src={guide.image.src}
          alt={guide.image.alt}
          fill
          sizes="(min-width: 1240px) 390px, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </span>
      <span className="flex flex-1 flex-col gap-2 p-4">
        <span className={`self-start rounded-full px-2.5 py-0.75 text-xs font-bold ${CHIP_TONES[topic.tone]}`}>{topic.label}</span>
        <h3 className="text-[17px] leading-snug font-bold">{guide.title}</h3>
        <span className="mt-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="schedule" size={14} />
          {formatReadTime(guide.readMinutes)}
        </span>
      </span>
    </Link>
  );
};

/** "Keep reading": three related guides and a link to all of them. */
export const RelatedGuides = ({ guides }: { guides: readonly TravelGuide[] }) => {
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-title" className="border-t border-line bg-page pt-10 pb-14 print:hidden">
      <div className={`${WRAP} flex flex-col gap-4.5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-eyebrow text-brand uppercase">Keep reading</p>
            <h2 id="related-guides-title" className="text-h2-sm tracking-tight md:text-[26px]">
              Related guides
            </h2>
          </div>
          <Link href={ROUTES.guides} className={`inline-flex items-center gap-1.5 self-start rounded-sm font-bold text-brand hover:underline ${FOCUS}`}>
            All travel guides
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
        <ul className="grid gap-4.5 md:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <RelatedCard guide={guide} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
