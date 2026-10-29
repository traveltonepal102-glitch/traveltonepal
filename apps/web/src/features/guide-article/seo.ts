import type { Metadata } from "next";

import { richTextToPlainText } from "@ttn/ui/lib/richText";

import type { BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { guideListHref } from "@/features/guides/guideFiltering";
import { getGuideTopic } from "@/features/guides/topics";
import { imageFileUrl } from "@/lib/images";
import { shareMetadata } from "@/features/seo/shareMetadata";
import type { JsonLdData } from "@/lib/jsonLd";
import { ROUTES, guidePath } from "@/lib/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

import type { GuideArticle } from "./types";

/** Google reads one file of each photo in the structured data, about this wide (shared links use the share picture). */
const SHARE_IMAGE_WIDTH = 1200;

/** Home / Travel guides / Best time to trek (the topic, linking to its guides), as in the design. */
export const articleBreadcrumbs = (article: GuideArticle): BreadcrumbItem[] => [
  { label: "Home", href: ROUTES.home },
  { label: "Travel guides", href: ROUTES.guides },
  { label: getGuideTopic(article.topic).label, href: guideListHref({ topic: article.topic }) },
];

/** Title, description and canonical address; shared links (an article) show the chosen share photo, else the guide's photo. */
export const articleMetadata = (article: GuideArticle): Metadata => {
  const path = guidePath(article.slug);
  const { title, description, shareImage } = article.seo;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...shareMetadata({
      path,
      title,
      description,
      images: [shareImage, article.image],
      article: { publishedTime: article.publishedOn, modifiedTime: article.updatedOn },
    }),
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
