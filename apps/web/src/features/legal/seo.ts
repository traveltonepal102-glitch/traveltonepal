import type { Metadata } from "next";

import { shareMetadata } from "@/features/seo/shareMetadata";
import { webPageJsonLd } from "@/features/seo/webPage";
import type { JsonLdData } from "@/lib/jsonLd";

import { LEGAL_PATHS } from "./legalDocs";
import type { LegalDoc } from "./types";

/** Legal pages with no search value: Google may follow their links but not list them (they're also left out of the sitemap). */
const NOT_LISTED_ON_GOOGLE: readonly LegalDoc["slug"][] = ["impressum", "cookies"];

export const legalMetadata = (doc: LegalDoc): Metadata => ({
  title: doc.title,
  description: doc.intro,
  alternates: { canonical: LEGAL_PATHS[doc.slug] },
  ...(NOT_LISTED_ON_GOOGLE.includes(doc.slug) ? { robots: { index: false, follow: true } } : {}),
  ...shareMetadata({ path: LEGAL_PATHS[doc.slug], title: doc.title, description: doc.intro, images: [], dates: doc.dates }),
});

/** The page and its dates. */
export const legalJsonLd = (doc: LegalDoc): JsonLdData => ({
  "@context": "https://schema.org",
  ...webPageJsonLd({ path: LEGAL_PATHS[doc.slug], name: doc.title, dates: doc.dates }),
});
