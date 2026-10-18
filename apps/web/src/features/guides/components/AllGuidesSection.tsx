import { Icon } from "@ttn/ui/icon";
import { Suspense } from "react";

import { formatGuideMonth, formatReadTime } from "../format";
import type { RegionOption } from "../guideLists";
import { getGuideTopic } from "../topics";
import type { TravelGuide } from "../types";
import { GuideCard } from "./GuideCard";
import { GuideListExplorer, GuideListStatic } from "./list/GuideListExplorer";
import type { GuideListData } from "./list/GuideListExplorer";

const GuideListCard = ({ guide }: { guide: TravelGuide }) => {
  const topic = getGuideTopic(guide.topic);

  return (
    <GuideCard
      guide={{ ...guide, tag: topic.label, tagIcon: topic.icon }}
      footer={
        <p className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          <Icon name="schedule" size={16} />
          {formatReadTime(guide.readMinutes)} · <time dateTime={guide.publishedOn}>{formatGuideMonth(guide.publishedOn)}</time>
        </p>
      }
    />
  );
};

/**
 * "All guides" list with topic filter, search results and pages. Cards are rendered here on the
 * server; the browser-side list only picks which to show. It reads the URL, which a static page
 * can't know at build time, so it sits in Suspense with a page-1 fallback (as on the Treks page).
 */
type AllGuidesSectionProps = {
  guides: readonly TravelGuide[];
  /** Regions that have guides, for the region menu. */
  regions: readonly RegionOption[];
};

export const AllGuidesSection = ({ guides, regions }: AllGuidesSectionProps) => {
  const data: GuideListData = {
    guides,
    regions,
    cards: Object.fromEntries(guides.map((guide) => [guide.slug, <GuideListCard key={guide.slug} guide={guide} />])),
  };

  return (
    <Suspense fallback={<GuideListStatic {...data} />}>
      <GuideListExplorer {...data} />
    </Suspense>
  );
};
