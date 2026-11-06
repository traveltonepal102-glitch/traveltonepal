import type { MetadataRoute } from "next";

import { getAboutContent } from "@/features/about/services/aboutRepository";
import { getContactPage } from "@/features/contact/services/contactRepository";
import { getHomeData } from "@/features/home/services/homeRepository";
import { LEGAL_PAGES } from "@/features/legal/legalPages";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/** /sitemap.xml: the pages built so far that Google may list; the main trek's page is only "/" (its own address redirects here). Empty until the website is live. */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { seo } = await getHomeData();
  if (!seo.isLive) return [];
  const legal = await Promise.all(
    LEGAL_PAGES.filter((page) => page.isListed).map(async (page) => ({ url: absoluteUrl(page.path), lastModified: (await getLegalDoc(page.slug)).dates?.modified })),
  );
  const [about, contact] = await Promise.all([getAboutContent(), getContactPage()]);
  return [
    { url: absoluteUrl(ROUTES.home), lastModified: seo.dates?.modified },
    { url: absoluteUrl(ROUTES.about), lastModified: about.top.dates?.modified },
    { url: absoluteUrl(ROUTES.contact), lastModified: contact.top.dates?.modified },
    ...legal,
  ];
};

export default sitemap;
