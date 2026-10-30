import { describe, expect, it } from "vitest";

import { toTrekGuides } from "./trekGuideRows";
import { LANGTANG_GUIDES, PHOTOS_BASE, langtangSource } from "./trekPage.testData";
import { toTrekDetail } from "./trekPageRows";

const detail = (page: Parameters<typeof langtangSource>[0] = {}) => toTrekDetail(langtangSource(page), PHOTOS_BASE);
const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

describe("toTrekDetail", () => {
  it("maps the Langtang page from its database rows", () => {
    const trek = detail();
    expect(trek).toMatchObject({
      slug: "langtang-valley",
      name: "Langtang Valley Trek",
      headline: "Langtang Valley Trek 10 Days (Itinerary, Cost, Complete Guide)",
      shortName: "Langtang Trek",
      grade: 3,
      highPoint: "Kyanjin Ri",
      optionalHighPoint: { name: "Tserko Ri", altitudeM: 4984 },
      trailhead: { name: "Syabrubesi", altitudeM: 1503 },
      routeMap: { place: "Kyanjin Gompa, Langtang, Nepal" },
      distanceKm: 75,
      meals: { dailyBudgetUsd: { min: 20, max: 30 } },
    });
    expect(trek.intro.content).toHaveLength(2);
    expect(trek.itinerary.days).toHaveLength(trek.days);
    expect(trek.itinerary.days.filter((day) => day.isHighPoint).map((day) => day.place)).toEqual(["Kyanjin Ri"]);
    expect(trek.itinerary.days[5]).toMatchObject({ altitudeM: 4773, sleepAltitudeM: 3870, duration: "5–7 hrs" });
    expect(trek.itinerary.days[9].duration).toBeUndefined();
    expect(trek.groupPrices.filter((price) => price.isDefault)).toEqual([expect.objectContaining({ shortLabel: "3–5 Pax", priceUsd: 890 })]);
    expect(trek.faqs.flatMap((group) => group.items)).toHaveLength(10);
    expect(trek.routeSketch?.pins[0].name).toBe("Syabrubesi");
  });

  it("shows the cover first, then the gallery in the admin's order with its places", () => {
    const photos = detail().photos;
    expect(photos.map((photo) => photo.src)).toEqual([`${PHOTOS_BASE}/cover`, `${PHOTOS_BASE}/p1`, `${PHOTOS_BASE}/p2`]);
    expect(photos[1].place).toBe("Kyanjin Gompa");
  });

  it("takes the region's 12 month ratings for the start months, or none", () => {
    expect(detail().monthRatings).toHaveLength(12);
    expect(detail().monthRatings?.[9]).toBe("best");
    expect(detail({ region_month_ratings: null }).monthRatings).toBeNull();
    expect(detail({ region_month_ratings: ["best", "sometimes"] }).monthRatings).toBeNull();
  });

  it("uses the admin's similar treks, else the treks most like this one", () => {
    expect(detail({ similar_slugs: ["poon-hill", "no-such-trek", "langtang-valley"] }).similarTreks.map((trek) => trek.slug)).toEqual(["poon-hill"]);
    const fallback = detail().similarTreks.map((trek) => trek.slug);
    expect(fallback).toHaveLength(4);
    expect(fallback).not.toContain("langtang-valley");
  });

  it("keeps only known shared sections as hidden", () => {
    expect(detail({ hidden_shared_sections: ["reviews", "not-a-section", "founder"] }).hiddenSections).toEqual(["founder", "reviews"]);
  });

  it("falls back when texts are blank, and leaves out what isn't known", () => {
    const trek = detail({
      headline: " ",
      short_name: "",
      seo_title: "",
      highlights_heading: "",
      guides_intro: "",
      know_heading: "",
      map_place: "",
      distance_km: null,
      meal_budget_min_usd: null,
      optional_high_point_m: null,
    });
    expect(trek.headline).toBe("Langtang Valley Trek");
    expect(trek.shortName).toBe("Langtang Valley Trek");
    expect(trek.seo.title).toBe("Langtang Valley Trek: itinerary, cost and local guides");
    expect(trek.highlightsHeading).toBe("Langtang Valley Trek highlights");
    expect(trek.guides.intro).toContain("Langtang");
    expect(trek.routeMap.place).toBe("Langtang Valley Trek, Nepal");
    expect(trek.distanceKm).toBeUndefined();
    expect(trek.meals.dailyBudgetUsd).toBeUndefined();
    expect(trek.optionalHighPoint).toBeUndefined();
  });

  it("shows a field guide topic's photo, and drops a note's own leading asterisk (the page adds one)", () => {
    const photo = { cover_id: "k1", cover_width: 800, cover_height: 600, cover_variant_widths: [400, 800], cover_placeholder: "", cover_place: "Manang" };
    const know_topics = [
      { title: "Best season", icon: "wb_twilight", body: doc("Autumn: clear skies."), note: "**Snow can close the pass.", photo },
      { title: "Teahouses", icon: "cottage", body: doc("Simple rooms."), note: "", photo: null },
    ];
    const [season, teahouses] = detail({ know_topics }).fieldGuide.topics;
    expect(season).toMatchObject({ note: "Snow can close the pass.", photo: { src: `${PHOTOS_BASE}/k1`, alt: "Manang, Best season, Langtang Valley Trek" } });
    expect(teahouses.photo).toBeUndefined();
    expect(teahouses).not.toHaveProperty("note");
  });

  it("keeps a field guide topic's text as written, its photos where they were put, and drops a topic without text", () => {
    const image = { type: "image", attrs: { photoId: "00000000-0000-4000-8000-000000000041", alt: "Kyanjin", width: 800, height: 600, variantWidths: [400, 800] } };
    const list = { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Rescue", marks: [{ type: "bold" }] }] }] }, { type: "listItem", content: [image] }] };
    const body = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Two paragraphs." }] }, image, list] };
    const know_topics = [
      { title: "Emergencies", icon: "emergency", body, note: "", photo: null },
      { title: "Empty", icon: "cottage", body: { type: "doc", content: [{ type: "paragraph" }] }, note: "", photo: null },
      { title: "Old points", icon: "cottage", points: [{ title: "Rooms", text: "Simple." }], note: "", photo: null },
    ];
    const topics = detail({ know_topics }).fieldGuide.topics;
    expect(topics.map((topic) => topic.title)).toEqual(["Emergencies"]);
    expect(topics[0].body).toEqual(body);
  });

  it("keeps a day's text as written (lists, bold, italic), its photos where they were put", () => {
    const image = { type: "image", attrs: { photoId: "00000000-0000-4000-8000-000000000042", alt: "Larkya La", width: 800, height: 600, variantWidths: [400, 800] } };
    const intro = { type: "paragraph", content: [{ type: "text", text: "The day includes:", marks: [{ type: "italic" }] }] };
    const list = { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Larkya La (5,106 m)", marks: [{ type: "bold" }] }] }] }] };
    const [firstDay] = langtangSource().page.days as Record<string, unknown>[];
    const days = [{ ...firstDay, description: { type: "doc", content: [intro, image, list] } }];
    const [day] = detail({ days }).itinerary.days;
    expect(day?.body.content).toEqual([intro, image, list]);
  });

  it("skips broken list items instead of emptying the section", () => {
    const highlights = [{ title: "Kyanjin Ri sunrise", text: "Early start." }, { title: "", text: "No title" }, "not a point"];
    const faqs = [{ title: "General", icon: "nope", items: [{ question: "Why?", answer: { type: "doc", content: [] } }, { question: "How?", answer: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Slowly." }] }] } }] }];
    const trek = detail({ highlights, faqs, days: "not a list" });
    expect(trek.highlights).toEqual([{ title: "Kyanjin Ri sunrise", text: "Early start." }]);
    expect(trek.faqs).toEqual([{ title: "General", icon: "info", items: [{ question: "How?", answer: "Slowly.", body: faqs[0].items[1].answer }] }]);
    expect(trek.itinerary.days).toEqual([]);
  });

  it("keeps the photos added in a text where they were put, and the text's words for Google", () => {
    const photo = { type: "image", attrs: { photoId: "0b8a2c4e-1f3d-4a5b-9c6d-7e8f9a0b1c2d", alt: "Kyanjin Gompa at dawn", width: 1600, height: 1067, variantWidths: [400, 800, 1600] } };
    const introduction = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "A short valley trek." }] }, photo] };
    const faqs = [{ title: "General", icon: "info", items: [{ question: "Is it hard?", answer: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "No." }] }, photo] } }] }];
    const trek = detail({ introduction, faqs });
    expect(trek.intro).toEqual(introduction);
    expect(trek.faqs[0]?.items[0]).toEqual({ question: "Is it hard?", answer: "No.", body: faqs[0].items[0].answer });
  });
});

