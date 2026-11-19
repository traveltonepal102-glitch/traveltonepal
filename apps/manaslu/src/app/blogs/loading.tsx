import { BlogsPageSkeleton } from "@/features/blogs/components/BlogsPageSkeleton";

/** Shown at once when a link to the blog list (or one of its pages) is clicked, until the page arrives. */
const BlogsLoading = () => <BlogsPageSkeleton />;

export default BlogsLoading;
