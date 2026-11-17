import { imageFileUrl } from "@ttn/site-data/images";
import { datesJsonLd } from "@ttn/site-data/pageDates";

import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { HomeSeo, HomeTrek } from "./types";

/** Google reads one file of each photo, about this wide. */
const IMAGE_WIDTH = 1200;

/** The page (with its dates), the trek shown on it and its questions. No rating: Google refuses self-serving ones. */
export const homeJsonLd = (trek: HomeTrek, seo: HomeSeo, path = "/") => {
  const prices = trek.pricing.prices.map((price) => price.priceUsd);
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", url, name: seo.title, ...datesJsonLd(seo.dates) },
      {
        "@type": "TouristTrip",
        name: trek.name,
        description: seo.description,
        url,
        image: trek.photos.map((photo) => absoluteUrl(imageFileUrl(photo, IMAGE_WIDTH))),
        touristType: "Trekkers",
        provider: { "@id": absoluteUrl("/#organization"), name: SITE_NAME },
        ...(prices.length
          ? { offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length, url } }
          : {}),
      },
      ...(trek.faq.items.length
        ? [{ "@type": "FAQPage", mainEntity: trek.faq.items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }]
        : []),
    ],
  };
};
