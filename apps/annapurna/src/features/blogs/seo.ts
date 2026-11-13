import { datesJsonLd } from "@ttn/site-data/pageDates";

import { ROUTES, pagePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { BlogsPageData } from "./types";

/**
 * The list as a CollectionPage (with its dates) and the breadcrumb. The page's HTML holds only the first page of blogs,
 * so the list here names all of them for search engines.
 */
export const blogsJsonLd = ({ top, guides }: BlogsPageData) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: absoluteUrl(ROUTES.blogs),
      name: top.seo.title,
      description: top.seo.description,
      ...datesJsonLd(top.dates),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: guides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: absoluteUrl(pagePath(guide.slug)) })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Blogs", item: absoluteUrl(ROUTES.blogs) },
      ],
    },
  ],
});
