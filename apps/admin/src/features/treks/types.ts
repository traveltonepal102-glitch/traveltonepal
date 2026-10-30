import type { TrekPageSection } from "@ttn/config/trekPageSections";
import type { IconName } from "@ttn/ui/icon";

import type { PhotoSelection } from "@/features/photos/hooks/usePhotoSelection";
import type { Photo, PhotoDetails } from "@/features/photos/types";
import type { RichTextDoc } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

export type TrekStatus = "draft" | "published" | "hidden";
export type TrekDifficulty = "easy" | "moderate" | "challenging" | "strenuous";
export type TrekSeason = "spring" | "autumn" | "winter" | "monsoon";
export type TrekTag = "classic" | "off-the-beaten-path";

/** A selling point printed on the main photo, e.g. "No flights needed" (the website's TrekPhotoBadge). */
export type PhotoBadge = { label: string; icon: IconName; tone: "brand" | "green" };

/** A titled point: a highlight ("Kyanjin Ri sunrise") or a checklist item ("Technical skill required"). */
export type TrekPoint = { title: string; text: string };

/** One day of the day-by-day plan (the website's ItineraryDay). */
/** A meal included on a day ("Meals included"). */
export type Meal = "breakfast" | "lunch" | "dinner";

export type ItineraryDay = {
  /** null for a day added in the editor; the database gives it an id on Save. */
  id: string | null;
  /** "Sleep at", e.g. "Teahouse, Lama Hotel"; also names the stop on the altitude chart and the route map. */
  place: string;
  /** The day's highest point, e.g. "Larkya La"; required when it is higher than where you sleep, else empty. */
  highPlace: string;
  title: string;
  /** One line under the title, e.g. "River gorge · Bamboo and rhododendron forest". */
  subtitle: string;
  /** Walking or driving time, e.g. "6–7 hrs"; empty on arrival and departure days. */
  duration: string;
  /** The day's highest point. */
  altitudeM: number | null;
  /** Where you sleep, only when lower than the highest point (a day hike up and back). */
  sleepAltitudeM: number | null;
  /** The trek's high point: highlighted on the trek page. One day at most. */
  isHighPoint: boolean;
  /** What happens on this day (rich text). */
  description: RichTextDoc;
  photo: Photo | null;
  meals: Meal[];
  /** On a trek across several regions: the region this day is in; null = the same as the day before. */
  regionId: string | null;
};

/** A day as the editor's Save sends it. */
export type ItineraryDayForm = Omit<ItineraryDay, "altitudeM" | "photo"> & { altitudeM: number; photoId: string | null };

/** Price per person for one group size (the website's GroupPrice). The trek is always private. */
export type GroupPrice = {
  /** null for a row added in the editor; the database gives it an id on Save. */
  id: string | null;
  /** e.g. "3–5 people" */
  label: string;
  /** Fits the trek page's narrow picker, e.g. "3–5 Pax". */
  shortLabel: string;
  priceUsd: number | null;
  /** Who comes with a group this size, e.g. "Lead guide + assistant + porters". */
  team: string;
  /** "Most popular": selected first on the trek page, and the trek's "From" price. */
  isDefault: boolean;
};

/** One card of the packing list, e.g. "Clothing and layering" (the website's PackingGroup). */
export type PackingGroup = { title: string; icon: PackingIcon; items: TrekPoint[] };

export type PackingIcon = Extract<IconName, "apparel" | "footprint" | "backpack" | "medical_services" | "water_drop" | "description">;

/** One topic of the trek's questions, e.g. "Altitude and health" (the website's FaqGroup). Answers are plain text. */
export type FaqTopic = { title: string; icon: FaqIcon; items: { question: string; answer: RichTextDoc }[] };

export type FaqIcon = Extract<
  IconName,
  | "info"
  | "calendar_month"
  | "nordic_walking"
  | "fitness_center"
  | "wb_twilight"
  | "description"
  | "payments"
  | "event"
  | "route"
  | "groups"
  | "cottage"
  | "restaurant"
  | "medical_services"
  | "backpack"
  | "temple_buddhist"
>;

/** A section written once for every trek page; a trek only chooses whether it shows. */
export type SharedSectionKey =
  | "founder"
  | "consultation"
  | "customization"
  | "meals"
  | "credentials"
  | "reviews"
  | "why_book"
  | "differentiators"
  | "booking_form"
  | "booking_cta"
  | "newsletter";

