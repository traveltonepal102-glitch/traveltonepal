import { TREK_PAGE_SECTIONS } from "@ttn/config/trekPageSections";
import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";
import type { RichTextDoc } from "@/lib/richText/richText";

import { readTrekForm, trekSchema } from "./trekSchema";

const doc = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
/** What RichTextEditor posts for a one-paragraph text. */
const json = (text: string) => JSON.stringify(doc(text));

const REGION = "00000000-0000-4000-8000-000000000001";

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = {
    name: "Langtang Valley Trek",
    slug: "langtang-valley",
    regionId: REGION,
    status: "draft",
    difficulty: "moderate",
    grade: "3",
    days: "10",
    maxAltitudeM: "4773",
    ...fields,
  };
  for (const [name, value] of Object.entries(base)) {
    for (const item of Array.isArray(value) ? value : [value]) form.append(name, item);
  }
  return form;
};

const parse = (fields?: Record<string, string | string[]>) => trekSchema.safeParse(readTrekForm(buildForm(fields)));

const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("trekSchema", () => {
  it("accepts a trek with the required basics only", () => {
    const result = parse();
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ days: 10, maxAltitudeM: 4773, distanceKm: null, isPopular: false, photoBadges: [], seasons: [] });
  });

  it("reads numbers the way people type them", () => {
    expect(parse({ maxAltitudeM: "4,773", distanceKm: " 75 " }).data).toMatchObject({ maxAltitudeM: 4773, distanceKm: 75 });
  });

  it("requires a name, a region, days and the highest altitude", () => {
    const errors = errorsOf({ name: "", regionId: "", days: "", maxAltitudeM: "" });
    expect(errors).toMatchObject({
      name: "Enter the trek name.",
      regionId: "Pick the region this trek is in.",
      days: "Enter the number of days.",
      maxAltitudeM: "Enter the highest altitude.",
    });
  });

  it("checks number ranges and whole numbers", () => {
    expect(errorsOf({ days: "0" }).days).toMatch(/between 1 and 60/);
    expect(errorsOf({ days: "7.5" }).days).toMatch(/whole number/);
    expect(errorsOf({ maxAltitudeM: "high" }).maxAltitudeM).toMatch(/as a number/);
    expect(errorsOf({ maxAltitudeM: "12000" }).maxAltitudeM).toMatch(/between 500 and 9,000/);
  });

  it("keeps the grade in line with the difficulty", () => {
    expect(parse({ difficulty: "easy", grade: "1" }).success).toBe(true);
    expect(errorsOf({ difficulty: "easy", grade: "4" }).grade).toBe("For Easy, the grade is 1 or 2.");
    expect(errorsOf({ difficulty: "strenuous", grade: "3" }).grade).toBe("For Strenuous, the grade is 5.");
  });

  it("only accepts known statuses, seasons and tags", () => {
    expect(errorsOf({ status: "live" })).toHaveProperty("status");
    expect(errorsOf({ seasons: ["summer"] })).toHaveProperty(["seasons.0"]);
    expect(parse({ seasons: ["spring", "spring", "autumn"], tags: ["classic"], isPopular: "on" }).data).toMatchObject({
      seasons: ["spring", "autumn"],
      tags: ["classic"],
      isPopular: true,
    });
  });

  it("reads highlights in order, skipping empty rows and flagging half-filled ones at their own row", () => {
    const result = parse({
      highlightTitle: ["Kyanjin Ri sunrise", "", "Tamang culture"],
      highlightText: ["The best viewpoint.", "", "Stone villages."],
    });
    expect(result.data?.highlights).toEqual([
      { title: "Kyanjin Ri sunrise", text: "The best viewpoint." },
      { title: "Tamang culture", text: "Stone villages." },
    ]);
    const errors = errorsOf({ highlightTitle: ["", "Yak cheese"], highlightText: ["", ""] });
    expect(errors["highlights.1.text"]).toBe("Write the text, or remove this point.");
    expect(errorsOf({ suitabilityTitle: [""], suitabilityText: ["Only text"] })["suitabilityPoints.0.title"]).toMatch(/Write the title/);
  });

  it("reads the introduction as rich text and the overview lines", () => {
    const introduction = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The closest big valley." }] }] };
    const result = parse({ introduction: JSON.stringify(introduction), highlightsHeading: " Langtang highlights ", suitabilityIntro: "An honest checklist." });
    expect(result.data).toMatchObject({ introduction, highlightsHeading: "Langtang highlights", suitabilityIntro: "An honest checklist." });
    expect(errorsOf({ highlightsHeading: "x".repeat(161) }).highlightsHeading).toBe("Use 160 characters or fewer.");
  });

  /** A day as the form sends it; `sleep`: its sleep altitude (the highest point only when the day goes higher). */
  const day = (title: string, sleep: string, extra: Record<string, string> = {}) => ({
    dayId: "",
    dayPlace: "",
    dayTitle: title,
    daySubtitle: "",
    dayDuration: "",
    dayTopAltitude: "",
    daySleepAltitude: sleep,
    dayMeals: "",
    dayHighPoint: "false",
    dayDescription: "",
    dayPhotoId: "",
    ...extra,
  });
  /** Several days as FormData fields (one value per day for each field). */
  const days = (...list: ReturnType<typeof day>[]) =>
    Object.fromEntries(Object.keys(list[0]).map((key) => [key, list.map((item) => item[key as keyof typeof item])]));

  it("reads the days in order, and takes the trek's length and highest point from them", () => {
    const result = parse({
      days: "3",
      maxAltitudeM: "9000",
      ...days(day("Arrive", "1,400"), day("Kyanjin Ri", "3870", { dayTopAltitude: "4773", dayHighPoint: "true", dayMeals: "dinner,breakfast" }), day("Back", "1400")),
    });
    expect(result.data).toMatchObject({ days: 3, maxAltitudeM: 4773 });
    expect(result.data?.itinerary[1]).toMatchObject({ id: null, title: "Kyanjin Ri", altitudeM: 4773, sleepAltitudeM: 3870, isHighPoint: true, photoId: null, meals: ["breakfast", "dinner"] });
    expect(result.data?.itinerary[0]).toMatchObject({ altitudeM: 1400, sleepAltitudeM: null, meals: [] });
  });

  it("doesn't need days in Basics once there is a plan", () => {
    expect(parse({ days: "", maxAltitudeM: "", ...days(day("Arrive", "1400")) }).data).toMatchObject({ days: 1, maxAltitudeM: 1400 });
  });

  it("checks each day: a title, where you sleep, a highest point only above it, and known meals", () => {
    const errors = errorsOf(days(day("Fine", "2000", { dayMeals: "snack" }), day("", ""), day("Hike", "3500", { dayTopAltitude: "3000" })));
    expect(errors).toMatchObject({
      "itinerary.1.title": "Write the day's title, or delete the day.",
      "itinerary.1.sleepAltitude": "Enter the sleep altitude.",
      "itinerary.2.topAltitude": "Only fill this in when the day goes higher than where you sleep.",
      "itinerary.0.meals.0": "Pick the meals from the list.",
    });
  });

  it("allows one highlight day only, and only real day ids", () => {
    const two = days(day("A", "2000", { dayHighPoint: "true" }), day("B", "3000", { dayHighPoint: "true" }));
    expect(errorsOf(two).itinerary).toBe("Only one day can be the highlight day.");
    expect(errorsOf(days(day("A", "2000", { dayId: "not-an-id" })))).toHaveProperty(["itinerary.0.id"]);
  });

  it("reads what's covered, what's not and the meal tips as separate lists", () => {
    const result = parse({
      includedTitle: ["Permits", "Teahouse lodging"],
      includedText: ["Langtang National Park permit.", "7 nights on the trek."],
      excludedTitle: ["Travel insurance"],
      excludedText: ["required, with helicopter rescue cover."],
      mealTipTitle: ["Stay hydrated"],
      mealTipText: ["drink 3–4 litres a day."],
      teahouseNoteTitle: ["Order early"],
      teahouseNoteText: ["order dinner around 5 pm."],
    });
    expect(result.data).toMatchObject({
      included: [{ title: "Permits" }, { title: "Teahouse lodging" }],
      excluded: [{ title: "Travel insurance" }],
      mealTrailTips: [{ title: "Stay hydrated" }],
      mealTeahouseNotes: [{ title: "Order early", text: "order dinner around 5 pm." }],
    });
    expect(errorsOf({ includedTitle: ["Permits"], includedText: [""] })["included.0.text"]).toBe("Write the text, or remove this point.");
  });

  it("takes the daily food budget as a range: both amounts, lowest first", () => {
    expect(parse({ mealBudgetMinUsd: "20", mealBudgetMaxUsd: "30" }).data).toMatchObject({ mealBudgetMinUsd: 20, mealBudgetMaxUsd: 30 });
    expect(parse().data).toMatchObject({ mealBudgetMinUsd: null, mealBudgetMaxUsd: null });
    expect(errorsOf({ mealBudgetMinUsd: "20" }).mealBudgetMaxUsd).toBe("Enter both amounts, or neither.");
    expect(errorsOf({ mealBudgetMinUsd: "40", mealBudgetMaxUsd: "30" }).mealBudgetMaxUsd).toBe("This can't be lower than the first amount.");
    expect(errorsOf({ mealBudgetMinUsd: "0", mealBudgetMaxUsd: "30" }).mealBudgetMinUsd).toMatch(/between 1 and 1,000/);
  });

  const prices = (...rows: [string, string, string, boolean][]) => ({
    priceId: rows.map(() => ""),
    priceLabel: rows.map(([label]) => label),
    priceShortLabel: rows.map(([, short]) => short),
    priceUsd: rows.map(([, , price]) => price),
    priceTeam: rows.map(() => ""),
    priceIsDefault: rows.map(([, , , isDefault]) => String(isDefault)),
  });

  it("reads group prices, with exactly one most popular row", () => {
    const result = parse(prices(["2 people", "2 Pax", "965", false], ["3–5 people", "3–5 Pax", "1,110", true]));
    expect(result.data?.groupPrices).toEqual([
      { id: null, label: "2 people", shortLabel: "2 Pax", priceUsd: 965, team: "", isDefault: false },
      { id: null, label: "3–5 people", shortLabel: "3–5 Pax", priceUsd: 1110, team: "", isDefault: true },
    ]);
    expect(errorsOf(prices(["2 people", "2 Pax", "965", false])).groupPrices).toBe("Choose the most popular group size.");
    expect(errorsOf(prices(["A", "A", "1", true], ["B", "B", "2", true])).groupPrices).toBe("Choose the most popular group size.");
    expect(parse().data?.groupPrices).toEqual([]);
  });

  it("checks each group price row", () => {
    const errors = errorsOf(prices(["", "", "free", true]));
    expect(errors).toMatchObject({
      "groupPrices.0.label": "Write the group size, e.g. 3–5 people.",
      "groupPrices.0.shortLabel": "Write a short label, e.g. 3–5 Pax.",
      "groupPrices.0.priceUsd": "Enter the price as a number.",
    });
  });

  it("reads photo badges in order and checks them", () => {
    const result = parse({ badgeLabel: ["No flights needed", "Local guide-led"], badgeIcon: ["route", "nordic_walking"], badgeTone: ["brand", "green"] });
    expect(result.data?.photoBadges).toEqual([
      { label: "No flights needed", icon: "route", tone: "brand" },
      { label: "Local guide-led", icon: "nordic_walking", tone: "green" },
    ]);
    expect(errorsOf({ badgeLabel: [""], badgeIcon: ["route"], badgeTone: ["brand"] })["photoBadges.0.label"]).toMatch(/Write the badge text/);
    expect(errorsOf({ badgeLabel: ["Hi"], badgeIcon: ["rocket"], badgeTone: ["brand"] })["photoBadges.0.icon"]).toBe("Pick an icon.");
    const four = ["a", "b", "c", "d"];
    expect(errorsOf({ badgeLabel: four, badgeIcon: four.map(() => "route"), badgeTone: four.map(() => "brand") }).photoBadges).toBe("Up to 3 badges.");
  });

  it("reads the map place, and takes only the id from a My Maps link", () => {
    const id = "1AbCdEfGhIjKlMnOpQrStUvWxYz";
    expect(parse({ mapPlace: " Kyanjin Gompa, Langtang, Nepal ", myMapsLink: "" }).data).toMatchObject({ mapPlace: "Kyanjin Gompa, Langtang, Nepal", myMapsId: null });
    expect(parse({ myMapsLink: `https://www.google.com/maps/d/viewer?mid=${id}&usp=sharing` }).data?.myMapsId).toBe(id);
    expect(parse({ myMapsLink: `www.google.com/maps/d/edit?mid=${id}` }).data?.myMapsId).toBe(id);
    expect(parse({ myMapsLink: id }).data?.myMapsId).toBe(id);
    expect(errorsOf({ myMapsLink: "https://maps.app.goo.gl/abc123" }).myMapsId).toMatch(/share link from Google My Maps/);
    expect(errorsOf({ myMapsLink: `https://evil.example/maps/d/viewer?mid=${id}` }).myMapsId).toMatch(/share link/);
    expect(errorsOf({ myMapsLink: "javascript:alert(1)" }).myMapsId).toMatch(/share link/);
  });

  it("reads packing cards with their own items, skipping empty cards", () => {
    const result = parse({
      packingIntro: "Tested gear for the valley.",
      packingGroupTitle: ["Clothing and layering", "", "Gear and packs"],
      packingGroupIcon: ["apparel", "backpack", "backpack"],
      packingItem0Title: ["Base layers"],
      packingItem0Text: ["2–3 merino tops."],
      packingItem2Title: ["Daypack", ""],
      packingItem2Text: ["25–35 L.", ""],
    });
    expect(result.data?.packingIntro).toBe("Tested gear for the valley.");
    expect(result.data?.packingGroups).toEqual([
      { title: "Clothing and layering", icon: "apparel", items: [{ title: "Base layers", text: "2–3 merino tops." }] },
      { title: "Gear and packs", icon: "backpack", items: [{ title: "Daypack", text: "25–35 L." }] },
    ]);
  });

  it("checks each packing card at its own number", () => {
    const errors = errorsOf({
      packingGroupTitle: ["Clothing", "", "Gear"],
      packingGroupIcon: ["apparel", "apparel", "rocket"],
      packingItem1Title: ["Socks"],
      packingItem1Text: ["4 pairs."],
      packingItem2Title: ["Daypack"],
      packingItem2Text: [""],
    });
    expect(errors["packingGroups.0.items"]).toMatch(/Add at least one item/);
    expect(errors["packingGroups.1.title"]).toMatch(/Write the card's title/);
    expect(errors["packingGroups.2.icon"]).toBe("Pick an icon.");
    expect(errors["packingGroups.2.items.0.text"]).toMatch(/Write the text/);
  });

  it("reads question topics with their own questions, skipping empty rows and topics", () => {
    const result = parse({
      faqTopicTitle: ["General information", "", "Altitude and health"],
      faqTopicIcon: ["calendar_month", "info", "medical_services"],
      faq0Question: ["How long is the trek?", ""],
      faq0Answer: [json("10 days from Kathmandu."), ""],
      faq2Question: ["What happens in an emergency?"],
      faq2Answer: [json("We arrange a helicopter with your insurer.")],
    });
    expect(result.data?.faqs).toEqual([
      { title: "General information", icon: "calendar_month", items: [{ question: "How long is the trek?", answer: doc("10 days from Kathmandu.") }] },
      { title: "Altitude and health", icon: "medical_services", items: [{ question: "What happens in an emergency?", answer: doc("We arrange a helicopter with your insurer.") }] },
    ]);
  });

  it("checks each topic and question at its own number", () => {
    const errors = errorsOf({
      faqTopicTitle: ["Permits", "", "Weather"],
      faqTopicIcon: ["description", "info", "rocket"],
      faq1Question: ["Do I need a permit?"],
      faq1Answer: [json("Yes.")],
      faq2Question: ["When is it cold?"],
      faq2Answer: [""],
    });
    expect(errors["faqs.0.items"]).toBe("Add a question, or remove this topic.");
    expect(errors["faqs.1.title"]).toBe("Write the topic's name, or remove this topic.");
    expect(errors["faqs.2.icon"]).toBe("Pick an icon.");
    expect(errors["faqs.2.items.0.answer"]).toBe("Write the answer, or remove this question.");
  });

  it("reads the Google text and the similar treks, once each and up to 4", () => {
    const other = "00000000-0000-4000-8000-000000000002";
    const third = "00000000-0000-4000-8000-000000000003";
    const result = parse({ seoTitle: " Langtang Valley Trek ", shortName: "Langtang Trek", similarTrekId: [other, third, other] });
    expect(result.data).toMatchObject({ seoTitle: "Langtang Valley Trek", shortName: "Langtang Trek", similarTrekIds: [other, third] });
    expect(errorsOf({ similarTrekId: ["not-a-trek"] })["similarTrekIds.0"]).toBe("Pick the similar treks from the list.");
    const five = [1, 2, 3, 4, 5].map((n) => `00000000-0000-4000-8000-00000000001${n}`);
    expect(errorsOf({ similarTrekId: five }).similarTrekIds).toBe("Pick up to 4 similar treks.");
    expect(errorsOf({ seoTitle: "x".repeat(71) }).seoTitle).toMatch(/70 characters or fewer/);
  });

  it("stores the shared sections a trek hides, from the switches that are on", () => {
    const allShown = ["founder", "consultation", "customization", "meals", "credentials", "reviews", "why_book", "differentiators", "booking_form", "booking_cta", "newsletter"];
    expect(parse({ sharedSectionShown: allShown }).data?.hiddenSharedSections).toEqual([]);
    const someOff = allShown.filter((key) => key !== "newsletter" && key !== "founder");
    expect(parse({ sharedSectionShown: someOff }).data?.hiddenSharedSections).toEqual(["founder", "newsletter"]);
    expect(parse().data?.hiddenSharedSections).toHaveLength(11);
    expect(parse({ sharedSectionShown: ["founder", "pop_up"] }).success).toBe(false);
  });

  it("reads the guides in page order, once each and up to 10, with the line about them", () => {
    const first = "00000000-0000-4000-8000-000000000021";
    const second = "00000000-0000-4000-8000-000000000022";
    expect(parse({ guidesIntro: " Local guides. ", guideId: [second, first, second] }).data).toMatchObject({ guidesIntro: "Local guides.", guideIds: [second, first] });
    expect(errorsOf({ guideId: ["pemba"] })["guideIds.0"]).toBe("Pick the guides from the list.");
    const eleven = Array.from({ length: 11 }, (_, index) => `00000000-0000-4000-8000-0000000001${String(index).padStart(2, "0")}`);
    expect(errorsOf({ guideId: eleven }).guideIds).toBe("Pick up to 10 guides.");
  });

  it("needs a side trip's name and altitude together", () => {
    expect(parse({ optionalHighPoint: "Tserko Ri", optionalHighPointM: "4,984" }).data).toMatchObject({ optionalHighPoint: "Tserko Ri", optionalHighPointM: 4984 });
    expect(errorsOf({ optionalHighPoint: "Tserko Ri" }).optionalHighPointM).toBe("Enter both the side trip's name and its altitude, or neither.");
    expect(errorsOf({ optionalHighPointM: "4984" }).optionalHighPoint).toBe("Enter both the side trip's name and its altitude, or neither.");
  });

  it("only takes a PDF map uploaded through the editor", () => {
    const path = "pdf-maps/0b8f9a52-6f43-4d2a-9d9e-3c1f2b7a8e10.pdf";
    expect(parse({ pdfMapPath: path }).data?.pdfMapPath).toBe(path);
    expect(parse({ pdfMapPath: "" }).data?.pdfMapPath).toBeNull();
    expect(errorsOf({ pdfMapPath: "../photos/secret.pdf" }).pdfMapPath).toBe("Upload the PDF map again.");
  });

  it("reads videos as YouTube ids, with where each one shows", () => {
    const videos = { videoId: ["https://youtu.be/dQw4w9WgXcQ"], videoTitle: [" Kyanjin at sunrise "], videoInGallery: ["true"], videoInGuide: ["false"] };
    expect(parse(videos).data?.videos).toEqual([{ youtubeId: "dQw4w9WgXcQ", title: "Kyanjin at sunrise", inGallery: true, inGuide: false }]);
    expect(errorsOf({ ...videos, videoId: ["https://vimeo.com/1"] })["videos.0.youtubeId"]).toMatch(/Paste a YouTube video link/);
    expect(errorsOf({ ...videos, videoTitle: [""] })["videos.0.title"]).toBe("Write the title shown on the trek page.");
    const twice = { videoId: ["dQw4w9WgXcQ", "dQw4w9WgXcQ"], videoTitle: ["A", "B"], videoInGallery: ["true", "true"], videoInGuide: ["false", "false"] };
    expect(errorsOf(twice).videos).toBe("A video is in the list twice.");
  });

  it("reads know-before-you-go topics with their text and photo or video", () => {
    const photo = "00000000-0000-4000-8000-000000000031";
    const result = parse({
      knowIcon: ["cottage", "emergency", "route"],
      knowTitle: ["Teahouses", "", "Getting there"],
      knowBody: [json("Twin beds, shared toilets."), "", json("7 hours by jeep to Syabrubesi.")],
      knowNote: ["Book Kyanjin early in October.", "", ""],
      knowMedia: [`photo:${photo}`, "", "video:dQw4w9WgXcQ"],
    });
    expect(result.data?.knowTopics).toEqual([
      { icon: "cottage", title: "Teahouses", body: doc("Twin beds, shared toilets."), note: "Book Kyanjin early in October.", photoId: photo, videoId: null },
      { icon: "route", title: "Getting there", body: doc("7 hours by jeep to Syabrubesi."), note: "", photoId: null, videoId: "dQw4w9WgXcQ" },
    ]);
  });

  it("keeps a topic's long text in several paragraphs and lists", () => {
    const body: RichTextDoc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "First paragraph. ".repeat(40) }] },
        { type: "paragraph", content: [{ type: "text", text: "Second paragraph. ".repeat(40) }] },
        { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Rescue:", marks: [{ type: "bold" }] }, { type: "text", text: " by helicopter." }] }] }] },
      ],
    };
    const result = parse({ knowIcon: ["emergency"], knowTitle: ["Emergencies"], knowBody: [JSON.stringify(body)], knowNote: [""], knowMedia: [""] });
    expect(result.data?.knowTopics[0].body).toEqual(body);
    const tooLong = json("x".repeat(3001));
    expect(errorsOf({ knowIcon: ["emergency"], knowTitle: ["Emergencies"], knowBody: [tooLong], knowNote: [""], knowMedia: [""] })["knowTopics.0.body"]).toBeDefined();
  });

  it("checks each know-before-you-go topic at its own number", () => {
    const errors = errorsOf({
      knowIcon: ["cottage", "rocket", "route"],
      knowTitle: ["Teahouses", "Altitude", ""],
      knowBody: ["", json("300 m a day above 3,000 m."), ""],
      knowNote: ["", "", "A note without a heading."],
      knowMedia: ["", "photo:not-an-id", ""],
    });
    expect(errors["knowTopics.0.body"]).toBe("Write the topic's text, or remove this topic.");
    expect(errors["knowTopics.1.icon"]).toBe("Pick an icon.");
    expect(errors["knowTopics.1.media"]).toBe("Pick the photo or video again.");
    expect(errors["knowTopics.2.title"]).toBe("Write the topic's heading, or remove this topic.");
  });
});

