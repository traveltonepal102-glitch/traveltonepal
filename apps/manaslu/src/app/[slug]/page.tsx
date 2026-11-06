import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { BlogArticlePage } from "@/features/blog-article/components/BlogArticlePage";
import { blogMetadata } from "@/features/blog-article/seo";
import { getBlogArticle } from "@/features/blog-article/services/blogArticleRepository";
import { listBlogPages } from "@/features/blogs/services/blogsRepository";
import { getHomeData } from "@/features/home/services/homeRepository";
import { TrekPage } from "@/features/trek-page/components/TrekPage";
import { trekPageMetadata } from "@/features/trek-page/seo";
import { findMovedPath, getTrekPage } from "@/features/trek-page/services/trekPageRepository";
import { listTrekPages } from "@/features/trek-page/services/trekPagesList";
import { ROUTES } from "@/lib/routes";

type SlugPageProps = PageProps<"/[slug]">;

/** Cache Components needs at least one address to prerender; until a website has another trek or a blog, this one (a 404). */
const NO_PAGE_YET = "no-page-yet";

// Every trek with a page and every blog is prerendered at build time; one added later renders on its first visit.
export const generateStaticParams = async () => {
  const pages = [...(await listTrekPages()), ...(await listBlogPages())];
  return (pages.length > 0 ? [...new Set(pages.map((page) => page.slug))] : [NO_PAGE_YET]).map((slug) => ({ slug }));
};

// An address not built yet waits for its finished page instead of streaming a shell (which would fix the status at 200),
// so an unknown address answers a real 404 and the main trek's and a renamed trek's a real 308, also on the first visit.
export const ensureStatic = "navigation";

export const generateMetadata = async ({ params }: SlugPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const trek = await getTrekPage(slug);
  if (trek) return trekPageMetadata(trek);
  const blog = await getBlogArticle(slug);
  return blog ? blogMetadata(blog) : { title: "Page not found" };
};

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params;
  const trek = await getTrekPage(slug);
  if (trek) return <TrekPage data={trek} />;
  const blog = await getBlogArticle(slug);
  if (blog) return <BlogArticlePage blog={blog} />;

  // The main trek's page is the home page; a renamed trek's or blog's old address moves on to today's; anything else is a 404.
  const { trekCard } = await getHomeData();
  if (trekCard?.slug === slug) permanentRedirect(ROUTES.home);
  const moved = await findMovedPath(slug);
  if (moved) permanentRedirect(moved === `/${trekCard?.slug}` ? ROUTES.home : moved);
  notFound();
};

export default SlugPage;
