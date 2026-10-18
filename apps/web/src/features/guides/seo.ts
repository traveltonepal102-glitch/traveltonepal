import type { Metadata } from "next";

import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, guidePath } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { TravelGuide } from "./types";

const TITLE = "Nepal travel guides: permits, seasons, costs and altitude";
const DESCRIPTION =
  "Honest, practical advice for planning a trek in Nepal: permits, seasons, costs, altitude and what to pack, from the local team who walk these trails every season.";

export const guidesMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.guides },
  openGraph: { type: "website", siteName: SITE_NAME, url: ROUTES.guides, title: TITLE, description: DESCRIPTION },
};

/** BreadcrumbList and an ItemList of the guides on the page. */
export const guidesJsonLd = (guides: readonly TravelGuide[]): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Travel guides", item: absoluteUrl(ROUTES.guides) },
      ],
    },
    {
      "@type": "ItemList",
      name: "Nepal travel guides",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(guidePath(guide.slug)),
        name: guide.title,
      })),
    },
  ],
});
