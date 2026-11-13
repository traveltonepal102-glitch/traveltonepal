/** This website's addresses (flat: a trek or a travel guide is directly under the root). */
export const ROUTES = {
  home: "/",
  blogs: "/blogs",
  about: "/about",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  impressum: "/impressum",
  cookies: "/cookies",
  /** Redirects to the "write a review" link in Site settings (a plain link, not a page). */
  review: "/review",
} as const;

/** A page of the blog list: the first is the Blogs page itself, the rest have an address of their own, built ahead. */
export const blogsPagePath = (page: number) => (page <= 1 ? ROUTES.blogs : `${ROUTES.blogs}/page/${page}`);

/** A trek's or a travel guide's address. */
export const pagePath = (slug: string) => `/${slug}`;
