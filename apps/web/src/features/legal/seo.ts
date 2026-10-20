import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

import { LEGAL_PATHS } from "./legalDocs";
import type { LegalDoc } from "./types";

export const legalMetadata = (doc: LegalDoc): Metadata => ({
  title: doc.title,
  description: doc.intro,
  alternates: { canonical: LEGAL_PATHS[doc.slug] },
  openGraph: { type: "website", siteName: SITE_NAME, url: LEGAL_PATHS[doc.slug], title: doc.title, description: doc.intro },
});
