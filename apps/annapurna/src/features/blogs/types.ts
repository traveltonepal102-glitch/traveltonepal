import type { HomeGuide } from "@/features/home/types";
import type { SitePageTop } from "@/features/site-pages/types";

/** The Blogs page: its top and Google result from Pages › Travel guides, and every blog of this website, newest first. */
export type BlogsPageData = { top: SitePageTop; guides: HomeGuide[] };
