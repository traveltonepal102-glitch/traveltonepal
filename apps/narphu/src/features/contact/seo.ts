import { datesJsonLd } from "@ttn/site-data/pageDates";
import { richTextToPlainText } from "@ttn/ui/lib/richText";

import { organizationId } from "@/features/site-settings/organizationJsonLd";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { ContactPageContent } from "./types";

/** ContactPage (with its dates) about the company, by its id (its contact points are on every page), the breadcrumb and the FAQ. */
export const contactJsonLd = ({ top, faqs }: ContactPageContent) => ({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ContactPage", url: absoluteUrl(ROUTES.contact), name: top.seo.title, ...datesJsonLd(top.dates), mainEntity: { "@id": organizationId() } },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl(ROUTES.contact) },
      ],
    },
    ...(faqs.length
      ? [{ "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(faq.answer) } })) }]
      : []),
  ],
});