/** A YouTube video on the trek: only the video's id is saved, nothing is uploaded. */
export type TrekVideo = {
  /** From the YouTube link, e.g. "dQw4w9WgXcQ". */
  youtubeId: string;
  /** Shown on the trek page. */
  title: string;
  /** "Show in": the photo gallery, and/or offered for the trek guide topics. */
  inGallery: boolean;
  inGuide: boolean;
};

/** One topic of the trek guide ("Practical field knowledge"), e.g. "Best season and weather windows". */
export type KnowTopic = {
  icon: KnowIcon;
  title: string;
  /** Free text: paragraphs, lists, bold lead-ins ("Rooms: simple twin rooms…"), links and photos. */
  body: RichTextDoc;
  /** A smaller line after the text, e.g. about winter and the monsoon. */
  note: string;
  /** A photo from the trek's photos, or one of its videos (not both). */
  photoId: string | null;
  videoId: string | null;
};

export type KnowIcon = Extract<IconName, "wb_twilight" | "cottage" | "soup_kitchen" | "emergency" | "health_and_safety" | "route" | "description" | "payments" | "groups" | "backpack">;

/** Everything the trek editor saves (one language). */
export type TrekValues = {
  name: string;
  slug: string;
  /** The main region: the first on the route (breadcrumb, "Langtang local" guides). */
  regionId: string;
  /** The regions the route passes through after the main one, in order (e.g. Ganesh Himal, then Manaslu). */
  routeRegionIds: string[];
  status: TrekStatus;
  difficulty: TrekDifficulty;
  /** 1 (easiest) to 5. */
  grade: number;
  days: number | null;
  maxAltitudeM: number | null;
  distanceKm: number | null;
  seasons: TrekSeason[];
  tags: TrekTag[];
  isPopular: boolean;
  summary: string;
  cardBadge: string;
  photoBadges: PhotoBadge[];
  startFinish: string;
  dailyWalking: string;
  guideRatio: string;
  seasonLabel: string;
  accommodation: string;
  transport: string;
  introduction: RichTextDoc;
  /** Title of the highlights section, written for search. */
  highlightsHeading: string;
  highlights: TrekPoint[];
  /** "Is this trek for you?": one line of intro and an honest checklist. */
  suitabilityIntro: string;
  suitabilityPoints: TrekPoint[];
  /** The text above the day-by-day plan (rich text). */
  itineraryIntro: RichTextDoc;
  itinerary: ItineraryDay[];
  /** "What's covered" / "What's not included": the title is the bold lead-in, e.g. "Permits". */
  included: TrekPoint[];
  excluded: TrekPoint[];
  /** Meals aren't included: what food costs a day on the trail, in US dollars (both or neither). */
  mealBudgetMinUsd: number | null;
  mealBudgetMaxUsd: number | null;
  mealTrailTips: TrekPoint[];
  mealTeahouseNotes: TrekPoint[];
  groupPrices: GroupPrice[];
  /** What the Google map centres on, e.g. "Kyanjin Gompa, Langtang, Nepal". */
  mapPlace: string;
  /** From a Google My Maps share link: the map then draws the GPS trail. */
  myMapsId: string | null;
  /** One line above the packing cards, e.g. "Tested gear for the valley: −10 °C nights…". */
  packingIntro: string;
  packingGroups: PackingGroup[];
  /** "Frequently asked questions": topics in order, each with its questions. */
  faqs: FaqTopic[];
  /** The page's H1, written for search, e.g. "Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)". */
  headline: string;
  /** How people say it, for section titles, e.g. "Langtang Trek" → "Book the Langtang Trek with us". */
  shortName: string;
  /** What people search for, e.g. "langtang valley trek": the Google checks look for it. */
  seoKeyword: string;
  seoTitle: string;
  seoDescription: string;
  /** The photo of the trek's shared links (its 1200×630 share picture); null: the trek's first photo. */
  sharePhoto: Photo | null;
  /** Another page of the website ("/treks/…") as the main version of this one; "" = this page itself. */
  canonicalPath: string;
  /** "Hide from Google": noindex and not in the sitemap. */
  hideFromGoogle: boolean;
  /** Up to 4 treks to suggest at the bottom of the page, in order; the website fills empty places itself. */
  similarTrekIds: string[];
  /** Shared sections (written once in Site settings) this trek doesn't show. */
  hiddenSharedSections: SharedSectionKey[];
  /** Every section of the page with a heading, in this trek's order (full-width ones last). */
  sectionOrder: TrekPageSection[];
  /** "Meet your trek guide": one line about the guides, and the guides in page order. */
  guidesIntro: string;
  guideIds: string[];
  /** e.g. "2026/2027": "… season open" above the heading and "Verified route …" on the trip overview. */
  currentSeason: string;
  /** The tags above the heading: the trek style ("Classic valley trek") and the park (optional). */
  category: string;
  protectedArea: string;
  /** After the length in the line under the heading, e.g. "Kathmandu return" → "10 days (Kathmandu return)". */
  daysNote: string;
  /** Name of the highest point (its altitude comes from the days), e.g. "Kyanjin Ri". */
  highPoint: string;
  /** A higher side trip some trekkers add, e.g. Tserko Ri at 4,984 m (both or neither). */
  optionalHighPoint: string;
  optionalHighPointM: number | null;
  /** The 12th box of the trip overview, e.g. "Trekking / hiking". */
  activity: string;
  /** Section headings and the lines under them, as on the page. */
  suitabilityHeading: string;
  /** After the number of days, e.g. "day-by-day itinerary" → "10-day day-by-day itinerary". */
  itineraryHeading: string;
  /** Above the days, e.g. "Langtang Valley Trek route overview (Kathmandu – Syabrubesi – Kyanjin Gompa)". */
  routeLine: string;
  inclusionsHeading: string;
  guidesHeading: string;
  elevationHeading: string;
  /** Next to the altitude chart, e.g. "You sleep no higher than 3,870 m …". */
  elevationNote: string;
  routeMapHeading: string;
  trekStart: string;
  trekEnd: string;
  pricingHeading: string;
  pricingIntro: string;
  packingHeading: string;
  knowHeading: string;
  knowIntro: string;
  knowTopics: KnowTopic[];
  faqHeading: string;
  similarHeading: string;
  similarIntro: string;
  videos: TrekVideo[];
  /** The printable map (trek-files bucket), or null: "Download PDF map" shows only with one. */
  pdfMapPath: string | null;
};

