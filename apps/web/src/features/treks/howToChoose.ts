import type { IconName } from "@ttn/ui/icon";

import { guideListHref } from "@/features/guides/guideFiltering";

import { lengthOf } from "./filtering";
import { TREK_LENGTHS, TREK_RESULTS_ID } from "./filters";
import type { TrekSummary } from "./types";

export type ChooseTip = { icon: IconName; tile: string; title: string; text: string; linkLabel: string; href: string };

/** Trek names named per length, at most. */
const EXAMPLES_PER_LENGTH = 3;

/** ["A"] → "A", ["A", "B", "C"] → "A, B or C" */
const orList = (names: readonly string[]) => (names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} or ${names.at(-1)}`);

/**
 * The days tip, naming only treks on the page (published), by the filter's lengths:
 * "Up to 9 days: Poon Hill. 10–15 days: Langtang Valley Trek." Without treks, the lengths alone.
 */
export const daysTipText = (treks: readonly TrekSummary[]) => {
  const parts = TREK_LENGTHS.flatMap((length) => {
    const names = treks.filter((trek) => lengthOf(trek.days) === length.value).slice(0, EXAMPLES_PER_LENGTH).map((trek) => trek.name);
    return names.length > 0 ? [`${length.label}: ${orList(names)}.`] : [];
  });
  return parts.length > 0 ? parts.join(" ") : "Short treks take up to 9 days, classic ones 10–15 days, and long, remote ones 16 days or more.";
};

/** "How to choose the right Nepal trek" (design: Treks.dc.html). TRD: list-page intros live in code. */
export const howToChooseTips = (treks: readonly TrekSummary[]): ChooseTip[] => [
  {
    icon: "calendar_month",
    tile: "bg-brand-tint text-brand",
    title: "How many days do you have?",
    text: daysTipText(treks),
    linkLabel: "Treks by length",
    // The results: the filters beside them on desktop, the "Filters" button above them on phones.
    href: `#${TREK_RESULTS_ID}`,
  },
  {
    icon: "health_and_safety",
    tile: "bg-green-tint text-whatsapp",
    title: "How fit are you, and how high?",
    text: "Easy treks stay below 4,000 m. Above 5,000 m you need good fitness and extra days to acclimatize.",
    linkLabel: "Fitness and altitude guide",
    // The travel guides on that topic (a single guide's page may not exist yet).
    href: guideListHref({ topic: "health" }),
  },
  {
    icon: "wb_sunny",
    tile: "bg-saffron-tint text-saffron-deep",
    title: "When are you travelling?",
    text: "Spring and autumn suit almost every trek. In winter and the monsoon, choose lower or rain-shadow routes.",
    linkLabel: "Best time to trek",
    href: guideListHref({ topic: "best-time" }),
  },
];
