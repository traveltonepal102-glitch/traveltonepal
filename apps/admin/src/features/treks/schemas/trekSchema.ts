import { TREK_PAGE_SECTIONS, orderTrekSections } from "@ttn/config/trekPageSections";
import { z } from "zod";

import { optionalPhotoId } from "@/features/photos/schemas/optionalPhotoId";
import { photoSelectionSchema, readPhotoSelection } from "@/features/photos/schemas/photoSelectionSchema";
import { optionalWholeNumber, readList, readText, readTexts, requiredText, slugField, text } from "@/lib/forms/formFields";
import { richTextField } from "@/lib/richText/richText";
import { canonicalPathField } from "@/lib/seo/canonicalPath";

import {
  BADGE_ICON_VALUES,
  MAX_HIGHLIGHTS,
  MAX_INCLUDED_ITEMS,
  MAX_MEAL_TIPS,
  MAX_PHOTO_BADGES,
  MAX_ROUTE_REGIONS,
  MAX_SIMILAR_TREKS,
  MAX_TREK_GUIDES,
  SHARED_SECTION_KEYS,
  MAX_SUITABILITY_POINTS,
  TREK_LIMITS as LIMIT,
  difficultyOf,
} from "../constants";
import type { TrekFormValues } from "../types";
import { faqsSchema, readFaqs } from "./faqSchema";
import { knowTopicsSchema, readKnowTopics } from "./knowSchema";
import { readVideos, videosSchema } from "./videosSchema";
import { itinerarySchema, readItinerary } from "./itinerarySchema";
import { pointsSchema, readPoints } from "./pointsSchema";
import { myMapsIdSchema, packingGroupsSchema, readPackingGroups } from "./practicalSchema";
import { groupPricesSchema, readGroupPrices } from "./pricesSchema";

const unique = <T>(items: T[]) => [...new Set(items)];

const photoBadgeSchema = z.object({
  label: requiredText(LIMIT.badgeLabel, "Write the badge text, or remove the badge."),
  icon: z.enum(BADGE_ICON_VALUES, "Pick an icon."),
  tone: z.enum(["brand", "green"]),
});

