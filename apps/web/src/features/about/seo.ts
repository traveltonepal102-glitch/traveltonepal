import type { Metadata } from "next";

import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import { ORGANIZATION_ID } from "@/features/seo/organization";

import { FOUNDER } from "./founder";

const TITLE = "About us: a licensed Nepali trekking company in Kathmandu";
const DESCRIPTION =
  "Meet the Kathmandu team and local guides behind Travel To Nepal: our story, what we promise on every trek, our licences, and how we look after porters and villages.";

export const aboutMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.about },
  openGraph: { type: "website", siteName: SITE_NAME, url: ROUTES.about, title: TITLE, description: DESCRIPTION },
};

/** True for a value still waiting for the owner, e.g. "[NAME]": never sent to search engines. */
const isPlaceholder = (value: string) => value.includes("[");

/** AboutPage about the company (the TravelAgency every page describes, by its id), with its founder, and the breadcrumb. */
export const aboutJsonLd = (): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: absoluteUrl(ROUTES.about),
      name: TITLE,
      mainEntity: {
        "@id": ORGANIZATION_ID,
        ...(isPlaceholder(FOUNDER.name) ? {} : { founder: { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.role } }),
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
