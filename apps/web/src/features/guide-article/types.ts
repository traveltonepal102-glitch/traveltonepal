import type { GuideHelpBox } from "@ttn/config/guideHelpBox";
import type { GuideBlock, GuidePerson } from "@ttn/site-data/guideBlocks";
import type { IconName } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { GuideTopicId } from "@/features/guides/topics";
import type { MonthRating } from "@/features/regions/overviews";
import type { PageSeo } from "@/features/seo/shareMetadata";
import type { TrekSummary } from "@/features/treks/types";
import type { SiteImageSource } from "@/lib/images";

/** One row of the month-by-month table (the month's rating is in the article's months). */
export type MonthNote = { onTheTrail: string; crowds: string };

export type { GuideDay as ArticleDay, GuidePerson } from "@ttn/site-data/guideBlocks";

/** A piece of the article body, top to bottom (the admin's section kinds). */
export type ArticleBlock = GuideBlock<TrekSummary>;

export type GuideFact = { icon: IconName; tone: IconTone; label: string; value: string };

export type GuideFaq = { question: string; answer: RichTextDoc };

export type ArticleAuthor = {
  name: string;
  /** Job title under the name, e.g. "Senior trek leader, Langtang". */
  role: string;
  bio: string;
  /** For the structured data only (never shown): the author's profile links from the admin, the main one first. */
  profileLinks: string[];
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
  /** "Questions and answers" (shown where the faq block is, and as FAQ data for Google). */
  faqs: readonly GuideFaq[];
  /** "Keep reading", in order (published guides only). */
  relatedSlugs: readonly string[];
  regionSlugs: readonly string[];
  seo: PageSeo;
  /** The navy box beside the guide (a local expert on WhatsApp or by email), worded for this guide or the default. */
  helpBox: GuideHelpBox;
  /** False for a general guide: no sidebar ("Plan this trek" and the help box), and the article takes its width. */
  showSidebar: boolean;
};
