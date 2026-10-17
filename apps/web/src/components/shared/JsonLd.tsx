import { serializeJsonLd } from "@/lib/jsonLd";
import type { JsonLdData } from "@/lib/jsonLd";

/** Structured data (schema.org) for search engines. */
export const JsonLd = ({ data }: { data: JsonLdData }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
);
