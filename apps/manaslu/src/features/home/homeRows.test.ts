import type { WebReviewRow, WebSitePageRow, WebTravelGuideRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toAllGuides, toHomeRating, toHomeReviews, toHomeTop, toTrekPageGuides } from "./homeRows";

const pageRow = (content: unknown) =>
  ({ eyebrow: " Season ", heading: "Manaslu Circuit", intro: "Intro", content, cover_id: "p1", cover_variant_widths: [400], cover_file_name: "manaslu", cover_placeholder: "", cover_place: "" }) as unknown as WebSitePageRow;

describe("the top of the home page", () => {
  it("reads the admin's words and the photo's description", () => {
    const top = toHomeTop(pageRow({ photoAlt: "Manaslu at sunrise", buttonLabel: "Plan it", secondLabel: "See days" }), "https://photos");
    expect(top).toMatchObject({ eyebrow: "Season", buttonLabel: "Plan it", secondLabel: "See days", photo: { alt: "Manaslu at sunrise", src: "https://photos/p1" } });
  });

  it("has a default WhatsApp button, however broken the content", () => {
    expect(toHomeTop(pageRow(null), "https://photos")).toMatchObject({ buttonLabel: "Plan my trek on WhatsApp", secondLabel: "" });
  });
});

const review = (id: string, reviewed_on: string) => ({ id, reviewer_name: id, reviewed_on, rating: 5, quote: "Good", url: "https://g", photo_id: null, photo_variant_widths: null }) as unknown as WebReviewRow;

describe("reviews", () => {
  it("shows the newest six, saying how long ago", () => {
    const rows = ["2026-01-01", "2026-10-01", "2026-02-01", "2026-03-01", "2026-04-01", "2026-05-01", "2026-06-01"].map((day) => review(day, day));
    const shown = toHomeReviews(rows, "https://photos", new Date("2026-11-01T00:00:00Z"));
    expect(shown).toHaveLength(6);
    expect(shown[0]).toMatchObject({ id: "2026-10-01", when: "a month ago" });
    expect(shown.map((item) => item.id)).not.toContain("2026-01-01");
  });

  it("takes the rating from Google only", () => {
    expect(toHomeRating([{ source: "tripadvisor", rating: 4.2, review_count: 3, profile_url: "" }])).toBeNull();
    expect(toHomeRating([{ source: "google", rating: 4.9, review_count: 37, profile_url: "https://g" }])).toEqual({ rating: 4.9, count: 37, profileUrl: "https://g" });
  });
});

const guide = (slug: string, published_on: string, is_featured = false) => ({ slug, title: slug, card_text: "", topic: "planning", published_on, read_minutes: 4, is_featured, cover_id: null, cover_variant_widths: null, cover_alt: "" }) as unknown as WebTravelGuideRow;

describe("guides", () => {
  it("puts the featured guide first, then the newest", () => {
    const shown = toAllGuides([guide("old", "2026-01-01"), guide("new", "2026-09-01"), guide("featured", "2025-01-01", true)], "https://photos");
    expect(shown.map((item) => item.slug)).toEqual(["featured", "new", "old"]);
    expect(shown[1].meta).toBe("Sep 1, 2026 · 4 min read");
  });

  const all = toAllGuides(
    ["a", "b", "c", "d", "e", "f"].map((slug, index) => guide(slug, `2026-0${9 - index}-01`, slug === "a")),
    "https://photos",
  );
  const slugs = (guides: readonly { slug: string }[]) => guides.map((item) => item.slug);

  it("shows only the posts a trek picked, in its order, five at most", () => {
    expect(slugs(toTrekPageGuides(all, ["f", "c"]))).toEqual(["f", "c"]);
    expect(slugs(toTrekPageGuides(all, ["f", "e", "d", "c", "b", "a"]))).toEqual(["f", "e", "d", "c", "b"]);
    expect(slugs(toTrekPageGuides(all, ["unpublished", "c"]))).toEqual(["c"]);
  });

  it("keeps the website's order without a pick, or with none that is published", () => {
    expect(slugs(toTrekPageGuides(all, []))).toEqual(["a", "b", "c", "d", "e"]);
    expect(slugs(toTrekPageGuides(all, ["unpublished"]))).toEqual(["a", "b", "c", "d", "e"]);
  });
});
