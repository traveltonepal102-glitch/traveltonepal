import type { TrekPageSection } from "@ttn/config/trekPageSections";
import type { RichTextDoc, RichTextImage } from "@ttn/ui/lib/richText";

import type { PageSeo } from "@/features/seo/shareMetadata";
import type { IconName } from "@ttn/ui/icon";

import type { IconTone } from "@/components/shared/iconTones";
import type { MonthRating, RegionDifficulty } from "@/features/regions/overviews";
import type { TrekGuide } from "@/features/team/types";
import type { TrekSummary } from "@/features/treks/types";
import type { SiteImageSource } from "@/lib/images";

export type TrekPhoto = SiteImageSource & {
  /** Shown on the photo with its altitude, e.g. "Kyanjin Gompa · 3,870 m / 12,697 ft". */
  place?: string;
  altitudeM?: number;
};

/** The page sections shared by every trek (the admin's "Sections shared by every trek"); a trek can hide any of them. */
export type SharedSection =
  | "founder"
  | "consultation"
  | "customization"
  | "meals"
  | "why_book"
  | "credentials"
  | "reviews"
  | "differentiators"
  | "booking_form"
  | "booking_cta"
  | "newsletter";

/** Short selling point printed on the main photo, e.g. "No flights needed". */
export type TrekPhotoBadge = { label: string; icon: IconName; tone: "brand" | "green" };

/** Price per person for one group size; the trek is always private, so it falls as the group grows. */
export type GroupPrice = {
  label: string;
  /** Fits the narrow picker button, e.g. "3–5 Pax". */
  shortLabel: string;
  priceUsd: number;
  /** Who comes with a group this size, e.g. "Lead guide + assistant + porters". */
  team: string;
  /** Selected when the page opens and marked "Popular" (the size most groups book). */
  isDefault?: boolean;
};

export type { IconTone } from "@/components/shared/iconTones";
/** A card with an icon tile, a title and one or two lines ("What makes this trip different"). */
export type FeatureItem = { icon: IconName; tone: IconTone; title: string; text: string };

/** A titled point: a highlight ("Kyanjin Ri sunrise (4,773 m)") or a checklist item ("Technical skill required"). */
export type TrekPoint = {
  title: string;
  text: string;
};

export type ItineraryDay = {
  /** Short place name for the elevation chart, e.g. "Lama Hotel". */
  place: string;
  /** Photos added in the day's description, shown under its text. */
  textPhotos?: readonly RichTextImage[];
  title: string;
  /** One line under the title, e.g. "River gorge · Bamboo and rhododendron forest". */
  subtitle: string;
  /** Walking or driving time, e.g. "6–7 hrs" or "7–8 hrs drive"; left out on arrival and departure days. */
  duration?: string;
  /** Highest point reached that day. */
  altitudeM: number;
  /** Where you sleep, when lower than the day's high point (a day hike up and back). */
  sleepAltitudeM?: number;
  /** The trek's high point: the day card is highlighted. */
  isHighPoint?: boolean;
  text: string;
  photo?: SiteImageSource;
  /** On a trek across several regions: the region this day is in (when the admin set the days' regions). */
  regionSlug?: string;
};

/** A region on the route of a trek across several regions ("Regions on this route"), from its own card. */
export type TrekRouteStop = {
  slug: string;
  name: string;
  /** Where it sits on the route: the first region, the last one, or one in between. */
  place: "start" | "through" | "end";
  tagline?: string;
  image?: SiteImageSource;
  maxAltitudeM?: number;
  difficulty?: RegionDifficulty;
  permits: string;
  /** Its best months, Jan–Dec. */
  months?: readonly MonthRating[];
  /** Its page, else the treks in it. */
  href: string;
  /** e.g. "Days 1–5" (when the admin set the days' regions). */
  days?: string;
};

/** Pin colors on the route sketch: start, overnight stop, high point, optional side trip. */
export type RoutePinKind = "start" | "stop" | "summit" | "option";

/** A place on the route sketch, in the sketch's 1000×560 coordinates. */
export type RoutePin = {
  name: string;
  altitudeM: number;
  x: number;
  y: number;
  kind: RoutePinKind;
  /** Where the route map prints the name; "below" unless that would cover the trail. */
  labelSide?: "below" | "left";
};

/** Place names printed on the route map, styled by what they name. */
export type MapLabel = { text: string; x: number; y: number; kind: "park" | "peak" | "water" | "road" };

/** Hand-drawn overview of the route (SVG paths in a 1000×560 box), shown above the itinerary. */
export type RouteSketch = {
  /** Read by screen readers, e.g. "Sketch map of the route from Syabrubesi to Kyanjin Ri". */
  description: string;
  caption: string;
  groundPath: string;
  peaksPath: string;
  riverPath: string;
  routePath: string;
  /** Dashed: a day hike off the main route, e.g. up Kyanjin Ri. */
  sideHikePath?: string;
  pins: readonly RoutePin[];
  /** Place names printed on the sketch (not every pin has room for one). */
  labels: readonly { text: string; x: number; y: number }[];
  /** Route map only: the road in from Kathmandu, an optional side path (dashed grey) and area names. */
  approachPath?: string;
  optionPath?: string;
  mapLabels?: readonly MapLabel[];
};

/**
 * The Google map. Content never holds a raw URL: the embed and "open" links are built from these.
 * Add a Google My Maps id to show the GPS trail line; without one the map centres on `place`.
 */