describe("toTrekGuides", () => {
  const guide = (overrides: Partial<(typeof LANGTANG_GUIDES)[number]>) => [{ ...LANGTANG_GUIDES[0], ...overrides }];

  it("makes a guide card with the region's badge and the qualifications valid today", () => {
    expect(toTrekGuides(LANGTANG_GUIDES, "Langtang", PHOTOS_BASE)).toEqual([
      {
        id: "g1",
        name: "Pasang Tamang",
        role: "Senior trek leader",
        home: "Briddim, Rasuwa",
        experience: "16+ yrs guiding",
        specialty: { label: "Langtang local", icon: "mountain_flag" },
        certBadge: "WFR certified",
        quote: "In Langtang I know every teahouse family.",
        certifications: "Wilderness first responder, trekking guide training (NATHM)",
        languages: ["English", "Nepali", "Tamang"],
        photo: undefined,
      },
    ]);
  });

  it("falls back for the badge, the qualifications and the home, and skips a guide without a name", () => {
    const [card] = toTrekGuides(guide({ has_wfr: false, other_certificates: [], home_village: "", home_district: " ", badge: "photo", years_guiding: null }), "Everest", PHOTOS_BASE);
    expect(card).toMatchObject({ certBadge: "Local guide", certifications: "Local trekking guide", home: "Everest", experience: "", specialty: { label: "Photography" } });
    expect(toTrekGuides(guide({ name: " " }), "Langtang", PHOTOS_BASE)).toEqual([]);
  });

  it("names the licence first when it is valid", () => {
    const [card] = toTrekGuides(guide({ is_licensed: true, has_wfr: false, has_first_aid: true, other_certificates: [] }), "Langtang", PHOTOS_BASE);
    expect(card).toMatchObject({ certBadge: "First aid", certifications: "Trekking guide licence, first aid" });
  });
});

