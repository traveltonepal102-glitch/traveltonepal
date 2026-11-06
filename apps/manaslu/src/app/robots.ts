import type { MetadataRoute } from "next";

import { getHomeData } from "@/features/home/services/homeRepository";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/** /robots.txt: nothing may be crawled until the website goes live in the admin's Sites; after that, everything but the redirects and the blogs' search results. */
const robots = async (): Promise<MetadataRoute.Robots> => {
  const { seo } = await getHomeData();
  if (!seo.isLive) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/whatsapp", "/email", "/review", `${ROUTES.blogs}?*q=`] }, sitemap: absoluteUrl("/sitemap.xml") };
};

export default robots;
