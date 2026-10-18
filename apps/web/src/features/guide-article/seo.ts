import type { Metadata } from "next";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { guideListHref } from "@/features/guides/guideFiltering";
import { getGuideTopic } from "@/features/guides/topics";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, guidePath } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { GuideArticle } from "./types";

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
      images: [{ url: article.image.src, alt: article.image.alt }],
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
        image: absoluteUrl(article.image.src),
        datePublished: article.publishedOn,
        author: { "@type": "Person", name: article.author },
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
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };
};
