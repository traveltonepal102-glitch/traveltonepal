import type { Metadata } from "next";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, regionPath } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { RegionDetail } from "./types";

/** Home / Regions / Langtang: shown on the page and sent as JSON-LD. */
export const regionBreadcrumbs = (region: RegionDetail): BreadcrumbItem[] => [
  { label: "Home", href: ROUTES.home },
  { label: "Regions", href: ROUTES.regions },
  { label: region.name },
];

export const regionMetadata = (region: RegionDetail): Metadata => {
  const path = regionPath(region.slug);
  return {
    title: region.seo.title,
    description: region.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: region.seo.title,
      description: region.seo.description,
      images: [{ url: region.heroImage.src, alt: region.heroImage.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
};

/** BreadcrumbList, TouristDestination and FAQPage for the region page. */
export const regionJsonLd = (region: RegionDetail): JsonLdData => {
  const url = absoluteUrl(regionPath(region.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: regionBreadcrumbs(region).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: absoluteUrl(item.href ?? regionPath(region.slug)),
        })),
      },
      {
        "@type": "TouristDestination",
        name: `${region.name}, Nepal`,
        description: region.seo.description,
        url,
        image: region.photos.map((photo) => absoluteUrl(photo.src)),
        geo: { "@type": "GeoCoordinates", latitude: region.location.lat, longitude: region.location.lon },
        containedInPlace: { "@type": "Country", name: "Nepal" },
      },
      ...(region.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: region.faqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };
};
