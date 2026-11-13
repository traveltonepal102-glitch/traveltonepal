import type { MetadataRoute } from "next";

import { getAboutContent } from "@/features/about/services/aboutRepository";
import { getBlogsPage } from "@/features/blogs/services/blogsRepository";
import { getContactPage } from "@/features/contact/services/contactRepository";
import { getHomeData } from "@/features/home/services/homeRepository";
import { LEGAL_PAGES } from "@/features/legal/legalPages";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { listListedPages } from "@/features/site-pages/services/pageSeoOverridesRepository";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/** /sitemap.xml: the pages built so far that Google may list; the main trek's page is only "/" (its own address redirects here), the other treks' and the blogs' their own. Empty until the website is live. */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { seo } = await getHomeData();
  if (!seo.isLive) return [];
  const legal = await Promise.all(
    LEGAL_PAGES.filter((page) => page.isListed).map(async (page) => ({ url: absoluteUrl(page.path), lastModified: (await getLegalDoc(page.slug)).dates?.modified })),
  );
  const [about, contact, blogs, pages] = await Promise.all([getAboutContent(), getContactPage(), getBlogsPage(), listListedPages()]);
  return [
    { url: absoluteUrl(ROUTES.home), lastModified: seo.dates?.modified },
    { url: absoluteUrl(ROUTES.about), lastModified: about.top.dates?.modified },
    { url: absoluteUrl(ROUTES.contact), lastModified: contact.top.dates?.modified },
    { url: absoluteUrl(ROUTES.blogs), lastModified: blogs.top.dates?.modified },
    ...pages.map((page) => ({ url: absoluteUrl(page.path), lastModified: page.modified })),
    ...legal,
  ];
};

export default sitemap;
