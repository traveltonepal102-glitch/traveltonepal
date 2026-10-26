import type { Metadata } from "next";

import { richTextToPlainText } from "@ttn/ui/lib/richText";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { guideListHref } from "@/features/guides/guideFiltering";
import { getGuideTopic } from "@/features/guides/topics";
import { imageFileUrl } from "@/lib/images";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, guidePath } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { GuideArticle } from "./types";

/** Share previews and Google read one file of the photo, about this wide. */
const SHARE_IMAGE_WIDTH = 1200;

/** Home / Travel guides / Best time to trek (the topic, linking to its guides), as in the design. */
export const articleBreadcrumbs = (article: GuideArticle): BreadcrumbItem[] => [
  { label: "Home", href: ROUTES.home },
  { label: "Travel guides", href: ROUTES.guides },
  { label: getGuideTopic(article.topic).label, href: guideListHref({ topic: article.topic }) },
];

export const articleMetadata = (article: GuideArticle): Metadata => {
  const path = guidePath(article.slug);

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url: path,
      title: article.seo.title,
      description: article.seo.description,
      publishedTime: article.publishedOn,
      ...(article.updatedOn ? { modifiedTime: article.updatedOn } : {}),
      images: [{ url: imageFileUrl(article.image, SHARE_IMAGE_WIDTH), alt: article.image.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
};

/** Article, BreadcrumbList (ending with the article) and FAQPage. */
export const articleJsonLd = (article: GuideArticle): JsonLdData => {
  const path = guidePath(article.slug);
  const url = absoluteUrl(path);
  const crumbs = [...articleBreadcrumbs(article), { label: article.title }];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.seo.description,
        image: absoluteUrl(imageFileUrl(article.image, SHARE_IMAGE_WIDTH)),
        datePublished: article.publishedOn,
        ...(article.updatedOn ? { dateModified: article.updatedOn } : {}),
        author: { "@type": "Person", name: article.author.name, ...(article.author.role ? { jobTitle: article.author.role } : {}) },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl(ROUTES.home) },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: absoluteUrl(item.href ?? path),
        })),
      },
      ...(article.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: article.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(faq.answer) },
              })),
            },
          ]
        : []),
    ],
  };
};
