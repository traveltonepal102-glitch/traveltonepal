import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { RegionListItem } from "./regionListItems";

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
          ...(region.summary ? { description: region.summary } : {}),
          geo: { "@type": "GeoCoordinates", latitude: region.location.lat, longitude: region.location.lon },
          ...(region.hasPage ? { url: absoluteUrl(region.href) } : {}),
        },
      })),
    },
  ],
});
