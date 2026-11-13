/** This website's addresses (flat: a trek or a travel guide is directly under the root). */
export const ROUTES = {
  home: "/",
  blogs: "/blogs",
  about: "/about",
  contact: "/contact",
  /** The blog post with the latest news from the Manaslu trails, linked from the menu as "Manaslu Updates". */
  updates: "/manaslu-trek-latest-update-news",
  terms: "/terms",
  privacy: "/privacy",
  impressum: "/impressum",
  cookies: "/cookies",
  /** Redirects to the "write a review" link in Site settings (a plain link, not a page). */
  review: "/review",
} as const;

/** A trek's or a travel guide's address. */
export const pagePath = (slug: string) => `/${slug}`;
