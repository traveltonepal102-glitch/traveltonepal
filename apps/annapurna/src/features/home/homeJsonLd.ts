import { imageFileUrl } from "@ttn/site-data/images";
import { datesJsonLd } from "@ttn/site-data/pageDates";

import { SITE_LANGUAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

import type { HomeSeo, HomeTrek } from "./types";

/** Google reads one file of each photo, about this wide. */
const IMAGE_WIDTH = 1200;

/** The page (with its dates), the trek shown on it and its questions. No rating: Google refuses self-serving ones. */
export const homeJsonLd = (trek: HomeTrek, seo: HomeSeo, path = "/") => {
  const prices = trek.pricing.prices.map((price) => price.price);
  const currency = trek.pricing.prices[0]?.currency ?? "EUR";
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", url, name: seo.title, inLanguage: SITE_LANGUAGE, ...datesJsonLd(seo.dates) },
      {
        "@type": "TouristTrip",
        name: trek.name,
        description: seo.description,
        url,
        image: trek.photos.map((photo) => absoluteUrl(imageFileUrl(photo, IMAGE_WIDTH))),
        touristType: "Trekker",
        inLanguage: SITE_LANGUAGE,
        provider: { "@id": absoluteUrl("/#organization"), name: SITE_NAME },
        ...(prices.length
          ? { offers: { "@type": "AggregateOffer", priceCurrency: currency, lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length, url } }
          : {}),
      },
      ...(trek.faq.items.length
        ? [{ "@type": "FAQPage", mainEntity: trek.faq.items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }]
        : []),
    ],
  };
};
