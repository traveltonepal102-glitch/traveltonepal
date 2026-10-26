import type { Metadata } from "next";

import { ORGANIZATION_ID } from "@/features/seo/organization";
import { sitePageMetadata } from "@/features/site-pages/seo";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { AboutPageContent } from "./types";

export const aboutMetadata = (about: AboutPageContent): Metadata => sitePageMetadata(about.top, ROUTES.about);

/** AboutPage about the company (the TravelAgency every page describes, by its id), with its founder, and the breadcrumb. */
export const aboutJsonLd = ({ top, founder }: AboutPageContent): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: absoluteUrl(ROUTES.about),
      name: top.seo.title || top.heading,
      mainEntity: {
        "@id": ORGANIZATION_ID,
        ...(founder ? { founder: { "@type": "Person", name: founder.name, ...(founder.role ? { jobTitle: founder.role } : {}) } } : {}),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "About us", item: absoluteUrl(ROUTES.about) },
      ],
    },
  ],
});
