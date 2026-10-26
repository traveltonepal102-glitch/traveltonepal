import type { Metadata } from "next";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { imageFileUrl } from "@/lib/images";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, regionPath, trekPath } from "@/lib/routes";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

import type { TrekDetail } from "./types";

/** Share previews and Google read one file of the photo, about this wide. */
const SHARE_IMAGE_WIDTH = 1200;

/** Home / Nepal treks / Langtang region / Langtang Valley Trek: shown on the page and sent as JSON-LD. */
export const trekBreadcrumbs = (trek: TrekDetail): BreadcrumbItem[] => [
  { label: "Home", href: ROUTES.home },
  { label: "Nepal treks", href: ROUTES.treks },
  { label: `${trek.region} region`, href: regionPath(trek.regionSlug) },
  { label: trek.name },
];

export const trekMetadata = (trek: TrekDetail): Metadata => {
  const path = trekPath(trek.slug);
  const image = trek.photos[0];

  return {
    title: trek.seo.title,
    description: trek.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: trek.seo.title,
      description: trek.seo.description,
      images: image ? [{ url: imageFileUrl(image, SHARE_IMAGE_WIDTH), alt: image.alt }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
};

const breadcrumbListJsonLd = (trek: TrekDetail): JsonLdData => ({
  "@type": "BreadcrumbList",
  itemListElement: trekBreadcrumbs(trek).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.href ?? trekPath(trek.slug)),
  })),
});

/** Prices from the group-size table. No rating here: only real, published reviews may be marked up. */
const offersJsonLd = (trek: TrekDetail): JsonLdData | undefined => {
  const prices = trek.groupPrices.map((tier) => tier.priceUsd);
  if (prices.length === 0) return undefined;
  return {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
    url: absoluteUrl(trekPath(trek.slug)),
  };
};

/** The FAQ section's questions and answers, exactly as shown on the page. */
const faqPageJsonLd = (trek: TrekDetail): JsonLdData[] => {
  const questions = trek.faqs.flatMap((group) => group.items);
  if (questions.length === 0) return [];
  return [
    {
      "@type": "FAQPage",
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
};

/** BreadcrumbList, TouristTrip and FAQPage for the trek page. */
export const trekJsonLd = (trek: TrekDetail): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbListJsonLd(trek),
    ...faqPageJsonLd(trek),
    {
      "@type": "TouristTrip",
      name: trek.name,
      description: trek.seo.description,
      url: absoluteUrl(trekPath(trek.slug)),
      image: trek.photos.map((photo) => absoluteUrl(imageFileUrl(photo, SHARE_IMAGE_WIDTH))),
      touristType: "Trekkers",
      provider: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL.toString() },
      offers: offersJsonLd(trek),
    },
  ],
});
