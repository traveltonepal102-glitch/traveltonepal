import { describe, expect, it } from "vitest";

import { TREK_DETAIL_SLUGS, getTrekDetail } from "./trekDetails";

describe("getTrekDetail", () => {
  it("joins the trek's summary and page content", () => {
    const trek = getTrekDetail("langtang-valley");
    expect(trek?.name).toBe("Langtang Valley Trek");
    expect(trek?.days).toBe(10);
    expect(trek?.headline).toContain("Langtang Valley Trek");
  });

  it("returns undefined for a trek without a page or an unknown slug", () => {
    expect(getTrekDetail("everest-base-camp")).toBeUndefined();
    expect(getTrekDetail("no-such-trek")).toBeUndefined();
  });

  it("has a summary, a photo, intro text, highlights, a checklist and exactly one default group size for every page", () => {
    for (const slug of TREK_DETAIL_SLUGS) {
      const trek = getTrekDetail(slug);
      expect(trek, slug).toBeDefined();
      expect(trek?.photos.length, slug).toBeGreaterThan(0);
      expect(trek?.intro.length, slug).toBeGreaterThan(0);
      expect(trek?.highlights.length, slug).toBeGreaterThan(0);
      expect(trek?.suitability.points.length, slug).toBeGreaterThan(0);
      // The section bar says "10-day itinerary": one itinerary entry per day of the trek.
      expect(trek?.itinerary.days, slug).toHaveLength(trek?.days ?? -1);
      expect(trek?.itinerary.days.filter((day) => day.isHighPoint).length, slug).toBeLessThanOrEqual(1);
      expect(trek?.inclusions.included.length, slug).toBeGreaterThan(0);
      expect(trek?.inclusions.excluded.length, slug).toBeGreaterThan(0);
      // The booking card shows the first departure as the next one, so they must be in date order.
      const dates = trek?.departures.map((departure) => departure.date) ?? [];
      expect(dates, slug).toEqual([...dates].sort());
      expect(trek?.groupPrices.filter((tier) => tier.isDefault), slug).toHaveLength(1);
    }
  });
});
