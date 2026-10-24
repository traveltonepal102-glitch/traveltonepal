import { describe, expect, it } from "vitest";

import type { WebRegionRow } from "@/lib/supabase/database.types";

import { toRegionSummaries } from "./regionRows";

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
});