export type TrekRouteMap = {
  /** e.g. "Kyanjin Gompa, Langtang, Nepal". */
  place: string;
  /** Id from a My Maps share link (…/maps/d/viewer?mid=THIS_PART). */
  myMapsId?: string;
};

/** "Why don't we include meals": the food budget and the trek's practical tips. */
export type TrekMeals = {
  /** Left out until the trek has one. */
  dailyBudgetUsd?: { min: number; max: number };
  trailTips: readonly TrekPoint[];
  teahouseNotes: readonly TrekPoint[];
};

/** One card of the packing list, e.g. "Clothing and layering". */
export type PackingGroup = { title: string; icon: IconName; items: readonly TrekPoint[] };

/** One topic of the field guide, e.g. "Best season and weather windows". */
export type FieldGuideTopic = {
  title: string;
  icon: IconName;
  /** The text as written in the admin (paragraphs, lists, bold lead-ins), without its photos. */
  body: RichTextDoc;
  /** Photos added in the text, shown under it. */
  textPhotos: readonly RichTextImage[];
  /** Smaller italic line after the text, e.g. a word on winter and the monsoon. */
  note?: string;
  /** Shown beside the text (the admin's photo for the topic). */
  photo?: SiteImageSource;
};

export type FaqGroup = {
  title: string;
  icon: IconName;
  /** `photos`: added in the answer in the admin, shown under it. */
  items: readonly { question: string; answer: string; photos: readonly RichTextImage[] }[];
};

/** Everything the trek page shows beyond the summary the cards already use (trekPageRows, from the database). */
export type TrekDetailContent = {
  slug: string;
  /** The page's H1, written for search, e.g. "Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)". */
  headline: string;
  /** How people say it, for section titles, e.g. "Langtang Trek" → "Book the Langtang Trek with us". */
  shortName: string;
  seo: PageSeo;
  /** First tag above the title, e.g. "Classic valley trek". */
  category: string;
  protectedArea?: string;
  /** Season the route and prices were checked for, e.g. "2026/2027". */
  currentSeason: string;
  /** After the length, e.g. "Kathmandu return" → "10 days (Kathmandu return)". */
  daysNote: string;
  /** Difficulty grade from 1 (easiest) to 5. */
  grade: 1 | 2 | 3 | 4 | 5;
  /** Name of the highest point on the standard route (its altitude is the summary's maxAltitudeM). */
  highPoint: string;
  /** Higher side trip some trekkers add, e.g. Tserko Ri. */
  optionalHighPoint?: { name: string; altitudeM: number };
  /** Introduction paragraphs; the first is shown until "Read more". */
  intro: readonly string[];
  /** Photos added in the introduction, shown under it. */
  introPhotos: readonly RichTextImage[];
  /** Gallery photos; the first is the main photo and the page's share image. */
  photos: readonly TrekPhoto[];
  photoBadges: readonly TrekPhotoBadge[];
  /** Title of the highlights section, written for search, e.g. "Langtang Trek highlights and why you will love this trek". */
  highlightsHeading: string;
  highlights: readonly TrekPoint[];
  /** "Is this trek for you?": one line of intro and an honest checklist (fitness, altitude, skill...). */
  suitability: { intro: string; points: readonly TrekPoint[] };
  /** Day-by-day plan: one entry per day of the trek. */
  itinerary: { intro: string; days: readonly ItineraryDay[] };
  /** "Regions on this route", in route order; empty for a trek in one region (the section is left out). */
  routeStops: readonly TrekRouteStop[];
  routeSketch?: RouteSketch;
  /** "Custom itinerary and private changes": the pitch and the typical changes people ask for. */
  customization: { pitch: string; options: readonly { label: string; icon: IconName }[] };
  /** "Meet your trek guide": one line about the guides, and the guides who lead this trek. */
  guides: { intro: string; team: readonly TrekGuide[] };
  /** "What's covered · What's not included": title is the bold lead-in, e.g. "Permits". */
  inclusions: { included: readonly TrekPoint[]; excluded: readonly TrekPoint[] };
  meals: TrekMeals;
  /** "What makes this trip different": one line of intro and the cards. */
  differentiators: { intro: string; items: readonly FeatureItem[] };
  /** Where trekking starts, for the elevation summary, e.g. Syabrubesi at 1,503 m. */
  trailhead: { name: string; altitudeM: number };
  routeMap: TrekRouteMap;
  /** "Gear and essentials": one line about the conditions and the packing cards. */
  packing: { intro: string; groups: readonly PackingGroup[] };
  /** "Practical field knowledge": an SEO title (best season, facilities, safety) and the topics. */
  fieldGuide: { heading: string; topics: readonly FieldGuideTopic[] };
  faqs: readonly FaqGroup[];
  startFinish: string;
  /** Left out of the overview until it is known. */
  distanceKm?: number;
  dailyWalking: string;
  guideRatio: string;
  accommodation: string;
  transport: string;
  groupPrices: readonly GroupPrice[];
  /** The region's best months, Jan–Dec: they colour the start months (null when unknown). */
  monthRatings: readonly MonthRating[] | null;
  /** "Explore more of the Himalaya": the admin's picks in order, else four treks like this one. */
  similarTreks: readonly TrekSummary[];
  /** Shared sections this trek leaves out. */
  hiddenSections: readonly SharedSection[];
  /** Every section with a heading, in the trek's own order (full-width ones last). */
  sectionOrder: readonly TrekPageSection[];
};

export type TrekDetail = TrekSummary & TrekDetailContent;
