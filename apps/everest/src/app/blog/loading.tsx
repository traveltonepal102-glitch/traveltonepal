import { BlogsPageSkeleton } from "@/features/blogs/components/BlogsPageSkeleton";

/** Shown at once when a link to the blog (or one of its pages) is clicked, until the page arrives. */
const BlogLoading = () => <BlogsPageSkeleton />;

export default BlogLoading;
