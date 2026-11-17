import type { GuideBlock, GuidePerson } from "@ttn/site-data/guideBlocks";
import type { SiteImageSource } from "@ttn/site-data/images";
import type { GuideHelpBox } from "@ttn/config/guideHelpBox";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { TrailIconName } from "@/components/ui/TrailIcon";
import type { HomeGuide, HomeSeo, HomeTrekCard } from "@/features/home/types";

export type BlogBlock = GuideBlock<HomeTrekCard>;

/** `profileLinks`: for the structured data only (never shown), the author's profile links from the admin, the main one first. */
export type BlogAuthor = { name: string; role: string; bio: string; profileLinks: string[]; photo?: SiteImageSource; isOurTeam: boolean };

export type BlogTocLink = { id: string; label: string };

/** One blog's page, from web_travel_guide_pages. */
export type BlogArticle = {
  slug: string;
  title: string;
  intro: string;
  image: SiteImageSource;
  topic: string;
  topicLabel: string;
  highlightTag?: string;
  updatedLine?: string;
  facts: readonly { icon: TrailIconName; label: string; value: string }[];
  /** Saved dates, and the same in words. */
  publishedOn: string;
  publishedLabel: string;
  updatedOn?: string;
  updatedLabel?: string;
  readMinutes: number;
  author: BlogAuthor;
  checker?: GuidePerson;
  /** The trek the blog is about, for "Plan this trek". */
  trek?: HomeTrekCard;
  months?: { ratings: readonly MonthRating[]; notes: readonly { onTheTrail: string; crowds: string }[] };
  blocks: readonly BlogBlock[];
  faqs: readonly { question: string; body: RichTextDoc }[];
  toc: readonly BlogTocLink[];
  related: readonly HomeGuide[];
  helpBox: GuideHelpBox;
  /** False for a general blog: no "Plan this trek" and help box beside it. */
  showSidebar: boolean;
  seo: HomeSeo;
  isHidden: boolean;
  canonicalPath?: string;
};
