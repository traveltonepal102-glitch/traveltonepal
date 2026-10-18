import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { ICON_TONES } from "@/components/shared/iconTones";

import { formatGuideCount } from "../format";
import { guideListHref } from "../guideFiltering";
import type { GuideTopic } from "../topics";
import { CARD_FOCUS, STRETCHED_LINK } from "./styles";

type GuideTopicCardProps = {
  topic: GuideTopic;
  guideCount: number;
};

/** Topic card: icon, title, what it covers and how many guides. The title links to the topic's guides. */
export const GuideTopicCard = ({ topic, guideCount }: GuideTopicCardProps) => {
  const hasGuides = guideCount > 0;

  return (
    <article
      className={`group relative flex h-full flex-col gap-2 rounded-xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-raised ${CARD_FOCUS}`}
    >
      <span aria-hidden="true" className={`mb-2 grid size-11 place-items-center rounded-lg ${ICON_TONES[topic.tone]}`}>
        <Icon name={topic.icon} size={22} />
      </span>
      <h3 className="text-h4">
        {hasGuides ? (
          <Link href={guideListHref({ topic: topic.id })} className={STRETCHED_LINK}>
            {topic.title}
          </Link>
        ) : (
          topic.title
        )}
      </h3>
      <p className="text-body-sm text-text">{topic.description}</p>
      {hasGuides ? (
        <p className="mt-auto inline-flex items-center gap-1 pt-2 text-caption font-bold text-brand">
          {formatGuideCount(guideCount)}
          <Icon name="arrow_forward" size={16} />
        </p>
      ) : (
        <p className="mt-auto pt-2 text-caption text-muted-foreground">Guides coming soon</p>
      )}
    </article>
  );
};
