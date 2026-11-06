import type { MetadataRoute } from "next";

import { getHomeData } from "@/features/home/services/homeRepository";
import { absoluteUrl } from "@/lib/site";

/** /robots.txt: nothing may be crawled until the website goes live in the admin's Sites. */
const robots = async (): Promise<MetadataRoute.Robots> => {
  const { seo } = await getHomeData();
  if (!seo.isLive) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/whatsapp", "/email", "/review"] }, sitemap: absoluteUrl("/sitemap.xml") };
};

export default robots;
