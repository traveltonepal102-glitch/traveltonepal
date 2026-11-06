import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { getHomeData } from "@/features/home/services/homeRepository";
import { TrekPage } from "@/features/trek-page/components/TrekPage";
import { trekPageMetadata } from "@/features/trek-page/seo";
import { findMovedTrekPath, getTrekPage, listTrekPages } from "@/features/trek-page/services/trekPageRepository";
import { ROUTES } from "@/lib/routes";

type SlugPageProps = PageProps<"/[slug]">;

/** Cache Components needs at least one address to prerender; until a website has another trek, this one (a 404). */
const NO_TREK_PAGE_YET = "no-trek-page-yet";

// Every trek with a page is prerendered at build time; one that gets its page later renders on its first visit.
export const generateStaticParams = async () => {
  const treks = await listTrekPages();
  return (treks.length > 0 ? treks.map((trek) => trek.slug) : [NO_TREK_PAGE_YET]).map((slug) => ({ slug }));
};

// An address not built yet waits for its finished page instead of streaming a shell (which would fix the status at 200),
// so an unknown address answers a real 404 and the main trek's and a renamed trek's a real 308, also on the first visit.
export const ensureStatic = "navigation";

export const generateMetadata = async ({ params }: SlugPageProps): Promise<Metadata> => {
  const page = await getTrekPage((await params).slug);
  return page ? trekPageMetadata(page) : { title: "Page not found" };
};

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params;
  const page = await getTrekPage(slug);
  if (page) return <TrekPage data={page} />;

  // The main trek's page is the home page; a renamed trek's old address moves on to today's; anything else is a 404.
  const { trekCard } = await getHomeData();
  if (trekCard?.slug === slug) permanentRedirect(ROUTES.home);
  const moved = await findMovedTrekPath(slug);
  if (moved) permanentRedirect(moved === `/${trekCard?.slug}` ? ROUTES.home : moved);
  notFound();
};

export default SlugPage;
