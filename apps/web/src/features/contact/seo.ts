import type { Metadata } from "next";

import { ORGANIZATION_ID } from "@/features/seo/organization";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import { CONTACT_FAQS } from "./contactContent";

const TITLE = "Contact us: talk to a local trekking expert";
const DESCRIPTION =
  "Ask our Kathmandu team anything about trekking in Nepal on WhatsApp or by email. A real person replies, usually within a few hours. Free, with no obligation to book.";

export const contactMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.contact },
  openGraph: { type: "website", siteName: SITE_NAME, url: ROUTES.contact, title: TITLE, description: DESCRIPTION },
};

/** ContactPage about the company (its contact points are on every page, by its id), the breadcrumb and the FAQ. */
export const contactJsonLd = (): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      url: absoluteUrl(ROUTES.contact),
      name: TITLE,
      mainEntity: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl(ROUTES.contact) },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: CONTACT_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
});
