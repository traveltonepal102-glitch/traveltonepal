/** This website's addresses (flat: a trek or a travel guide is directly under the root). */
export const ROUTES = {
  home: "/",
  travelGuides: "/travel-guides",
  about: "/about",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  impressum: "/impressum",
  cookies: "/cookies",
} as const;

/** A trek's or a travel guide's address. */
export const pagePath = (slug: string) => `/${slug}`;
