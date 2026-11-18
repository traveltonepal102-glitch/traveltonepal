import type { SiteCurrency } from "@ttn/config/siteLanguage";
import type { SiteImageSource } from "@ttn/site-data/images";
import type { PageDates } from "@ttn/site-data/pageDates";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { TrailIconName } from "@/components/ui/TrailIcon";

/** The top of the home page, typed in the admin's Pages › Home. */
export type HomeTop = {
  eyebrow: string;
  heading: string;
  intro: string;
  photo?: SiteImageSource;
  buttonLabel: string;
  /** "" for no second button. */
  secondLabel: string;
};

export type HomePoint = { title: string; text: string };

export type HomeFact = { icon: TrailIconName; label: string; value: string };

export type HomeDay = {
  number: number;
  title: string;
  subtitle: string;
  duration?: string;
  altitudeM: number;
  /** The name of the point altitudeM measures (topPlaceOf), for the altitude chart. */
  topPlace: string;
  /** Where the night is spent ("" when the trek editor left it blank), and at what altitude (the day's own when not set). */
  place: string;
  nightAltitudeM: number;
  isHighPoint: boolean;
  body: RichTextDoc;
  /** The day's photo from the trek editor, beside its text. */
  photo?: SiteImageSource;
};

/** A group's price per person, in the website's currency. */
export type HomeGroupPrice = { label: string; shortLabel: string; price: number; currency: SiteCurrency; team: string; isDefault: boolean };

export type HomeFaq = { question: string; body: RichTextDoc; answer: string };

/** A topic of the trek's questions (the trek editor's FAQ groups). */
export type HomeFaqGroup = { title: string; icon: TrailIconName; items: HomeFaq[] };

export type HomePackingGroup = { title: string; items: HomePoint[] };

/** The main trek's sections this design has, in the order the trek editor set. */
export type HomeSectionKey =
  | "intro"
  | "founder"
  | "consultation"
  | "highlights"
  | "suitability"
  | "itinerary"
  | "guides"
  | "inclusions"
  | "route_map"
  | "why_book"
  | "pricing"
  | "credentials"
  | "reviews"
  | "booking_form"
  | "packing"
  | "field_guide"
  | "faq"
  | "booking_cta";

export type HomeTrekGuide = {
  id: string;
  name: string;
  role: string;
  home: string;
  experience: string;
  badge: string;
  certBadge: string;
  quote: string;
  certifications: string;
  languages: string[];
  photo?: SiteImageSource;
};

export type HomeFieldTopic = { title: string; icon: TrailIconName; body: RichTextDoc; note?: string; photo?: SiteImageSource };

/** The website's main trek, shown in full on the home page. */
export type HomeTrek = {
  slug: string;
  name: string;
  shortName: string;
  days: number;
  difficulty: string;
  place: string;
  photos: SiteImageSource[];
  facts: HomeFact[];
  sections: HomeSectionKey[];
  pdfMapUrl?: string;
  intro: { heading: string; body: RichTextDoc };
  highlights: { heading: string; points: HomePoint[] };
  suitability: { heading: string; intro: string; points: HomePoint[] };
  itinerary: { heading: string; intro: RichTextDoc; days: HomeDay[]; showsCustomization: boolean };
  pricing: { heading: string; intro: string; prices: HomeGroupPrice[] };
  guides: { heading: string; intro: string; team: HomeTrekGuide[] };
  inclusions: { heading: string; included: HomePoint[]; excluded: HomePoint[] };
  /** Left out when the trek hides it or says nothing about meals. */
  meals: { budget: { min: number; max: number; currency: SiteCurrency } | null; trailTips: HomePoint[]; teahouseNotes: HomePoint[] } | null;
  /** `line`: the rich text under the heading (links to other pages), empty when there is none; the same for months and packing. */
  routeMap: { heading: string; line: RichTextDoc; embedUrl: string; openUrl: string; hasTrailLine: boolean; pdfUrl?: string; gpxUrl?: string } | null;
  months: { heading: string; line: RichTextDoc; ratings: MonthRating[] } | null;
  packing: { heading: string; line: RichTextDoc; groups: HomePackingGroup[] };
  fieldGuide: { heading: string; intro: string; topics: HomeFieldTopic[] };
  /** `items`: every question, in order (the FAQPage structured data); `groups`: the same under their topics, for the tabs. */
  faq: { heading: string; items: HomeFaq[]; groups: HomeFaqGroup[] };
};

export type HomeTrekCard = {
  slug: string;
  name: string;
  summary: string;
  region: string;
  days: number | null;
  difficulty: string;
  maxAltitudeM: number | null;
  season: string;
  /** The "From" price in `currency`, the website's. */
  priceFrom: number | null;
  currency: SiteCurrency;
  image?: SiteImageSource;
  hasPage: boolean;
  /** Where its page is: the main trek's is the home page. */
  href: string;
};

export type HomeReview = { id: string; source: "google" | "tripadvisor"; name: string; when: string; rating: number; text: string; url: string; photo?: SiteImageSource };

export type HomeRating = { rating: number; count: number; profileUrl: string };

export type HomeGuide = { slug: string; title: string; text: string; topic: string; tag: string; meta: string; image?: SiteImageSource; isFeatured: boolean; regionSlugs: readonly string[] };

/** What the trek sections say about the company, from Pages › About. */
export type HomeCompany = {
  storyTeaser: string;
  founder: { name: string; role: string; photo?: SiteImageSource } | null;
  /** "Why book your trek with us": the heading and the line under it, blank = the page's own words. */
  promisesHeading: string;
  promisesIntro: string;
  promises: HomePoint[];
};

export type HomeAdventure = { id: string; title: string; summary: string; photo: SiteImageSource };

/** The admin's Adventures screen: the section's words and its cards. */
export type HomeAdventures = { eyebrow: string; heading: string; intro: string; askTitle: string; askText: string; cards: HomeAdventure[] };

export type HomeSeo = { title: string; description: string; shareImageBase?: string; isLive: boolean; dates: PageDates | undefined };

export type HomeData = {
  top: HomeTop;
  trek: HomeTrek | null;
  /** The main trek's card, for the comparison table. */
  trekCard: HomeTrekCard | null;
  otherTreks: HomeTrekCard[];
  reviews: HomeReview[];
  rating: HomeRating | null;
  guides: HomeGuide[];
  /** Every published guide, the featured one first, then the newest: a trek page picks its own from them. */
  allGuides: HomeGuide[];
  /** The newest ten, for the menu. */
  latestGuides: HomeGuide[];
  company: HomeCompany;
  adventures: HomeAdventures;
  seo: HomeSeo;
};
