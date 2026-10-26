import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/** /robots.txt: every page may be crawled (pages that shouldn't be found say `noindex` themselves); points to the sitemap. */
const robots = (): MetadataRoute.Robots => ({
  // /whatsapp and /email only redirect to a chat or an email (no content of their own).
  rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/whatsapp", "/email"] },
  sitemap: absoluteUrl("/sitemap.xml"),
});

export default robots;
