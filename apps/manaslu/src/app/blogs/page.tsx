import { BlogsPage } from "@/features/blogs/components/BlogsPage";
import { getBlogsPage } from "@/features/blogs/services/blogsRepository";
import { sitePageMetadata } from "@/features/site-pages/seo";
import { ROUTES } from "@/lib/routes";

export const generateMetadata = async () => sitePageMetadata((await getBlogsPage()).top, ROUTES.blogs);

const Blogs = () => <BlogsPage />;

export default Blogs;
