import type { Metadata } from "next";

import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { RegionListItem } from "./regionListItems";

const TITLE = "Trekking regions of Nepal: compare and choose";
const DESCRIPTION =
  "Compare Nepal's 9 trekking regions on one map: altitude, trek length, access, permits and the best months, from Langtang near Kathmandu to remote Kanchenjunga.";

export const regionsMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.regions },
  openGraph: { type: "website", siteName: SITE_NAME, url: ROUTES.regions, title: TITLE, description: DESCRIPTION },
};

/** BreadcrumbList and an ItemList of the regions (with a URL only for regions that have a page). */
export const regionsJsonLd = (regions: readonly RegionListItem[]): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Regions", item: absoluteUrl(ROUTES.regions) },
      ],
    },
    {
      "@type": "ItemList",
      name: "Trekking regions of Nepal",
      itemListElement: regions.map((region) => ({
        "@type": "ListItem",
        position: region.number,
        item: {
          "@type": "TouristDestination",
          name: `${region.name}, Nepal`,
          description: region.summary,
          geo: { "@type": "GeoCoordinates", latitude: region.location.lat, longitude: region.location.lon },
          ...(region.hasPage ? { url: absoluteUrl(region.href) } : {}),
        },
      })),
    },
  ],
});
