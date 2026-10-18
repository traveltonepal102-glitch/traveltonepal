import type { IconName } from "@ttn/ui/icon";

import type { IconTone } from "@/components/shared/iconTones";

export type GuideTopicId = "planning" | "best-time" | "health" | "gear";

export type GuideTopic = {
  id: GuideTopicId;
  /** Short chip label on guide cards, e.g. "Planning". */
  label: string;
  /** Card title in "Browse by topic", e.g. "Planning and permits". */
  title: string;
  description: string;
  icon: IconName;
  tone: IconTone;
};

/** Travel guide topics; written in page order. */
const TOPICS_BY_ID: Record<GuideTopicId, GuideTopic> = {
  planning: {
    id: "planning",
    label: "Planning",
    title: "Planning and permits",
    description: "Permits, guides, costs, visas and how booking works.",
    icon: "description",
    tone: "brand",
  },
  "best-time": {
    id: "best-time",
    label: "Best time to trek",
    title: "Best time to trek",
    description: "Seasons, weather and the best months for each region.",
    icon: "wb_sunny",
    tone: "saffron",
  },
  health: {
    id: "health",
    label: "Health",
    title: "Health and altitude",
    description: "Fitness, acclimatization, altitude sickness and safety.",
    icon: "health_and_safety",
    tone: "green",
  },
  gear: {
    id: "gear",
    label: "Gear",
    title: "Gear and packing",
    description: "Packing lists, clothing layers and what to rent in Kathmandu.",
    icon: "backpack",
    tone: "navy",
  },
};

export const GUIDE_TOPICS: readonly GuideTopic[] = Object.values(TOPICS_BY_ID);

export const getGuideTopic = (id: GuideTopicId) => TOPICS_BY_ID[id];
