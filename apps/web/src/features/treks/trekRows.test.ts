import { describe, expect, it } from "vitest";

import type { WebTrekRow } from "@/lib/supabase/database.types";

import { toTrekSummaries } from "./trekRows";

const BASE = "https://photos.example.com";
const NO_COVER = { cover_id: null, cover_width: null, cover_height: null, cover_variant_widths: null, cover_placeholder: null, cover_place: null };

const row = (slug: string, overrides: Partial<WebTrekRow> = {}): WebTrekRow => ({
  id: `id-${slug}`,
  slug,
  locale: "en",
  name: slug,
  summary: "A trek",
  card_badge: "",
  season_label: "Mar–May, Oct–Nov",
  days: 10,
  difficulty: "moderate",
  max_altitude_m: 4773,
  seasons: ["spring", "autumn"],
  tags: ["classic"],
  is_popular: true,
  has_fixed_dates: false,
  has_page: true,
  price_from_usd: 890,
  region_slug: "langtang",
  region_name: "Langtang",
  updated_at: "2026-10-24T00:00:00Z",
  ...NO_COVER,
  ...overrides,
});

describe("toTrekSummaries", () => {
  it("maps a published trek to its card", () => {
    const [trek] = toTrekSummaries(
      [row("langtang-valley", { name: "Langtang Valley Trek", card_badge: " Best value ", has_fixed_dates: true, cover_id: "p1", cover_variant_widths: [400], cover_place: "Kyanjin" })],
      BASE,
    );
    expect(trek).toEqual({
      slug: "langtang-valley",
      name: "Langtang Valley Trek",
      region: "Langtang",
      regionSlug: "langtang",
      summary: "A trek",
      days: 10,
      maxAltitudeM: 4773,
      difficulty: "Moderate",
      priceFromUsd: 890,
      seasonLabel: "Mar–May, Oct–Nov",
      seasons: ["spring", "autumn"],
      tags: ["classic"],
      badge: "Best value",
      isPopular: true,
      hasFixedDates: true,
      hasPage: true,
      image: { src: `${BASE}/p1`, alt: "Kyanjin, Langtang Valley Trek", variantWidths: [400], placeholder: undefined },
    });
  });

  it("names every difficulty the database allows", () => {
    const difficulties = (["easy", "moderate", "challenging", "strenuous"] as const).map((difficulty) => toTrekSummaries([row("t", { difficulty })], BASE)[0].difficulty);
    expect(difficulties).toEqual(["Easy", "Moderate", "Challenging", "Strenuous"]);
  });

  it("leaves out a trek still missing its days, highest point or name", () => {
    const treks = toTrekSummaries([row("a", { days: null }), row("b", { max_altitude_m: null }), row("c", { name: " " }), row("d")], BASE);
    expect(treks.map((trek) => trek.slug)).toEqual(["d"]);
  });

  it("has no price without one (the card says “Price on request”) and no badge for blank text", () => {
    const [trek] = toTrekSummaries([row("a", { price_from_usd: null, card_badge: "   " })], BASE);
    expect(trek.priceFromUsd).toBeUndefined();
    expect(trek.badge).toBeUndefined();
  });

  it("has no photo without a cover, or when its sizes aren't made yet", () => {
    const treks = toTrekSummaries([row("a"), row("b", { cover_id: "p1", cover_variant_widths: [] })], BASE);
    expect(treks.map((trek) => trek.image)).toEqual([undefined, undefined]);
  });

  it("puts popular treks first, then A–Z, then by address when two treks share a name", () => {
    const treks = toTrekSummaries(
      [row("z", { name: "Mardi Himal" }), row("b", { name: "Everest", is_popular: false }), row("a", { name: "Mardi Himal" }), row("c", { name: "Annapurna", is_popular: false })],
      BASE,
    );
    expect(treks.map((trek) => trek.slug)).toEqual(["a", "z", "c", "b"]);
  });
});
