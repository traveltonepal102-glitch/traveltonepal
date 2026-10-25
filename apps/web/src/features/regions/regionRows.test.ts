import { describe, expect, it } from "vitest";

import type { WebRegionRow } from "@/lib/supabase/database.types";

import { toRegionCards, toRegionSummaries } from "./regionRows";

const BASE = "https://photos.example.com";
const NO_COVER = { cover_id: null, cover_width: null, cover_height: null, cover_variant_widths: null, cover_placeholder: null, cover_place: null };

const row = (slug: string, overrides: Partial<WebRegionRow> = {}): WebRegionRow => ({
  id: `id-${slug}`,
  slug,
  locale: "en",
  name: slug,
  short_name: "",
  tagline: "",
  summary: "",
  max_altitude_m: 5000,
  website_domain: null,
  ...NO_COVER,
  district: "Rasuwa",
  latitude: 28.21,
  longitude: 85.56,
  difficulty: "moderate",
  is_flight: false,
  month_ratings: ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"],
  trek_length: "7–12 days",
  getting_there: "Drive",
  getting_there_details: "Drive to Syabrubesi (7–8 hrs)",
  permits: "Langtang NP + TIMS",
  best_for: ["Close to Kathmandu", "No flights"],
  has_page: false,
  ...overrides,
});

describe("toRegionSummaries", () => {
  it("keeps the website's region order, the big home tile first, whatever order the database sends", () => {
    const slugs = toRegionSummaries([row("langtang"), row("annapurna"), row("everest")], BASE).map((region) => region.slug);
    expect(slugs).toEqual(["everest", "annapurna", "langtang"]);
  });

  it("puts a region added later after the known ones, A–Z", () => {
    const regions = toRegionSummaries([row("zanskar", { name: "Zanskar" }), row("dolpo", { name: "Dolpo" }), row("everest", { name: "Everest" })], BASE);
    expect(regions.map((region) => region.name)).toEqual(["Everest", "Dolpo", "Zanskar"]);
  });

  it("leaves out a region still missing its highest point or its name", () => {
    const regions = toRegionSummaries([row("everest", { max_altitude_m: null }), row("manaslu", { name: "   " }), row("langtang")], BASE);
    expect(regions.map((region) => region.slug)).toEqual(["langtang"]);
  });

  it("uses the tagline, else the summary, else nothing (never blank text)", () => {
    const [withTagline, withSummary, withNeither] = toRegionSummaries(
      [
        row("everest", { tagline: " Sherpa villages ", summary: "Summary" }),
        row("annapurna", { tagline: "  ", summary: "Lakes and passes" }),
        row("manaslu", { tagline: " ", summary: " " }),
      ],
      BASE,
    );
    expect(withTagline.tagline).toBe("Sherpa villages");
    expect(withSummary.tagline).toBe("Lakes and passes");
    expect(withNeither.tagline).toBeUndefined();
  });

  it("trims the name and names the region in its photo's image text", () => {
    const [region] = toRegionSummaries(
      [row("langtang", { name: " Langtang ", cover_id: "p1", cover_variant_widths: [400, 800], cover_place: "Kyanjin Gompa", cover_placeholder: "" })],
      BASE,
    );
    expect(region.name).toBe("Langtang");
    expect(region.image).toEqual({ src: `${BASE}/p1`, alt: "Kyanjin Gompa, Langtang region", variantWidths: [400, 800], placeholder: undefined });
  });

  it("has no photo when the region has no cover (the tile shows its drawing)", () => {
    expect(toRegionSummaries([row("everest")], BASE)[0].image).toBeUndefined();
  });

  it("shows nothing for no rows", () => {
    expect(toRegionSummaries([], BASE)).toEqual([]);
  });

  it("gives a region its own page once its introduction is written and its map pin and difficulty are set", () => {
    const pages = toRegionSummaries(
      [
        row("langtang", { has_page: true }),
        row("annapurna", { has_page: false }),
        row("everest", { has_page: true, latitude: null }),
        row("manaslu", { has_page: true, difficulty: null }),
      ],
      BASE,
    );
    expect(pages.map((region) => [region.slug, region.hasPage])).toEqual([
      ["everest", false],
      ["annapurna", false],
      ["manaslu", false],
      ["langtang", true],
    ]);
  });
});

describe("toRegionCards", () => {
  it("maps a region's facts, months and photo for the Regions page", () => {
    const [card] = toRegionCards([row("langtang", { name: "Langtang", short_name: " Langtang ", summary: " Close to Kathmandu. " })], BASE);
    expect(card).toEqual({
      slug: "langtang",
      name: "Langtang",
      shortName: "Langtang",
      maxAltitudeM: 5000,
      tagline: "Close to Kathmandu.",
      image: undefined,
      hasPage: false,
      district: "Rasuwa",
      location: { lat: 28.21, lon: 85.56 },
      trekLength: "7–12 days",
      difficulty: "Moderate",
      access: { short: "Drive", long: "Drive to Syabrubesi (7–8 hrs)", isFlight: false },
      permits: "Langtang NP + TIMS",
      bestFor: "Close to Kathmandu, No flights",
      bestForTags: ["Close to Kathmandu", "No flights"],
      summary: "Close to Kathmandu.",
      months: ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"],
    });
  });

  it("names every difficulty the database allows", () => {
    const difficulties = (["easy", "easy_moderate", "moderate", "easy_challenging", "challenging", "strenuous"] as const).map(
      (difficulty) => toRegionCards([row("r", { difficulty })], BASE)[0].difficulty,
    );
    expect(difficulties).toEqual(["Easy", "Easy–moderate", "Moderate", "Easy–challenging", "Challenging", "Strenuous"]);
  });

  it("numbers west to east by the map pin, whatever order the database sends", () => {
    const cards = toRegionCards([row("everest", { longitude: 86.85 }), row("annapurna", { longitude: 83.9 }), row("langtang", { longitude: 85.56 })], BASE);
    expect(cards.map((card) => card.slug)).toEqual(["annapurna", "langtang", "everest"]);
  });

  it("leaves out a region still missing its map pin, difficulty, highest point or name", () => {
    const rows = [
      row("no-pin", { latitude: null, longitude: null }),
      row("no-difficulty", { difficulty: null }),
      row("no-altitude", { max_altitude_m: null }),
      row("no-name", { name: " " }),
      row("ok"),
    ];
    expect(toRegionCards(rows, BASE).map((card) => card.slug)).toEqual(["ok"]);
  });

  it("keeps blank facts blank (the page leaves them out) and never shows blank best-for tags", () => {
    const [card] = toRegionCards(
      [row("pikey-peak", { district: " ", trek_length: "", permits: "  ", getting_there: " Drive ", getting_there_details: " ", best_for: ["  ", "Everest views"], short_name: "" })],
      BASE,
    );
    expect(card).toMatchObject({ district: "", trekLength: "", permits: "", shortName: undefined, bestFor: "Everest views", bestForTags: ["Everest views"] });
    // Without details, the long way there is the short one.
    expect(card.access).toEqual({ short: "Drive", long: "Drive", isFlight: false });
  });

  it("shows nothing for no rows", () => {
    expect(toRegionCards([], BASE)).toEqual([]);
  });
});