/** The trek editor's form (read with readTrekForm). Checked again on the server before saving. */
export const trekSchema = z
  .object({
    name: requiredText(LIMIT.name, "Enter the trek name."),
    slug: slugField("langtang-valley"),
    regionId: z.uuid("Pick the region this trek is in."),
    routeRegionIds: z
      .array(z.uuid("Pick the regions from the list."))
      .transform(unique)
      .refine((ids) => ids.length <= MAX_ROUTE_REGIONS, `A route can pass through up to ${MAX_ROUTE_REGIONS} more regions.`),
    status: z.enum(["draft", "published", "hidden"]),
    difficulty: z.enum(["easy", "moderate", "challenging", "strenuous"]),
    grade: z.string().transform(Number).pipe(z.number().int().min(1).max(5)),
    days: optionalWholeNumber({ min: 1, max: 60, label: "number of days" }),
    maxAltitudeM: optionalWholeNumber({ min: 500, max: 9000, label: "highest altitude" }),
    distanceKm: optionalWholeNumber({ min: 1, max: 2000, label: "distance" }),
    seasons: z.array(z.enum(["spring", "autumn", "winter", "monsoon"])).transform(unique),
    tags: z.array(z.enum(["classic", "off-the-beaten-path"])).transform(unique),
    isPopular: z.string().transform((value) => value === "on"),
    summary: text(LIMIT.summary),
    cardBadge: text(LIMIT.cardBadge),
    photoBadges: z.array(photoBadgeSchema).max(MAX_PHOTO_BADGES, `Up to ${MAX_PHOTO_BADGES} badges.`),
    startFinish: text(LIMIT.fact),
    dailyWalking: text(LIMIT.fact),
    guideRatio: text(LIMIT.fact),
    seasonLabel: text(LIMIT.fact),
    accommodation: text(LIMIT.fact),
    transport: text(LIMIT.fact),
    introduction: richTextField(LIMIT.introduction),
    highlightsHeading: text(LIMIT.highlightsHeading),
    highlights: pointsSchema(MAX_HIGHLIGHTS),
    suitabilityIntro: text(LIMIT.suitabilityIntro),
    suitabilityPoints: pointsSchema(MAX_SUITABILITY_POINTS),
    itineraryIntro: richTextField(LIMIT.itineraryIntro),
    itinerary: itinerarySchema,
    included: pointsSchema(MAX_INCLUDED_ITEMS),
    excluded: pointsSchema(MAX_INCLUDED_ITEMS),
    mealBudgetMinUsd: optionalWholeNumber({ min: 1, max: 1000, label: "lowest daily food cost" }),
    mealBudgetMaxUsd: optionalWholeNumber({ min: 1, max: 1000, label: "highest daily food cost" }),
    mealTrailTips: pointsSchema(MAX_MEAL_TIPS),
    mealTeahouseNotes: pointsSchema(MAX_MEAL_TIPS),
    groupPrices: groupPricesSchema,
    mapPlace: text(LIMIT.mapPlace),
    myMapsId: myMapsIdSchema,
    packingIntro: text(LIMIT.packingIntro),
    packingGroups: packingGroupsSchema,
    faqs: faqsSchema,
    headline: text(LIMIT.headline),
    shortName: text(LIMIT.shortName),
    seoKeyword: text(LIMIT.seoKeyword),
    seoTitle: text(LIMIT.seoTitle),
    seoDescription: text(LIMIT.seoDescription),
    sharePhotoId: optionalPhotoId,
    canonicalPath: canonicalPathField,
    similarTrekIds: z
      .array(z.uuid("Pick the similar treks from the list."))
      .transform(unique)
      .refine((ids) => ids.length <= MAX_SIMILAR_TREKS, `Pick up to ${MAX_SIMILAR_TREKS} similar treks.`),
    guidesIntro: text(LIMIT.guidesIntro),
    currentSeason: text(LIMIT.currentSeason),
    category: text(LIMIT.category),
    protectedArea: text(LIMIT.protectedArea),
    daysNote: text(LIMIT.daysNote),
    highPoint: text(LIMIT.highPoint),
    optionalHighPoint: text(LIMIT.highPoint),
    optionalHighPointM: optionalWholeNumber({ min: 500, max: 9000, label: "side trip's altitude" }),
    activity: text(LIMIT.activity),
    suitabilityHeading: text(LIMIT.heading),
    itineraryHeading: text(LIMIT.heading),
    routeLine: text(LIMIT.routeLine),
    inclusionsHeading: text(LIMIT.heading),
    guidesHeading: text(LIMIT.heading),
    elevationHeading: text(LIMIT.heading),
    elevationNote: text(LIMIT.elevationNote),
    routeMapHeading: text(LIMIT.heading),
    trekStart: text(LIMIT.place),
    trekEnd: text(LIMIT.place),
    pricingHeading: text(LIMIT.heading),
    pricingIntro: text(LIMIT.pricingIntro),
    packingHeading: text(LIMIT.heading),
    knowHeading: text(LIMIT.heading),
    knowIntro: text(LIMIT.knowIntro),
    knowTopics: knowTopicsSchema,
    faqHeading: text(LIMIT.heading),
    similarHeading: text(LIMIT.heading),
    similarIntro: text(LIMIT.similarIntro),
    videos: videosSchema,
    pdfMapPath: z
      .string()
      .transform((value) => value || null)
      .pipe(z.string().regex(/^pdf-maps\/[0-9a-f-]{36}\.pdf$/, "Upload the PDF map again.").nullable()),
    guideIds: z
      .array(z.uuid("Pick the guides from the list."))
      .transform(unique)
      .refine((ids) => ids.length <= MAX_TREK_GUIDES, `Pick up to ${MAX_TREK_GUIDES} guides.`),
    // The switches send the sections that show; the trek stores the ones it hides.
    sharedSectionsShown: z.array(z.enum(SHARED_SECTION_KEYS)).transform(unique),
    // Made whole: a section left out goes back to its default place.
    sectionOrder: z.array(z.enum(TREK_PAGE_SECTIONS)).transform(orderTrekSections),
    photos: photoSelectionSchema("trek"),
  })
  .superRefine((values, context) => {
    // Without a day-by-day plan, the trip facts must give the length and the highest point.
    if (!values.itinerary.length) {
      if (values.days === null) context.addIssue({ code: "custom", path: ["days"], message: "Enter the number of days." });
      if (values.maxAltitudeM === null) context.addIssue({ code: "custom", path: ["maxAltitudeM"], message: "Enter the highest altitude." });
    }
    // A side trip needs both its name and its altitude.
    if (Boolean(values.optionalHighPoint) !== (values.optionalHighPointM !== null)) {
      const missing = values.optionalHighPoint ? "optionalHighPointM" : "optionalHighPoint";
      context.addIssue({ code: "custom", path: [missing], message: "Enter both the side trip's name and its altitude, or neither." });
    }
    // The food budget is a range: both numbers or neither, the lower one first.
    const { mealBudgetMinUsd: low, mealBudgetMaxUsd: high } = values;
    if ((low === null) !== (high === null)) {
      const missing = low === null ? "mealBudgetMinUsd" : "mealBudgetMaxUsd";
      context.addIssue({ code: "custom", path: [missing], message: "Enter both amounts, or neither." });
    } else if (low !== null && high !== null && low > high) {
      context.addIssue({ code: "custom", path: ["mealBudgetMaxUsd"], message: "This can't be lower than the first amount." });
    }
    // Easy is grade 1 or 2; the other levels have one grade each (as on the website).
    const { grades, label } = difficultyOf(values.difficulty);
    if (grades.includes(values.grade)) return;
    context.addIssue({ code: "custom", path: ["grade"], message: `For ${label}, the grade is ${grades.join(" or ")}.` });
  })
  // With a plan, its length and highest point win, so the cards, the facts and the days never disagree.
  .transform(({ days, maxAltitudeM, sharedSectionsShown, ...values }) => ({
    ...values,
    // The main region is already first on the route.
    routeRegionIds: values.routeRegionIds.filter((id) => id !== values.regionId),
    // A day keeps its region only while the trek crosses several and that one is on the route.
    itinerary: values.itinerary.map((day) => ({
      ...day,
      regionId: day.regionId && values.routeRegionIds.some((id) => id !== values.regionId) && [values.regionId, ...values.routeRegionIds].includes(day.regionId) ? day.regionId : null,
    })),
    hiddenSharedSections: SHARED_SECTION_KEYS.filter((key) => !sharedSectionsShown.includes(key)),
    days: values.itinerary.length || (days ?? 0),
    maxAltitudeM: values.itinerary.length ? Math.max(...values.itinerary.map((day) => day.altitudeM)) : (maxAltitudeM ?? 0),
  })) satisfies z.ZodType<TrekFormValues, unknown>;

