import { describe, expect, it } from "vitest";

import type { GuideSummary } from "@/features/guides/types";
import type { RegionCard } from "@/features/regions/regionRows";
import { TREKS } from "@/features/treks/treks";
import type { CoverColumns, WebRegionGuideRow, WebRegionPageRow } from "@/lib/supabase/database.types";

import { toRegionDetail } from "./regionPageRows";
import type { RegionPageSource } from "./regionPageRows";
import { seasonRating } from "./seasons";
import { regionJsonLd } from "./seo";

const BASE = "https://photos.example.com";
const NO_PHOTO: CoverColumns = { cover_id: null, cover_width: null, cover_height: null, cover_variant_widths: null, cover_placeholder: null, cover_place: null };
const photo = (id: string, place = ""): CoverColumns => ({ ...NO_PHOTO, cover_id: id, cover_variant_widths: [400, 800], cover_place: place });
const doc = (text: string, href?: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text, ...(href ? { marks: [{ type: "link", attrs: { href } }] } : {}) }] }],
});

/** Langtang's months: Mar–May and Oct–Nov best, the monsoon not ideal. */
const MONTHS = ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"] as const;

const card = (slug: string, lat: number, lon: number, overrides: Partial<RegionCard> = {}): RegionCard => ({
  slug,
  name: slug,
  maxAltitudeM: 5000,
  hasPage: false,
  district: "Rasuwa",
  location: { lat, lon },
  trekLength: "7–12 days",
  difficulty: "Moderate",
  access: { short: "Drive", long: "Drive to Syabrubesi (7–8 hrs)", isFlight: false },
  permits: "Langtang NP + TIMS",
  bestFor: "",
  bestForTags: [],
  summary: "The closest big-mountain valley to Kathmandu.",
  months: [...MONTHS],
  ...overrides,
});

const LANGTANG = card("langtang", 28.21, 85.56, { name: "Langtang", hasPage: true });
const REGIONS = [
  LANGTANG,
  card("tamang-heritage-trail", 28.18, 85.25),
  card("manaslu", 28.55, 84.58),
  card("annapurna", 28.62, 83.9),
  card("everest", 27.98, 86.85),
  card("kanchenjunga", 27.7, 87.95),
];

const page = (overrides: Partial<WebRegionPageRow> = {}): WebRegionPageRow => ({
  id: "r1",
  slug: "langtang",
  locale: "en",
  seo_title: "",
  seo_description: "",
  share_id: null,
  share_variant_widths: null,
  share_place: null,
  hero_highlight: " No flights needed ",
  overview_heading: "",
  introduction: doc("The valley next door to Kathmandu."),
  why_points: [],
  from_kathmandu: "",
  nearest_airport: "Kathmandu (KTM)",
  permits_details: "",
  where_you_sleep: "  ",
  season_spring: "Rhododendrons in bloom.",
  season_monsoon: "",
  season_autumn: "Clear skies.",
  season_winter: "",
  faqs: [],
  featured_trek_slug: null,
  featured_trek_label: "",
  featured_trek_pitch: "",
  custom_route_pitch: "",
  nearby_treks: [],
  compare_slugs: [],
  travel_guide_slugs: [],
  ...overrides,
});

const guide = (id: string, overrides: Partial<WebRegionGuideRow> = {}): WebRegionGuideRow => ({
  ...NO_PHOTO,
  region_slug: "langtang",
  locale: "en",
  id,
  name: `Guide ${id}`,
  role: "Trek leader",
  quote: "",
  years_guiding: null,
  languages: [],
  badge: "local",
  is_licensed: false,
  ...overrides,
});

const travelGuide = (slug: string): GuideSummary => ({ slug, title: slug, excerpt: "", tag: "Planning", tagIcon: "description", image: { src: "/x.jpg", alt: "" } });

const detail = (source: Partial<RegionPageSource> = {}) =>
  toRegionDetail({ card: LANGTANG, page: page(), photos: [], guides: [], treks: TREKS, travelGuides: [], regions: REGIONS, ...source }, BASE);

