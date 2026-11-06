import type { IconName } from "@ttn/ui/icon";

import type { GuideFactIcon } from "@ttn/site-data/guidePageJson";
import { readFacts as readSharedFacts } from "@ttn/site-data/guidePageJson";

import type { IconTone } from "@/components/shared/iconTones";

export * from "@ttn/site-data/guidePageJson";

/** Key fact icons' colours on this website. */
const FACT_TONES = {
  wb_sunny: "green",
  water_drop: "brand",
  altitude: "saffron",
  wb_twilight: "navy",
  calendar_month: "brand",
  schedule: "navy",
  payments: "green",
  hiking: "saffron",
  landscape: "green",
  route: "brand",
  groups: "navy",
  description: "brand",
} as const satisfies Record<GuideFactIcon, IconTone> & Partial<Record<IconName, IconTone>>;

export const readFacts = (value: unknown) => readSharedFacts(value).map((fact) => ({ ...fact, tone: FACT_TONES[fact.icon] }));
