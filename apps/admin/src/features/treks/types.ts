import type { IconName } from "@ttn/ui/icon";

import type { PhotoSelection } from "@/features/photos/hooks/usePhotoSelection";
import type { Photo, PhotoDetails } from "@/features/photos/types";
import type { RichTextDoc } from "@/lib/richText/richText";

export type TrekStatus = "draft" | "published" | "hidden";
export type TrekDifficulty = "easy" | "moderate" | "challenging" | "strenuous";
export type TrekSeason = "spring" | "autumn" | "winter" | "monsoon";
export type TrekTag = "classic" | "off-the-beaten-path";

/** A selling point printed on the main photo, e.g. "No flights needed" (the website's TrekPhotoBadge). */
export type PhotoBadge = { label: string; icon: IconName; tone: "brand" | "green" };

/** A titled point: a highlight ("Kyanjin Ri sunrise") or a checklist item ("Technical skill required"). */
export type TrekPoint = { title: string; text: string };

/** One day of the day-by-day plan (the website's ItineraryDay). */
export type ItineraryDay = {
  /** null for a day added in the editor; the database gives it an id on Save. */
  id: string | null;
  /** Short name under the altitude chart, e.g. "Lama Hotel". */
  place: string;
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
  description: string;
  photo: Photo | null;
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

/** A fixed start date (the website's Departure). */
export type Departure = {
  id: string | null;
  /** "YYYY-MM-DD" */
  startDate: string;
  /** Runs whatever the group size. */
  isGuaranteed: boolean;
  /** e.g. "4 places left" */
  note: string;
};

/** One card of the packing list, e.g. "Clothing and layering" (the website's PackingGroup). */
export type PackingGroup = { title: string; icon: PackingIcon; items: TrekPoint[] };

export type PackingIcon = Extract<IconName, "apparel" | "footprint" | "backpack" | "medical_services" | "water_drop" | "description">;

/** One topic of the trek's questions, e.g. "Altitude and health" (the website's FaqGroup). Answers are plain text. */
export type FaqTopic = { title: string; icon: FaqIcon; items: { question: string; answer: string }[] };

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
  | "credentials"
  | "reviews"
  | "why_book"
  | "differentiators"
  | "booking_form"
  | "newsletter";

/** Everything the trek editor saves (one language). */
export type TrekValues = {
  name: string;
  slug: string;
  regionId: string;
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
  /** The paragraph above the day-by-day plan. */
  itineraryIntro: string;
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
  /** With fixed dates the trek page shows a date picker; without, "Your dates, your pace". */
  hasFixedDates: boolean;
  departures: Departure[];
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
  /** Up to 4 treks to suggest at the bottom of the page, in order; the website fills empty places itself. */
  similarTrekIds: string[];
  /** Shared sections (written once in Site settings) this trek doesn't show. */
  hiddenSharedSections: SharedSectionKey[];
};

export type TrekPhotos = PhotoSelection;

/** What the editor's Save sends (checked by trekSchema). */
export type TrekFormValues = Omit<TrekValues, "days" | "maxAltitudeM" | "itinerary" | "groupPrices"> & {
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
  /** Until group prices are in the editor, the "From" price stored with the trek. */
  priceFromUsd: number | null;
  updatedAt: string;
  photos: TrekPhotos;
};

/** Another trek to pick as a similar trek. */
export type SimilarTrekOption = { id: string; name: string; days: number; difficulty: TrekDifficulty; regionName: string; cover: Photo | null };

/** A region to pick in the trek editor. */
export type RegionOption = { id: string; name: string };

export type TrekSectionKey =
  | "basics"
  | "photos"
  | "overview"
  | "itinerary"
  | "prices"
  | "included"
  | "guides"
  | "practical"
  | "faq"
  | "seo"
  | "shared";
