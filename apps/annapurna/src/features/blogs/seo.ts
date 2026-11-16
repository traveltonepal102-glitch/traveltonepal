import { datesJsonLd } from "@ttn/site-data/pageDates";

import { ROUTES, blogsPagePath, pagePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import { BLOGS_PER_PAGE } from "./blogFiltering";
import type { BlogsPageData } from "./types";

/** "Blog" on the first page of the list, "Blog (Seite 2)" after it: no two pages share a title. */
export const blogsPageTitle = (title: string, page: number) => (page > 1 ? `${title} (Seite ${page})` : title);

/** One page of the list as a CollectionPage (with its dates) naming the blogs that page shows, numbered through the whole list, and the breadcrumb. */
export const blogsJsonLd = ({ top, guides }: BlogsPageData, page = 1, perPage = BLOGS_PER_PAGE) => {
  const first = (page - 1) * perPage;
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: absoluteUrl(blogsPagePath(page)),
      name: blogsPageTitle(top.seo.title, page),
      description: top.seo.description,
      ...datesJsonLd(top.dates),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: guides.slice(first, first + perPage).map((guide, index) => ({ "@type": "ListItem", position: first + index + 1, name: guide.title, url: absoluteUrl(pagePath(guide.slug)) })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl(ROUTES.blogs) },
      ],
    },
  ],
  };
};
