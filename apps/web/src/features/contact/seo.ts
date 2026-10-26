import { richTextToPlainText } from "@ttn/ui/lib/richText";
import type { Metadata } from "next";

import { ORGANIZATION_ID } from "@/features/seo/organization";
import { sitePageMetadata } from "@/features/site-pages/seo";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { ContactPageContent } from "./types";

export const contactMetadata = (page: ContactPageContent): Metadata => sitePageMetadata(page.top, ROUTES.contact);

/** ContactPage about the company (its contact points are on every page, by its id), the breadcrumb and the FAQ. */
export const contactJsonLd = ({ top, faqs }: ContactPageContent): JsonLdData => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      url: absoluteUrl(ROUTES.contact),
      name: top.seo.title || top.heading,
      mainEntity: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl(ROUTES.contact) },
      ],
    },
    ...(faqs.length
      ? [
          {
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(faq.answer) },
            })),
          },
        ]
      : []),
  ],
});
