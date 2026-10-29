import type { IconName } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { GuideTopicId } from "@/features/guides/topics";
import type { MonthRating } from "@/features/regions/overviews";
import type { ItineraryDay } from "@/features/trek-detail/types";
import type { TrekSummary } from "@/features/treks/types";
import type { SiteImageSource } from "@/lib/images";

/** One row of the month-by-month table (the month's rating is in the article's months). */
export type MonthNote = { onTheTrail: string; crowds: string };

/** A trekking guide shown in the article (a tip, their own words, or "Meet the guides"). */
export type GuidePerson = { name: string; role: string; quote?: string; photo?: SiteImageSource };

/** A day of a trek's plan shown in the article, with its number in the trek. */
export type ArticleDay = ItineraryDay & { dayNumber: number };

/** A piece of the article body, top to bottom (the admin's section kinds). */
export type ArticleBlock =
  | { type: "quick"; body: RichTextDoc }
  | { type: "paragraph"; body: RichTextDoc }
  /** A section with its heading: a stop in the contents list. */
  | { type: "text"; id: string; heading: string; tocLabel: string; body: RichTextDoc }
  | { type: "callout"; tone: "note" | "warning"; body: RichTextDoc }
  | { type: "check"; heading: string; items: readonly string[] }
  /** The article's months, as a colour strip or a table with notes. */
  | { type: "months"; heading: string; view: "strip" | "table" }
  | { type: "cta"; heading: string; buttonText: string; message: string }
  | { type: "trek"; trek: TrekSummary }
  | { type: "quote"; text: string }
  | { type: "days"; trek: TrekSummary; days: readonly ArticleDay[] }
  | { type: "cost"; heading: string; rows: readonly { item: string; price: string }[]; totalLabel: string; total: string }
  | { type: "compare"; treks: readonly TrekSummary[] }
  | { type: "tip"; guide: GuidePerson; text: string }
  | { type: "gquote"; guide: GuidePerson; text: string }
  | { type: "meet"; heading: string; guides: readonly GuidePerson[] }
  | { type: "image"; image: SiteImageSource; caption: string }
  | { type: "gallery"; images: readonly SiteImageSource[] }
  | { type: "map"; title: string; place: string }
  /** A YouTube video, played in privacy-enhanced mode once the visitor allows it. */
  | { type: "video"; youtubeId: string; title: string };

export type GuideFact = { icon: IconName; tone: IconTone; label: string; value: string };

export type GuideFaq = { question: string; answer: RichTextDoc };

export type ArticleAuthor = {
  name: string;
  /** Job title under the name, e.g. "Senior trek leader, Langtang". */
  role: string;
  bio: string;
  photo?: SiteImageSource;
  /** Office team and trekking guides get the blue tick; guest writers don't. */
  isVerified: boolean;
};

/** A travel guide's page (guidePageRows, from the database). */
export type GuideArticle = {
  slug: string;
  title: string;
  /** Under the title, longer than the card text. */
  intro: string;
  image: SiteImageSource;
  topic: GuideTopicId;
  /** Green tag on the photo, e.g. "Best: Oct–Nov & Mar–May". */
  highlightTag?: string;
  /** Next to the reading time, e.g. "Updated for the 2026/2027 season". */
  updatedLine?: string;
  facts: readonly GuideFact[];
  /** ISO dates. */
  publishedOn: string;
  updatedOn?: string;
  readMinutes: number;
  author: ArticleAuthor;
  /** "Fact-checked by", when a guide checked it. */
  checker?: GuidePerson;
  /** The trek the guide is about: the plan-your-trek card and the photo's trek tag. */
  trek?: TrekSummary;
  months?: { ratings: readonly MonthRating[]; notes: readonly MonthNote[] };
  blocks: readonly ArticleBlock[];
  /** "Questions and answers" (shown after the body, and as FAQ data for Google). */
  faqs: readonly GuideFaq[];
  /** "Keep reading", in order (published guides only). */
  relatedSlugs: readonly string[];
  regionSlugs: readonly string[];
  seo: { title: string; description: string };
};
