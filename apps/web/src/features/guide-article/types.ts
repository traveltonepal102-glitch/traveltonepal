import type { IconName } from "@ttn/ui/icon";

import type { IconTone } from "@/components/shared/iconTones";
import type { TravelGuide } from "@/features/guides/types";
import type { MonthRating } from "@/features/regions/overviews";
import type { TrekSummary } from "@/features/treks/types";

/** Text with optional bold parts: ["October", { strong: "and November" }]. */
export type RichText = readonly (string | { strong: string })[];

/** One row of the month-by-month table (the month's rating comes from the region). */
export type MonthNote = { onTheTrail: string; crowds: string };

/** A piece of an article section, in reading order. */
export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "figure"; image: { src: string; alt: string }; caption: string }
  /** The month strip, from the article's region. */
  | { type: "season-strip" }
  /** Jan–Dec, exactly 12 notes; the verdict is the region's rating for the month. */
  | { type: "month-table"; months: readonly MonthNote[] }
  /** Card for the article's trek. */
  | { type: "trek-card" }
  | { type: "tip"; title: string; text: string };

export type GuideSection = {
  /** Anchor for the contents list, e.g. "autumn". */
  id: string;
  /** Short name in the contents list, e.g. "Autumn". */
  tocLabel: string;
  title: string;
  blocks: readonly GuideBlock[];
};

export type GuideFact = { icon: IconName; tone: IconTone; label: string; value: string };

export type GuideFaq = { question: string; answer: string };

/** An article's page content. Moves to Payload in the CMS phase. */
export type GuideArticleContent = {
  /** Same slug as the guide in TRAVEL_GUIDES. */
  slug: string;
  /** Hero intro under the title (longer than the card excerpt). */
  standfirst: string;
  /** Trek the article is about (TREKS slug): hero chip, trek cards. */
  trekSlug?: string;
  /** Region the article is about (REGION_OVERVIEWS slug): month ratings. */
  regionSlug?: string;
  /** Green hero chip, e.g. "Oct–Nov & Mar–May". */
  bestMonths?: string;
  authorRole: string;
  authorBio: string;
  /** "Updated for the 2026 season". */
  updatedForSeason: number;
  facts: readonly GuideFact[];
  quickAnswer: RichText;
  /** Paragraphs between the quick answer and the first section. */
  intro: readonly string[];
  sections: readonly GuideSection[];
  faqs: readonly GuideFaq[];
  /** "Related guides", in this order (TRAVEL_GUIDES slugs); the rest are picked automatically. */
  relatedSlugs?: readonly string[];
  seo: { title: string; description: string };
};

/** The guide (list fields) and its page content joined, with the trek and month ratings it refers to. */
export type GuideArticle = TravelGuide &
  GuideArticleContent & {
    trek?: TrekSummary;
    /** Jan–Dec ratings of the article's region. */
    months?: readonly MonthRating[];
  };