export type TrekPhotos = PhotoSelection;

/** What the editor's Save sends (checked by trekSchema). */
export type TrekFormValues = Omit<TrekValues, "days" | "maxAltitudeM" | "itinerary" | "groupPrices" | "sharePhoto"> & {
  sharePhotoId: string | null;
  groupPrices: (Omit<GroupPrice, "priceUsd"> & { priceUsd: number })[];
  /** From the day-by-day plan when it has days; otherwise typed in Basics. */
  days: number;
  maxAltitudeM: number;
  itinerary: ItineraryDayForm[];
  photos: { coverPhotoId: string | null; galleryPhotoIds: string[]; details: PhotoDetails[] };
};

export type Trek = TrekValues & {
  id: string;
  regionName: string;
  /** The names of routeRegionIds, in route order. */
  routeRegionNames: string[];
  /** Until group prices are in the editor, the "From" price stored with the trek. */
  priceFromUsd: number | null;
  updatedAt: string;
  photos: TrekPhotos;
};

/** A trek to pick from another editor (similar treks, a region's featured and nearby treks). */
export type SimilarTrekOption = {
  id: string;
  name: string;
  days: number;
  difficulty: TrekDifficulty;
  regionId: string;
  regionName: string;
  /** The regions it passes through after its main region, in order. */
  routeRegionIds: string[];
  cover: Photo | null;
};

/** A region to pick in the trek editor. */
/** A region a trek can belong to, with its best months (Jan–Dec), which colour the trek page's start months. */
export type RegionOption = { id: string; name: string; monthRatings: MonthRating[] };

/** The editor's sections, in the order of the trek page (design: Admin-trek-editor). */
export type TrekSectionKey =
  | "top"
  | "photos"
  | "intro"
  | "facts"
  | "highlights"
  | "fit"
  | "itinerary"
  | "inclusions"
  | "guides"
  | "route"
  | "pricing"
  | "packing"
  | "know"
  | "faq"
  | "similar"
  | "seo"
  | "shared"
  | "order";
