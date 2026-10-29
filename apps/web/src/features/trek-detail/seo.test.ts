import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "@/lib/jsonLd";

import { trekJsonLd, trekMetadata } from "./seo";
import { PHOTOS_BASE, langtangSource } from "./trekPage.testData";
import { toTrekDetail } from "./trekPageRows";

const trek = toTrekDetail(langtangSource(), PHOTOS_BASE);
const graph = trekJsonLd(trek)["@graph"] as Record<string, unknown>[];
const byType = (type: string) => graph.find((node) => node["@type"] === type);

describe("trek page SEO", () => {
  it("sets the title, description and canonical path", () => {
    const metadata = trekMetadata(trek);
    expect(metadata.title).toBe(trek.seo.title);
    expect(metadata.alternates?.canonical).toBe("/treks/langtang-valley");
  });

  it("shares the trek's first photo, or the share photo chosen in the admin, as a 1200×630 picture", () => {
    const [firstPhoto] = trek.photos;
    expect(trekMetadata(trek).openGraph).toMatchObject({ images: [{ url: `${firstPhoto.src}/share.jpg`, width: 1200, height: 630 }] });

    const chosen = toTrekDetail(langtangSource({ share_id: "share-photo", share_variant_widths: [400, 800], share_place: "Kyanjin Ri" }), PHOTOS_BASE);
    expect(trekMetadata(chosen).openGraph).toMatchObject({
      images: [{ url: `${PHOTOS_BASE}/share-photo/share.jpg`, alt: "Kyanjin Ri, Langtang Valley Trek" }],
    });
  });

  it("lists the breadcrumb trail with full URLs, ending at the trek page", () => {
    const items = byType("BreadcrumbList")?.itemListElement as { position: number; name: string; item: string }[];
    expect(items.map((item) => item.name)).toEqual(["Home", "Nepal treks", "Langtang region", "Langtang Valley Trek"]);
    expect(items.at(-1)?.item).toMatch(/^https?:\/\/.+\/treks\/langtang-valley$/);
  });

  it("describes the trip with its price range and no rating", () => {
    const trip = byType("TouristTrip");
    expect(trip?.offers).toMatchObject({ "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: 740, highPrice: 1110 });
    expect(trip).not.toHaveProperty("aggregateRating");
  });

  it("lists every FAQ question with its answer", () => {
    const faq = byType("FAQPage")?.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    const questionCount = trek.faqs.reduce((count, group) => count + group.items.length, 0);
    expect(faq).toHaveLength(questionCount);
    expect(faq[0]).toEqual({
      "@type": "Question",
      name: trek.faqs[0].items[0].question,
      acceptedAnswer: { "@type": "Answer", text: trek.faqs[0].items[0].answer },
    });
  });

  it("escapes < so the JSON cannot close its script tag", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
