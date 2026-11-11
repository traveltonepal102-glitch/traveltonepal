import { BlogsPage } from "@/features/blogs/components/BlogsPage";
import { getBlogsPage } from "@/features/blogs/services/blogsRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES } from "@/lib/routes";

export const generateMetadata = async () => sitePageMetadata((await getBlogsPage()).top, ROUTES.blogs);

const Blogs = () => (
  <>
    <BlogsPage />
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "travel-guides" }]} />
  </>
);

export default Blogs;
