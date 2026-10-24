import { describe, expect, it } from "vitest";

import type { WebTravelGuideRow } from "@/lib/supabase/database.types";

import { toMainSiteGuideCards } from "./guideRows";

const BASE = "https://photos.example.com";

const row = (slug: string, overrides: Partial<WebTravelGuideRow> = {}): WebTravelGuideRow => ({
  id: `id-${slug}`,
  slug,
  locale: "en",
  title: slug,
  card_text: "Card text",
  topic: "best-time",
  site_region_slug: null,
  also_on_main_site: false,
  is_featured: false,
  start_here_position: null,
  published_on: "2026-10-01",
  updated_on: null,
  cover_alt: "",
  cover_id: `photo-${slug}`,
  cover_width: 2400,
  cover_height: 1600,
  cover_variant_widths: [400, 800],
  cover_placeholder: null,
  cover_place: "Langtang",
  ...overrides,
});

const slugsOf = (rows: WebTravelGuideRow[]) => toMainSiteGuideCards(rows, BASE).map((guide) => guide.slug);

describe("toMainSiteGuideCards", () => {
  it("maps a guide to its card, with its topic's chip and its own image text", () => {
    const [guide] = toMainSiteGuideCards([row("best-time", { title: " Best time ", card_text: " Month by month ", cover_alt: "Snow above Kyanjin" })], BASE);
    expect(guide).toEqual({
      slug: "best-time",
      title: "Best time",
      excerpt: "Month by month",
      tag: "Best time to trek",
      tagIcon: "wb_sunny",
      image: { src: `${BASE}/photo-best-time`, alt: "Snow above Kyanjin", variantWidths: [400, 800], placeholder: undefined },
    });
  });

  it("names the photo after the guide when the cover has no image text", () => {
    expect(toMainSiteGuideCards([row("a", { title: "Permits", cover_alt: "  " })], BASE)[0].image.alt).toBe("Langtang, Permits");
  });

  it("shows the main site's guides and region sites' guides marked for the main site, not the others", () => {
    const rows = [row("main"), row("region-only", { site_region_slug: "langtang" }), row("shared", { site_region_slug: "langtang", also_on_main_site: true })];
    expect(slugsOf(rows).toSorted()).toEqual(["main", "shared"]);
  });

  it("puts the featured guide first, then the newest", () => {
    const rows = [row("old", { published_on: "2026-01-01" }), row("new", { published_on: "2026-09-01" }), row("featured", { published_on: "2025-05-01", is_featured: true })];
    expect(slugsOf(rows)).toEqual(["featured", "new", "old"]);
  });

  it("keeps the same order for guides published on the same day", () => {
    const rows = [row("b"), row("c"), row("a")];
    expect(slugsOf(rows)).toEqual(["a", "b", "c"]);
    expect(slugsOf(rows.toReversed())).toEqual(["a", "b", "c"]);
  });

  it("leaves out a guide without a title or a cover photo", () => {
    const rows = [row("no-title", { title: " " }), row("no-cover", { cover_id: null }), row("no-sizes", { cover_variant_widths: [] }), row("ok")];
    expect(slugsOf(rows)).toEqual(["ok"]);
  });

  it("shows nothing for no rows", () => {
    expect(toMainSiteGuideCards([], BASE)).toEqual([]);
  });
});
