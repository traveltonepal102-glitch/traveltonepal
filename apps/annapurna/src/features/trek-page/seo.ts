import type { Metadata } from "next";

import { homeJsonLd } from "@/features/home/homeJsonLd";
import { pageMetadata } from "@/lib/pageMetadata";
import { ROUTES, pagePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { TrekPageData } from "./types";

/** A trek page's tags: its Google result as typed, its canonical address and whether Google may list it. */
export const trekPageMetadata = ({ trek, seo, isHidden, canonicalPath }: TrekPageData): Metadata => {
  const { title, description, shareImageBase, dates, isLive } = seo;
  return {
    ...pageMetadata({ path: canonicalPath ?? pagePath(trek.slug), title, description, shareImageBase, dates, isLive, isListed: !isHidden }),
    title: { absolute: title },
  };
};

/** The trek as on the home page, with this page's address and its breadcrumb. */
export const trekPageJsonLd = ({ trek, seo }: TrekPageData) => {
  const path = pagePath(trek.slug);
  const { "@context": context, "@graph": graph } = homeJsonLd(trek, seo, path);
  return {
    "@context": context,
    "@graph": [
      ...graph,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
          { "@type": "ListItem", position: 2, name: trek.name, item: absoluteUrl(path) },
        ],
      },
    ],
  };
};
