import type { EmbedHeight } from "@ttn/config/embeds";
import type { IconName } from "@ttn/ui/icon";

import type { Photo } from "@/features/photos/types";
import type { TrekDifficulty } from "@/features/treks/types";
import type { RichTextDoc } from "@/lib/richText/richText";
import type { ArticleSectionTypeValue, ArticleStatusValue, ArticleTopicValue, MonthRating } from "@/lib/supabase/database.types";

export type ArticleTopic = ArticleTopicValue;

/** Draft (not on the website), published (live, or from its publish date) or hidden. */
export type ArticleStatus = ArticleStatusValue;

/** "As soon as I click Publish" or "On a date I choose". */
export type PublishMode = "now" | "date";

export type FactIcon = Extract<
  IconName,
  "wb_sunny" | "water_drop" | "altitude" | "wb_twilight" | "calendar_month" | "schedule" | "payments" | "hiking" | "landscape" | "route" | "groups" | "description"
>;

/** One of the key facts under the photo, e.g. "Best months: Oct–Nov, Mar–May". */
export type KeyFact = { icon: FactIcon; label: string; value: string };

/** The kinds of section built so far (the catalog lists the rest as coming soon). */
export type SectionType = ArticleSectionTypeValue;

export type FaqItem = { question: string; answer: RichTextDoc };

/** How busy the trail is in a month (the month table's "Crowds"); "" when not set. */
export type Crowds = "very-low" | "low" | "medium" | "busy" | "busiest";

/** One line of a cost table, e.g. "National park permit" · "$30". */
export type CostRow = { item: string; price: string };

/** One month (Jan–Dec) of the guide, shared by its "Month by month" sections. */
export type MonthEntry = { rating: MonthRating; onTheTrail: string; crowds: Crowds | "" };

/** One section of the article body. `id`: the saved section's id (null until saved). */
export type ArticleSection =
  | { id: string | null; type: "text"; heading: string; tocLabel: string; body: RichTextDoc }
  | { id: string | null; type: "paragraph"; body: RichTextDoc }
  | { id: string | null; type: "quick"; body: RichTextDoc }
  | { id: string | null; type: "callout"; tone: "note" | "warning"; body: RichTextDoc }
  | { id: string | null; type: "check"; heading: string; items: string[] }
  /** Every row has as many cells as `header` (kept, empty, while the header row is off; the same for the footer). */
  | { id: string | null; type: "table"; heading: string; hasHeader: boolean; hasFooter: boolean; hasRowHeadings: boolean; header: string[]; rows: string[][]; footer: string[] }
  /** Cleaned when saved (@ttn/ui/lib/customHtml). */
  | { id: string | null; type: "html"; html: string }
  | { id: string | null; type: "months"; heading: string; view: "strip" | "table" }
  | { id: string | null; type: "cta"; heading: string; buttonText: string; message: string }
  | { id: string | null; type: "quote"; text: string }
  | { id: string | null; type: "days"; trekId: string | null; dayIds: string[] }
  | { id: string | null; type: "altitude"; trekId: string | null; heading: string }
  | { id: string | null; type: "cost"; heading: string; rows: CostRow[]; totalLabel: string; total: string }
  | { id: string | null; type: "compare"; trekIds: string[] }
  | { id: string | null; type: "tip"; guideId: string | null; text: string }
  | { id: string | null; type: "gquote"; guideId: string | null; text: string }
  | { id: string | null; type: "meet"; heading: string; guideIds: string[] }
  | { id: string | null; type: "image"; photoId: string | null; caption: string; alt: string }
  | { id: string | null; type: "gallery"; photoIds: string[] }
  | { id: string | null; type: "map"; title: string; place: string }
  /** `code`: the pasted embed code or link (saved as the frame's address only, @ttn/config/embeds). */
  | { id: string | null; type: "embed"; code: string; height: EmbedHeight; title: string; caption: string }
  | { id: string | null; type: "video"; youtubeId: string; title: string }
  | { id: string | null; type: "trek"; trekId: string | null }
  | { id: string | null; type: "faq"; items: FaqItem[] };

/** Everything the travel guide form saves (one language for the text). The article body comes next. */
export type ArticleValues = {
  // Top of the page
  title: string;
  intro: string;
  cardText: string;
  coverAlt: string;
  /** The orange trek tag on the photo. */
  photoTrekId: string | null;
  /** The green tag on the photo, e.g. "Best: Oct–Nov & Mar–May". */
  highlightTag: string;
  /** Next to the read time, e.g. "Updated for the 2026 season". */
  updatedLine: string;
  facts: KeyFact[];
  // Publishing
  /** Null: the main site (traveltonepal.com). */
  siteRegionId: string | null;
  alsoOnMainSite: boolean;
  topic: ArticleTopic;
  slug: string;
  status: ArticleStatus;
  publishMode: PublishMode;
  /** "YYYY-MM-DD", a Nepal date: the chosen date, or the day it first went live. */
  publishedOn: string | null;
  // Travel guides page
  isFeatured: boolean;
  /** 1–6 in "Start here", or null. */
  startHerePosition: number | null;
  // People
  authorId: string | null;
  checkerGuideId: string | null;
  // Links
  mainTrekId: string | null;
  regionIds: string[];
  /** "Keep reading", in order (up to 3). */
  relatedIds: string[];
  /** The article body, top to bottom. */
  sections: ArticleSection[];
  /** Jan–Dec, filled in once and shown by every "Month by month" section. */
  months: MonthEntry[];
  // Google
  seoKeyword: string;
  seoTitle: string;
  seoDescription: string;
};

export type Article = ArticleValues & {
  id: string;
  cover: Photo | null;
  /** The photo of the guide's shared links (its 1200×630 share picture); null: the guide's photo. */
  sharePhoto: Photo | null;
  /** "YYYY-MM-DD": the last big update, if any. */
  updatedOn: string | null;
  updatedAt: string;
};

/** What the form's Save sends (checked by articleSchema). */
export type ArticleFormValues = ArticleValues & { coverPhotoId: string | null; sharePhotoId: string | null; isBigUpdate: boolean };

/** The choices the editor offers. */
export type ArticleOptions = {
  sites: { id: string; name: string; domain: string }[];
  regions: { id: string; name: string }[];
  treks: {
    id: string;
    name: string;
    days: number | null;
    difficulty: TrekDifficulty;
    maxAltitudeM: number | null;
    priceFromUsd: number | null;
    cover: Photo | null;
    regionId: string;
    /** The trek's day-by-day plan, for "Itinerary days". */
    itinerary: { id: string; number: number; title: string; duration: string; altitudeM: number | null }[];
  }[];
  /** Trekking guides, for the guide sections (only guides who agreed to be shown can be picked). */
  guides: { id: string; name: string; role: string; photo: Photo | null; regionIds: string[]; hasConsent: boolean }[];
  /** The photo library, for "Photo" and "Photo gallery" (newest first). */
  photos: Photo[];
  authors: { id: string; name: string; jobTitle: string; isVerified: boolean; isGuest: boolean; writesEnglish: boolean }[];
  /** Trekking guides who can check travel guides and agreed to be shown. */
  checkers: { id: string; name: string; role: string }[];
  /** Other travel guides, for "Keep reading". */
  articles: { id: string; title: string }[];
};
