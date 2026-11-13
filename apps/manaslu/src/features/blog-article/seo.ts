import { authorJsonLd } from "@ttn/site-data/authorJsonLd";
import { imageFileUrl } from "@ttn/site-data/images";
import { datesJsonLd } from "@ttn/site-data/pageDates";
import { richTextToPlainText } from "@ttn/ui/lib/richText";
import type { Metadata } from "next";

import { organizationId } from "@/features/site-settings/organizationJsonLd";
import { pageMetadata } from "@/lib/pageMetadata";
import { ROUTES, pagePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { BlogArticle } from "./types";

/** Google reads one file of the photo, about this wide. */
const IMAGE_WIDTH = 1200;

/** A blog's tags: its Google result as typed, its canonical address and whether Google may list it. */
export const blogMetadata = ({ slug, seo, isHidden, canonicalPath }: BlogArticle): Metadata => {
  const { title, description, shareImageBase, dates, isLive } = seo;
  return {
    ...pageMetadata({ path: canonicalPath ?? pagePath(slug), title, description, shareImageBase, dates, isLive, isListed: !isHidden }),
    title: { absolute: title },
  };
};

/** BlogPosting (with its dates and author), the breadcrumb and its questions. */
export const blogJsonLd = ({ slug, title, seo, image, author, faqs }: BlogArticle) => {
  const url = absoluteUrl(pagePath(slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: title,
        description: seo.description,
        image: absoluteUrl(imageFileUrl(image, IMAGE_WIDTH)),
        ...datesJsonLd(seo.dates),
        author: authorJsonLd(author),
        publisher: { "@id": organizationId() },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
          { "@type": "ListItem", position: 2, name: "Blogs", item: absoluteUrl(ROUTES.blogs) },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
      ...(faqs.length
        ? [{ "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(faq.body) } })) }]
        : []),
    ],
  };
};