describe("toRegionDetail", () => {
  it("joins the region's card and page, with fallbacks for what isn't written yet", () => {
    const region = detail();
    expect(region).toMatchObject({ name: "Langtang", district: "Rasuwa", heroHighlight: "No flights needed", bestMonthsLabel: "Mar–May, Oct–Nov" });
    expect(region.seo).toEqual({
      title: "Langtang trekking region: treks, best time and local guides",
      description: "The closest big-mountain valley to Kathmandu.",
    });
    expect(region.overview.heading).toBe("Trekking in Langtang");
    expect(region.overview.introduction).toEqual(doc("The valley next door to Kathmandu."));
    expect(region.customRoutePitch).toMatch(/We plan it around your days/);
  });

  it("lists the 'Where it is' lines that are filled in, the permits and the drive from the facts otherwise", () => {
    expect(detail().gettingThere.map((line) => [line.label, line.value])).toEqual([
      ["From Kathmandu", "Drive to Syabrubesi (7–8 hrs)"],
      ["Nearest airport", "Kathmandu (KTM)"],
      ["Permits", "Langtang NP + TIMS"],
    ]);
  });

  it("reads the 'why trek here' cards and the questions item by item, leaving out broken ones", () => {
    const region = detail({
      page: page({
        why_points: [
          { icon: "landscape", title: "Big mountains, fast", text: "Lirung after 4 days." },
          { icon: "rocket", title: "Unknown icon", text: "" },
          { icon: "groups", title: "  ", text: "No title" },
          "not a card",
        ],
        faqs: [
          { question: "Where is Langtang?", answer: doc("North of Kathmandu.") },
          { question: "Empty answer?", answer: doc("   ") },
          { question: "Unsafe link?", answer: doc("Click", "javascript:alert(1)") },
          { question: "", answer: doc("No question") },
        ],
      }),
    });
    expect(region.overview.points).toEqual([
      { icon: "landscape", tone: "brand", title: "Big mountains, fast", text: "Lirung after 4 days." },
      { icon: "landscape", tone: "saffron", title: "Unknown icon", text: "" },
    ]);
    expect(region.faqs).toEqual([{ question: "Where is Langtang?", answer: doc("North of Kathmandu.") }]);
    expect(detail({ page: page({ why_points: { not: "a list" }, faqs: null }) })).toMatchObject({ faqs: [], overview: { points: [] } });
  });

  it("shows the featured trek and the nearby ones that are published, each once, in order", () => {
    const region = detail({
      page: page({
        featured_trek_slug: "langtang-valley",
        featured_trek_pitch: "Kyanjin Gompa and Kyanjin Ri.",
        nearby_treks: [
          { slug: "unpublished-trek", label: "Gone", note: "" },
          { slug: "langtang-valley", label: "Again", note: "" },
          { slug: "everest-base-camp", label: "", note: "" },
        ],
      }),
    });
    expect(region.featuredTrek).toMatchObject({ trek: { slug: "langtang-valley" }, label: "Our signature Langtang trek", note: "Kyanjin Gompa and Kyanjin Ri." });
    expect(region.nearbyTreks.map((pick) => [pick.trek.slug, pick.label, pick.note])).toEqual([
      ["everest-base-camp", "Nearby trek", TREKS.find((trek) => trek.slug === "everest-base-camp")?.summary],
    ]);
    expect(detail({ page: page({ featured_trek_slug: "unpublished-trek" }) }).featuredTrek).toBeUndefined();
  });

  it("shows a card for each season with a note, rated from the month strip", () => {
    expect(detail().seasons).toEqual([
      { name: "Spring · Mar–May", rating: "best", text: "Rhododendrons in bloom." },
      { name: "Autumn · Sep–Nov", rating: "best", text: "Clear skies." },
    ]);
    expect(seasonRating(MONTHS, [5, 6, 7])).toBe("avoid");
    expect(seasonRating(MONTHS, [11, 0, 1])).toBe("possible");
    expect(seasonRating(["best", "possible", "avoid"], [0, 1, 2])).toBe("possible");
  });

  it("orders the photos as in the admin, each with where it was taken", () => {
    const region = detail({
      photos: [
        { ...photo("p2"), region_slug: "langtang", position: 1 },
        { ...photo("p1", "Kyanjin Gompa"), region_slug: "langtang", position: 0 },
        { ...NO_PHOTO, region_slug: "langtang", position: 2 },
      ],
    });
    expect(region.photos.map((item) => [item.src, item.alt, item.place])).toEqual([
      [`${BASE}/p1`, "Kyanjin Gompa, Langtang region", "Kyanjin Gompa"],
      [`${BASE}/p2`, "Langtang region", undefined],
    ]);
  });

  it("shows the guides most experienced first, without the ones missing a name or role", () => {
    const region = detail({
      guides: [
        guide("a", { years_guiding: 4, languages: [" English ", ""] }),
        guide("b", { years_guiding: 16, is_licensed: true, quote: " Safety first. ", ...photo("g1") }),
        guide("c", { role: " " }),
      ],
    });
    expect(region.guides).toEqual([
      expect.objectContaining({ id: "b", experience: "16+ yrs guiding", quote: "Safety first.", isLicensed: true, photo: expect.objectContaining({ alt: "Guide b" }) }),
      expect.objectContaining({ id: "a", experience: "4+ yrs guiding", quote: undefined, languages: ["English"], photo: undefined }),
    ]);
  });

  it("shows up to three travel guides in the given order (pinned first), skipping ones not on this site", () => {
    const region = detail({
      page: page({ travel_guide_slugs: ["permits", "region-site-only", "best-time", "gear", "health"] }),
      travelGuides: ["best-time", "permits", "gear", "health"].map(travelGuide),
    });
    expect(region.articles.map((article) => article.slug)).toEqual(["permits", "best-time", "gear"]);
  });

  it("compares with the admin's picks in order, else with the four nearest regions", () => {
    expect(detail({ page: page({ compare_slugs: ["everest", "langtang", "nowhere", "manaslu"] }) }).compareWith.map((region) => region.slug)).toEqual([
      "everest",
      "manaslu",
    ]);
    expect(detail().compareWith.map((region) => region.slug)).toEqual(["tamang-heritage-trail", "manaslu", "everest", "annapurna"]);
  });
});

describe("region JSON-LD", () => {
  it("describes the destination with coordinates and lists the questions as plain text", () => {
    const region = detail({ page: page({ faqs: [{ question: "Where is Langtang?", answer: doc("North of Kathmandu.") }] }) });
    const graph = regionJsonLd(region)["@graph"] as Record<string, unknown>[];
    expect(graph.find((node) => node["@type"] === "TouristDestination")?.geo).toEqual({ "@type": "GeoCoordinates", latitude: 28.21, longitude: 85.56 });
    expect(graph.find((node) => node["@type"] === "FAQPage")?.mainEntity).toEqual([
      { "@type": "Question", name: "Where is Langtang?", acceptedAnswer: { "@type": "Answer", text: "North of Kathmandu." } },
    ]);
  });
});
