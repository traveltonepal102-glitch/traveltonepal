import { datesJsonLd } from "@ttn/site-data/pageDates";

import { organizationId } from "@/features/site-settings/organizationJsonLd";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { AboutContent } from "./types";

/** AboutPage (with its dates) about the company, by its id, with its founder, and the breadcrumb. */
export const aboutJsonLd = ({ top, founder }: AboutContent) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: absoluteUrl(ROUTES.about),
      name: top.seo.title,
      ...datesJsonLd(top.dates),
      mainEntity: {
        "@id": organizationId(),
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
