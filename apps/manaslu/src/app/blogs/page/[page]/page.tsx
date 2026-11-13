import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { blogPageCount } from "@/features/blogs/blogFiltering";
import { BlogsPage } from "@/features/blogs/components/BlogsPage";
import { blogsPageTitle } from "@/features/blogs/seo";
import { getBlogsPage } from "@/features/blogs/services/blogsRepository";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES, blogsPagePath } from "@/lib/routes";

type BlogsListPageProps = PageProps<"/blogs/page/[page]">;

/** "2" → 2; anything that isn't a whole number above 0 written plainly ("02", "2a") → null. */
const toPageNumber = (page: string) => (/^[1-9]\d*$/.test(page) ? Number(page) : null);

// Every page after the first is built ahead (the first is /blogs). Cache Components needs at least one address, so a
// list of a single page still builds "2" (a 404).
export const generateStaticParams = async () => {
  const pageCount = blogPageCount((await getBlogsPage()).guides.length);
  return Array.from({ length: Math.max(1, pageCount - 1) }, (_, index) => ({ page: String(index + 2) }));
};

// A page not built yet (a new blog made the list longer) waits for its finished page, so a page past the end answers a
// real 404 and page 1 a real 308; the development check for "instant" navigation leaves this route alone.
export const ensureStatic = "navigation";
export const instant = false;

export const generateMetadata = async ({ params }: BlogsListPageProps): Promise<Metadata> => {
  const page = toPageNumber((await params).page);
  const { top, guides } = await getBlogsPage();
  if (!page || page > blogPageCount(guides.length)) return { title: "Page not found" };
  // Its own address is its canonical: each page lists different blogs.
  return sitePageMetadata({ ...top, seo: { ...top.seo, title: blogsPageTitle(top.seo.title, page) } }, blogsPagePath(page));
};

const BlogsListPage = async ({ params }: BlogsListPageProps) => {
  const page = toPageNumber((await params).page);
  if (page === 1) permanentRedirect(ROUTES.blogs);
  if (!page || page > blogPageCount((await getBlogsPage()).guides.length)) notFound();
  return <BlogsPage listPage={page} />;
};

export default BlogsListPage;
