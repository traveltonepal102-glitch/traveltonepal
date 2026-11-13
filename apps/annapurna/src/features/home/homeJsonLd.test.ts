import { describe, expect, it } from "vitest";

import { homeJsonLd } from "./homeJsonLd";
import type { HomeSeo, HomeTrek } from "./types";

const seo = { title: "Manaslu Circuit Trek", description: "Private trek", isLive: true, dates: { published: "2026-10-26", modified: "2026-11-05" } } as HomeSeo;
const trek = {
  name: "Manaslu Circuit Trek",
  photos: [],
  pricing: { prices: [{ priceUsd: 1590 }, { priceUsd: 1110 }] },
  faq: { items: [{ question: "Is it hard?", answer: "Yes." }] },
} as unknown as HomeTrek;

describe("the home page's structured data", () => {
  it("sends the page's dates, the trek's price range and its questions", () => {
    const graph = JSON.stringify(homeJsonLd(trek, seo));
    expect(graph).toContain('"datePublished":"2026-10-26"');
    expect(graph).toContain('"dateModified":"2026-11-05"');
    expect(graph).toContain('"lowPrice":1110');
    expect(graph).toContain('"highPrice":1590');
    expect(graph).toContain('"FAQPage"');
  });

  it("never sends a rating, and leaves out prices and questions the trek doesn't have", () => {
    const graph = JSON.stringify(homeJsonLd({ ...trek, pricing: { heading: "", intro: "", prices: [] }, faq: { heading: "", items: [] } }, seo));
    expect(graph).not.toContain("aggregateRating");
    expect(graph).not.toContain("AggregateOffer");
    expect(graph).not.toContain("FAQPage");
  });
});