/** The editor's FormData as the schema expects it. */
export const readTrekForm = (formData: FormData) => {
  const badgeLabels = readList(formData, "badgeLabel");
  const badgeIcons = readList(formData, "badgeIcon");
  const badgeTones = readList(formData, "badgeTone");

  return {
    name: readText(formData, "name"),
    slug: readText(formData, "slug"),
    regionId: readText(formData, "regionId"),
    routeRegionIds: readList(formData, "routeRegionId"),
    status: readText(formData, "status"),
    difficulty: readText(formData, "difficulty"),
    grade: readText(formData, "grade"),
    days: readText(formData, "days"),
    maxAltitudeM: readText(formData, "maxAltitudeM"),
    distanceKm: readText(formData, "distanceKm"),
    seasons: readList(formData, "seasons"),
    tags: readList(formData, "tags"),
    isPopular: readText(formData, "isPopular"),
    summary: readText(formData, "summary"),
    cardBadge: readText(formData, "cardBadge"),
    photoBadges: badgeLabels.map((label, index) => ({ label, icon: badgeIcons[index] ?? "", tone: badgeTones[index] ?? "brand" })),
    startFinish: readText(formData, "startFinish"),
    dailyWalking: readText(formData, "dailyWalking"),
    guideRatio: readText(formData, "guideRatio"),
    seasonLabel: readText(formData, "seasonLabel"),
    accommodation: readText(formData, "accommodation"),
    transport: readText(formData, "transport"),
    introduction: readText(formData, "introduction"),
    highlightsHeading: readText(formData, "highlightsHeading"),
    highlights: readPoints(formData, "highlight"),
    suitabilityIntro: readText(formData, "suitabilityIntro"),
    suitabilityPoints: readPoints(formData, "suitability"),
    itineraryIntro: readText(formData, "itineraryIntro"),
    itinerary: readItinerary(formData),
    included: readPoints(formData, "included"),
    excluded: readPoints(formData, "excluded"),
    mealBudgetMinUsd: readText(formData, "mealBudgetMinUsd"),
    mealBudgetMaxUsd: readText(formData, "mealBudgetMaxUsd"),
    mealTrailTips: readPoints(formData, "mealTip"),
    mealTeahouseNotes: readPoints(formData, "teahouseNote"),
    groupPrices: readGroupPrices(formData),
    mapPlace: readText(formData, "mapPlace"),
    myMapsId: readText(formData, "myMapsLink"),
    packingIntro: readText(formData, "packingIntro"),
    packingGroups: readPackingGroups(formData),
    faqs: readFaqs(formData),
    headline: readText(formData, "headline"),
    shortName: readText(formData, "shortName"),
    seoKeyword: readText(formData, "seoKeyword"),
    seoTitle: readText(formData, "seoTitle"),
    seoDescription: readText(formData, "seoDescription"),
    sharePhotoId: readText(formData, "sharePhotoId"),
    canonicalPath: readText(formData, "canonicalPath"),
    similarTrekIds: readList(formData, "similarTrekId"),
    sharedSectionsShown: readList(formData, "sharedSectionShown"),
    sectionOrder: readList(formData, "sectionOrder"),
    guidesIntro: readText(formData, "guidesIntro"),
    ...readTexts(formData, [
      "currentSeason",
      "category",
      "protectedArea",
      "daysNote",
      "highPoint",
      "optionalHighPoint",
      "optionalHighPointM",
      "activity",
      "suitabilityHeading",
      "itineraryHeading",
      "routeLine",
      "inclusionsHeading",
      "guidesHeading",
      "elevationHeading",
      "elevationNote",
      "routeMapHeading",
      "trekStart",
      "trekEnd",
      "pricingHeading",
      "pricingIntro",
      "packingHeading",
      "knowHeading",
      "knowIntro",
      "faqHeading",
      "similarHeading",
      "similarIntro",
      "pdfMapPath",
    ]),
    knowTopics: readKnowTopics(formData),
    videos: readVideos(formData),
    guideIds: readList(formData, "guideId"),
    photos: readPhotoSelection(formData),
  };
};
