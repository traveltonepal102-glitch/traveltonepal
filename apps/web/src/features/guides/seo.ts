import { webPageJsonLd } from "@/features/seo/webPage";
import { sitePageName } from "@/features/site-pages/seo";
import type { SitePageTop } from "@/features/site-pages/types";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, guidePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { TravelGuide } from "./types";

/** The page (its dates), BreadcrumbList and an ItemList of the guides on the page. */
export const guidesJsonLd = (guides: readonly TravelGuide[], top: SitePageTop): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    webPageJsonLd({ type: "CollectionPage", path: ROUTES.guides, name: sitePageName(top), dates: top.dates }),
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