describe("trekSchema route regions", () => {
  const GANESH = "00000000-0000-4000-8000-000000000002";
  const MANASLU = "00000000-0000-4000-8000-000000000003";

  it("keeps the regions after the main one in route order, each once, without the main region", () => {
    expect(parse({ routeRegionId: [GANESH, MANASLU, GANESH, REGION] }).data?.routeRegionIds).toEqual([GANESH, MANASLU]);
    expect(parse().data?.routeRegionIds).toEqual([]);
  });

  it("refuses an unknown region and more than four after the main one", () => {
    expect(errorsOf({ routeRegionId: ["not-a-region"] })["routeRegionIds.0"]).toBe("Pick the regions from the list.");
    const five = [1, 2, 3, 4, 5].map((n) => `00000000-0000-4000-8000-00000000001${n}`);
    expect(errorsOf({ routeRegionId: five }).routeRegionIds).toBe("A route can pass through up to 4 more regions.");
  });
});

describe("trekSchema section order", () => {
  it("gives the usual order when none is sent", () => {
    expect(parse().data?.sectionOrder.slice(0, 3)).toEqual(["intro", "overview", "founder"]);
  });

  it("keeps the order sent", () => {
    const sent = ["reviews", ...TREK_PAGE_SECTIONS.filter((section) => section !== "reviews")];
    expect(parse({ sectionOrder: sent }).data?.sectionOrder).toEqual(sent);
  });

  it("puts a section left out back in its usual place", () => {
    const sent = TREK_PAGE_SECTIONS.filter((section) => section !== "why_book");
    expect(parse({ sectionOrder: sent }).data?.sectionOrder).toEqual(TREK_PAGE_SECTIONS);
  });

  it("refuses a section the page doesn't have", () => {
    expect(parse({ sectionOrder: ["intro", "sidebar"] }).success).toBe(false);
  });
});
