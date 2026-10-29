import { richTextToPlainText } from "@ttn/ui/lib/richText";
import type { Metadata } from "next";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { imageFileUrl } from "@/lib/images";
import { shareMetadata } from "@/features/seo/shareMetadata";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, regionPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { RegionDetail } from "./types";

/** Google reads one file of each photo in the structured data, about this wide (shared links use the share picture). */
const SHARE_IMAGE_WIDTH = 1200;

/** Home / Regions / Langtang: shown on the page and sent as JSON-LD. */
export const regionBreadcrumbs = (region: RegionDetail): BreadcrumbItem[] => [
  { label: "Home", href: ROUTES.home },
  { label: "Regions", href: ROUTES.regions },
  { label: region.name },
];

/** Title, description and canonical address; shared links show the chosen share photo, else the region's cover. */
export const regionMetadata = (region: RegionDetail): Metadata => {
  const path = regionPath(region.slug);
  const { title, description, shareImage } = region.seo;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...shareMetadata({ path, title, description, images: [shareImage, region.image] }),
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
        image: [...(region.image ? [region.image] : []), ...region.photos].map((photo) => absoluteUrl(imageFileUrl(photo, SHARE_IMAGE_WIDTH))),
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
                acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(item.answer) },
              })),
            },
          ]
        : []),
    ],
  };
};