describe("toTrekDetail for a trek across several regions", () => {
  const route = [{ slug: "langtang", name: "Langtang" }, { slug: "manaslu", name: "Manaslu" }];
  const manaslu = { slug: "manaslu", name: "Manaslu", maxAltitudeM: 5106, hasPage: false, district: "Gorkha", location: { lat: 28.5, lon: 84.6 }, trekLength: "", difficulty: "Challenging" as const, access: { short: "", long: "", isFlight: false }, permits: "MCAP, RAP", bestFor: "", bestForTags: [], summary: "", months: Array.from({ length: 12 }, () => "possible" as const) };

  it("lists the regions on the route with their days, and each day's region", () => {
    const base = langtangSource();
    const days = (base.page.days as Record<string, unknown>[]).map((day, index, all) => ({ ...day, region_slug: index === all.length - 2 ? "manaslu" : null }));
    const trek = toTrekDetail(langtangSource({ days }, { summary: { ...base.summary, route }, regions: [manaslu] }), PHOTOS_BASE);
    const count = trek.itinerary.days.length;
    expect(trek.routeStops.map((stop) => [stop.slug, stop.place, stop.days])).toEqual([
      ["langtang", "start", `Days 1–${count - 2}`],
      ["manaslu", "end", `Days ${count - 1}–${count}`],
    ]);
    expect(trek.routeStops[1]).toMatchObject({ permits: "MCAP, RAP", href: "/treks?region=manaslu" });
    expect(trek.itinerary.days.map((day) => day.regionSlug).slice(-3)).toEqual(["langtang", "manaslu", "manaslu"]);
  });

  it("has no route section for a trek in one region", () => {
    expect(toTrekDetail(langtangSource(), PHOTOS_BASE).routeStops).toEqual([]);
  });
});
